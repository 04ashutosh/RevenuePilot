import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface KpiCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
  colorClass: string;
}

interface Customer {
  name: string;
  email: string;
  status: string;
  joined: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {

  // These values will be replaced by real API calls in Phase 5
  kpis: KpiCard[] = [
    { label: 'Monthly Recurring Revenue', value: '$48,295', change: '↑ 12.5% vs last month', positive: true, icon: '💰', colorClass: 'kpi-green' },
    { label: 'Active Customers', value: '1,284', change: '↑ 8.1% vs last month', positive: true, icon: '👥', colorClass: 'kpi-blue' },
    { label: 'Churn Rate', value: '2.4%', change: '↑ 0.3% vs last month', positive: false, icon: '📉', colorClass: 'kpi-red' },
    { label: 'Annual Run Rate', value: '$579,540', change: '↑ 18.2% vs last year', positive: true, icon: '📈', colorClass: 'kpi-purple' },
  ];

  recentCustomers: Customer[] = [
    { name: 'Stripe Inc.', email: 'billing@stripe.com', status: 'ACTIVE', joined: 'May 12, 2026' },
    { name: 'Vercel LLC', email: 'finance@vercel.com', status: 'ACTIVE', joined: 'May 10, 2026' },
    { name: 'Linear Corp', email: 'ops@linear.app', status: 'TRIAL', joined: 'May 15, 2026' },
  ];
}
