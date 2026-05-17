import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CustomerService } from "../../core/services/customer.service";
import { Customer } from "../../core/models/customer.model";

interface KpiCard{
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class DashboardComponent implements OnInit {
  //KPIs

  kpis: KpiCard[] = [
    { label: 'Monthly Recurring Revenue', value: '$0', change: 'Loading...', positive: true, icon: '💰', colorClass: 'kpi-green' },
    { label: 'Active Customers', value: '0', change: 'Loading...', positive: true, icon: '👥', colorClass: 'kpi-blue' },
    { label: 'Churn Rate', value: '0%', change: 'Loading...', positive: false, icon: '📉', colorClass: 'kpi-red' },
    { label: 'Annual Run Rate', value: '$0', change: 'Loading...', positive: true, icon: '📈', colorClass: 'kpi-purple' },
  ];

  recentCustomers: Customer[] = [];
  isLoading = true;
  errorMessage = '';

  // IMPORTANT: Replace this with a real tenant ID from the database after creating one via Postman
  private readonly DEMO_TENANT_ID = '059eae2f-0b0e-41a6-b56a-733d96943641';

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.DEMO_TENANT_ID){
      this.loadCustomers();
    }else{
      this.isLoading = false;
      this.errorMessage = 'No tenant ID configured yet. Create a tenant via the API first!';
    }
  }

  private loadCustomers(): void {
    console.log('🔵 Making HTTP request to backend...');
    this.customerService.getCustomersByTenant(this.DEMO_TENANT_ID).subscribe({
      next: (customers) => {
        console.log('✅ Got customers:', customers);
        this.recentCustomers = customers;
        this.kpis[1].value = customers.length.toString();
        this.kpis[1].change = `${customers.length} total customers`;
        this.isLoading = false;
        this.cdr.detectChanges(); // Force Angular to re-render
      },
      error: (err) => {
        console.error('❌ HTTP Error:', err);
        this.errorMessage = 'Could not connect to backend. Is Spring Boot running?';
        this.isLoading = false;
      }
    });
  }
}