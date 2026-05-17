import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Tenant } from "../models/tenant.model";

@Injectable({
    providedIn: 'root'
})

export class TenantService {
    private readonly apiUrl = 'http://localhost:8080/api/tenants';

    constructor(private http: HttpClient) {}

    getAllTenants(): Observable<Tenant[]>{
        return this.http.get<Tenant[]>(this.apiUrl);
    }

    createTenant(companyName: string): Observable<Tenant> {
        const params = new HttpParams().set('companyName', companyName);
        return this.http.post<Tenant>(this.apiUrl, null, {params});
    }
}