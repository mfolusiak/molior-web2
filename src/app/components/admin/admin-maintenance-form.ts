import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CleanupService } from 'src/app/services/admin.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-admin-maintenance-form',
  templateUrl: './admin-maintenance-form.html',
  styleUrls: ['./admin-form.scss'],
  providers: [ CleanupService ],
})
export class AdminMaintenanceFormComponent implements OnInit {
  form: FormGroup;
  maintenanceMode: ['false]'];
  maintenanceMessage: [''];
  clicked: boolean;

  constructor(
    public dialog: MatDialogRef<AdminMaintenanceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected cleanupService: CleanupService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      maintenanceMode: [this.data.maintenanceMode],
      maintenanceMessage: [this.data.maintenanceMessage],
    });

    // Check if there's an existing selected time to populate the dropdowns
    if (this.data.maintenanceMode) {
      this.form.patchValue(this.maintenanceMode);
    }
  }
  
  ngOnInit() {
    // Optional: You can subscribe to value changes if needed
    this.form.valueChanges.subscribe(value => {
      console.log(value); // Log the form value changes
    });
  }
 
 }

