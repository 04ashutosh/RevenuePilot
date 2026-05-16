import { Routes } from "@angular/router";
import { ShellComponent } from "./shell/shell";
import { DashboardComponent } from "./pages/dashboard/dashboard";

export const routes: Routes = [
    {
        path: '',
        component: ShellComponent,
        children: [
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: DashboardComponent},
        ]
    }
];