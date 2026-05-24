import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, MrrDataPoint } from '../../core/services/analytics.service';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  isLoading = true;
  errorMessage = '';

  // Data storage
  mrrHistory: MrrDataPoint[] = [];
  planDist: Record<string, number> = { FREE: 0, PRO: 0, ENTERPRISE: 0 };
  invoiceStatus: Record<string, number> = { PAID: 0, PENDING: 0, OVERDUE: 0 };

  // UI calculations
  planPercentages: Record<string, number> = { FREE: 0, PRO: 0, ENTERPRISE: 0 };
  totalPlans = 0;
  totalInvoiceSum = 0;
  invoicePercentages: Record<string, number> = { PAID: 0, PENDING: 0, OVERDUE: 0 };

  // SVG Line Chart properties
  svgLinePath = '';
  svgAreaPath = '';
  svgPoints: { x: number; y: number; val: number; label: string }[] = [];

  private tenantSub!: Subscription;

  constructor(
    private analyticsService: AnalyticsService,
    private tenantContextService: TenantContextService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tenantSub = this.tenantContextService.currentTenant$.subscribe(tenantId => {
      if (tenantId) {
        this.loadAnalyticsData(tenantId);
      } else {
        this.isLoading = false;
        this.errorMessage = 'Please select a tenant from the top right.';
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.tenantSub) this.tenantSub.unsubscribe();
  }

  private loadAnalyticsData(tenantId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Parallel calls using standard subscription sequence
    this.analyticsService.getMrrHistory(tenantId).subscribe({
      next: (mrrData) => {
        this.mrrHistory = mrrData;
        this.calculateSvgChart();

        this.analyticsService.getSubscriptionsDistribution(tenantId).subscribe({
          next: (subData) => {
            this.planDist = subData;
            this.calculatePlanPercentages();

            this.analyticsService.getInvoicesStatus(tenantId).subscribe({
              next: (invData) => {
                this.invoiceStatus = invData;
                this.calculateInvoicePercentages();
                this.isLoading = false;
                this.cdr.detectChanges();
              },
              error: () => this.handleError()
            });
          },
          error: () => this.handleError()
        });
      },
      error: () => this.handleError()
    });
  }

  private calculatePlanPercentages(): void {
    this.totalPlans = Object.values(this.planDist).reduce((a, b) => a + b, 0);
    for (const key of Object.keys(this.planDist)) {
      this.planPercentages[key] = this.totalPlans > 0 ? Math.round((this.planDist[key] / this.totalPlans) * 100) : 0;
    }
  }

  private calculateInvoicePercentages(): void {
    this.totalInvoiceSum = Object.values(this.invoiceStatus).reduce((a, b) => a + b, 0);
    for (const key of Object.keys(this.invoiceStatus)) {
      this.invoicePercentages[key] = this.totalInvoiceSum > 0 ? (this.invoiceStatus[key] / this.totalInvoiceSum) * 100 : 0;
    }
  }

  // Generates coordinate points inside a viewBox (500x200)
  private calculateSvgChart(): void {
    if (this.mrrHistory.length === 0) return;

    const maxMrr = Math.max(...this.mrrHistory.map(d => d.mrr), 100);
    const points: { x: number; y: number; val: number; label: string }[] = [];

    // Scale coordinates inside viewBox="0 0 500 200"
    for (let i = 0; i < this.mrrHistory.length; i++) {
      const x = 50 + i * 80;
      const y = 160 - (this.mrrHistory[i].mrr / maxMrr) * 120; // 40px padding top/bottom
      points.push({ x, y, val: this.mrrHistory[i].mrr, label: this.mrrHistory[i].month });
    }
    this.svgPoints = points;

    // Draw the Line Path
    this.svgLinePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    // Draw the Closed Area path (draws down to bottom baseline y=160 to fill the gradient)
    if (points.length > 0) {
      const first = points[0];
      const last = points[points.length - 1];
      this.svgAreaPath = `${this.svgLinePath} L ${last.x} 160 L ${first.x} 160 Z`;
    }
  }

  private handleError(): void {
    this.errorMessage = 'Could not load analytics summaries.';
    this.isLoading = false;
    this.cdr.detectChanges();
  }
}
