import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TenantService } from "../core/services/tenant.service";
import { TenantContextService } from "../core/services/tenant-context.service";
import { Tenant } from "../core/models/tenant.model";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})

export class ShellComponent implements OnInit {
  tenants: Tenant[] = [];
  selectedTenantId: string = '';

  constructor(
    private tenantService: TenantService,
    private tenantContextService: TenantContextService
  ) {}

  ngOnInit() {
    this.tenantService.getAllTenants().subscribe(tenants=>{
      this.tenants = tenants;
      if (tenants.length > 0){
        // Auto-select the first tenant
        this.selectedTenantId = tenants[0].id;
        this.onTenantChange();
      }
    });
  }

  onTenantChange() {
    this.tenantContextService.setTenantId(this.selectedTenantId);
  }
}