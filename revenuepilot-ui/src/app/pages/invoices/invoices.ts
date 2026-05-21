import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoiceService } from "../../core/services/invoice.service";
import { TenantContextService } from "../../core/services/tenant-context.service";
import { Invoice } from "../../core/models/invoice.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css'
})

export class InvoicesComponent implements OnInit, OnDestroy {
  invoices: Invoice[] = [];
  isLoading = true;
  errorMessage = '';

  // Summart Metrics
  totalInvoiced = 0;
  totalPaid = 0;
  totalOutstanding = 0;

  private tenantSub! : Subscription;

  constructor(
    private invoiceService: InvoiceService,
    private tenantContextService: TenantContextService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tenantSub = this.tenantContextService.currentTenant$.subscribe(tenantId => {
      if (tenantId){
        this.loadInvoices(tenantId);
      }else{
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.tenantSub) this.tenantSub.unsubscribe();
  }

  private loadInvoices(tenantId: string): void {
    this.isLoading = true;
    this.invoiceService.getInvoicesByTenant(tenantId).subscribe({
      next: (data) => {
        this.invoices = data;
        this.calculateMetrics(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load invoice data.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private calculateMetrics(data: Invoice[]): void{
    this.totalInvoiced = data.reduce((sum,inv)=> sum+inv.amount,0);
    this.totalPaid = data.filter(inv => inv.status==='PAID').reduce((sum,inv)=>sum+inv.amount,0);
    this.totalOutstanding = data.filter(inv => inv.status !== 'PAID').reduce((sum,inv)=>sum+inv.amount,0);
  }

  getStatusBadgeClass(status: string): string {
    switch (status){
      case 'PAID': return 'badge-paid';
      case 'PENDING': return 'badge-pending';
      default: return 'badge-overdue';
    }
  }

  shortenId(id: string): string{
    return id ? `#INV-${id.substring(0,8).toUpperCase()}`: '';
  }
}