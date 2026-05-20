import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-add-customer-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  template: `
    <div class="modal-container">
      <h2 mat-dialog-title>Add New Customer</h2>
      <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content class="modal-content">
          
          <div class="form-group">
            <label>Customer Name</label>
            <input type="text" formControlName="name" placeholder="e.g. Stripe Inc" class="form-input">
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input type="email" formControlName="email" placeholder="e.g. billing@stripe.com" class="form-input">
          </div>

          <div *ngIf="errorMessage" class="error-text">{{ errorMessage }}</div>

        </mat-dialog-content>
        <mat-dialog-actions class="modal-actions">
          <button type="button" class="btn btn-secondary" mat-dialog-close>Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="customerForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Creating...' : 'Create Customer' }}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .modal-container { padding: 24px; font-family: 'Inter', sans-serif; }
    h2 { margin: 0 0 20px 0; font-size: 20px; color: #0f172a; }
    .modal-content { display: flex; flex-direction: column; gap: 16px; overflow: visible; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 13px; font-weight: 600; color: #475569; }
    .form-input { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; }
    .form-input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
    .modal-actions { margin-top: 24px; display: flex; justify-content: flex-end; gap: 12px; }
    .btn { padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; }
    .btn-secondary { background: #f1f5f9; color: #475569; }
    .btn-primary { background: #6366f1; color: white; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .error-text { color: #ef4444; font-size: 13px; }
  `]
})
export class AddCustomerModalComponent{
  customerForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<AddCustomerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {tenantId: string}
  ){
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(){
    if (this.customerForm.invalid) return;

    this.isSubmitting = true;
    const {name, email} = this.customerForm.value;

    this.customerService.createCustomer(this.data.tenantId,name,email).subscribe({
      next: (customer) => this.dialogRef.close(customer), //Pass created customer back

      error: (err)=> {
        this.errorMessage = 'Failed to create customer.';
        this.isSubmitting = false;
      }
    });
  }
}