import { Routes } from "@angular/router";
import { ShellComponent } from "./shell/shell";
import { DashboardComponent } from "./pages/dashboard/dashboard";
import { SubscriptionsComponent } from "./pages/subscriptions/subscriptions";
import { InvoicesComponent } from "./pages/invoices/invoices";
import { AnalyticsComponent } from "./pages/analytics/analytics";

export const routes: Routes = [
    {
        path: '',
        component: ShellComponent,
        children: [
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: DashboardComponent},
            {path: 'subscriptions', component: SubscriptionsComponent},
            {path: 'invoices', component: InvoicesComponent},
            {path: 'analytics', component: AnalyticsComponent}
        ]
    }
];