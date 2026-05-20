import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerService } from '../../core/services/customer.service';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { Customer } from '../../core/models/customer.model';
import { AddCustomerModalComponent } from './add-customer-modal/add-customer-modal';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  kpis = [
    { label: 'Monthly Recurring Revenue', value: '$0', change: 'Calculating...', positive: true, icon: '💰', colorClass: 'kpi-green' },
    { label: 'Active Customers', value: '0', change: 'Calculating...', positive: true, icon: '👥', colorClass: 'kpi-blue' },
    { label: 'Churn Rate', value: '0%', change: 'Calculating...', positive: false, icon: '📉', colorClass: 'kpi-red' },
    { label: 'Annual Run Rate', value: '$0', change: 'Calculating...', positive: true, icon: '📈', colorClass: 'kpi-purple' },
  ];

  recentCustomers: Customer[] = [];
  isLoading = true;
  errorMessage = '';

  private currentTenantId: string | null=null;
  private tenantSub!: Subscription;

  constructor(
    private customerService: CustomerService,
    private tenantContextService: TenantContextService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Listen for tenant changes! Whenever the dropdown in the header changes, this runs.
    this.tenantSub = this.tenantContextService.currentTenant$.subscribe(tenantId=>{
      this.currentTenantId = tenantId;
      if (tenantId){
        this.loadCustomers();
      }else{
        this.isLoading = false;
        this.errorMessage = 'Please select a tenant from the top right.';
        this.cdr.detectChanges();
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.tenantSub) this.tenantSub.unsubscribe();
  }

  private loadCustomers(): void{
    this.isLoading = true;
    this.customerService.getCustomersByTenant(this.currentTenantId!).subscribe({
      next: (customers)=>{
        this.recentCustomers = customers;

        //Dynamic KPI calculation based on data
        this.kpis[1].value = customers.length.toString();
        this.kpis[1].change = `${customers.length} total customers`;

        // Mocking MRR calculation for now based on customer count (ex: $49 avg per customer)
        const mockMrr = customers.length*49;
        this.kpis[0].value = `$${mockMrr}`;
        this.kpis[3].value = `$${mockMrr*12}` //Annual Run Rate

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err)=>{
        this.errorMessage = 'Could not load data.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddCustomerModal(): void{
    if (!this.currentTenantId) return;

    const dialogRef = this.dialog.open(AddCustomerModalComponent,{
      width: '400px',
      data: {tenantId: this.currentTenantId}
    });

    dialogRef.afterClosed().subscribe(newCustomer => {
      if (newCustomer){
        // If a customer was created successfully, reload the table!
        this.loadCustomers();
      }
    });
  }
}