import { OnInit, Component,ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SubscriptionService } from "../../core/services/subscription.service";
import { PlanService } from "../../core/services/plan.service";
import { Subscription } from "../../core/models/subscription.model";
import { Plan } from "../../core/models/plan.model";

@Component({
  selector: 'app-subscriptions',
  imports: [CommonModule],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css'
})

export class SubscriptionsComponent implements OnInit {
  subscriptions: Subscription[] = [];
  plans: Plan[] = [];
  isLoading = true;
  errorMessage = '';

  private readonly DEMO_TENANT_ID = '059eae2f-0b0e-41a6-b56a-733d96943641';

  constructor(
    private subscriptionService: SubscriptionService,
    private planService: PlanService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadPlans();
    this.loadSubscriptions();
  }

  private loadPlans(): void {
    this.planService.getAllPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.cdr.detectChanges();
      },
      error: ()=> {this.errorMessage = 'Could not load plans.'}
    });
  }

  private loadSubscriptions(): void {
    this.subscriptionService.getByTenant(this.DEMO_TENANT_ID).subscribe({
      next: (subs) => {
        this.subscriptions = subs;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: ()=>{
        this.errorMessage = 'Could not connect to backend.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getPlanBadgeClass(planName: string): string {
    switch (planName?.toUpperCase()){
      case 'ENTERPRISE': return 'badge-enterprise';
      case 'PRO':        return 'badge-pro';
      default:           return 'badge-free';
    }
  }
}