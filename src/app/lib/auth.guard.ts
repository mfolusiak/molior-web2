import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {AuthService} from '../services/auth.service';
import { catchError, map, tap } from 'rxjs/operators';
import { CleanupService } from '../services/admin.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private cleanupService: CleanupService    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authService.currentUserValue;

         // Check if the route requires admin privileges
        if (route.data.is_admin && route.data.is_admin === true) {
            return this.checkAdminPermissions(currentUser.username);
        } else {
            // For pages that require any logged-in user
            if (currentUser) {
                return this.checkMaintenanceMode().pipe(
                    map((maintenanceMode: boolean) => {
                      if (maintenanceMode) {
                        console.log('Redirecting to maintenance page...');
                        this.router.navigate(['/maintenance']); // Redirect to maintenance page
                        return false;
                      }
                // authorised so return true
                return true;
            }),
            catchError(() => {
                console.error('Error fetching maintenance mode');
                return of(false)
            })
          );
        }
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }
    }

    private checkAdminPermissions(username: string){
        return this.authService.checkAdminPrivilege(username).pipe(
            map((isAdmin: boolean) => {
                if (isAdmin) {
                    return true; // User is an admin, grant access to admin page
                } else {
                    this.router.navigate(['/unauthorized']); // Redirect non-admin users
                    return false;
                }
            })
        );
    }
      // Helper function to check maintenance mode
    private checkMaintenanceMode() {
        return this.cleanupService.getMaintenanceDetails().pipe(
            map((data: any) => {
                console.log('Maintenance Data:', data);
                return data.maintenance_mode === 'true';
            }),
            catchError(() =>{
                console.error('Error fetching maintenance details');
                return of(false)
            })
    );
  }
}
