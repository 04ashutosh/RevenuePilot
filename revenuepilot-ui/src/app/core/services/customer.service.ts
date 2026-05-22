import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Customer } from "../models/customer.model";

@Injectable({
    providedIn: 'root' // Available everywhere in the app, no need to register manually
})

export class CustomerService{
    // All API calls go through this base URL - easy to change for production later
    private readonly apiHost = window.location.hostname === 'localhost'?'http://localhost:8080' : '';

    private readonly apiUrl = `${this.apiHost}/api/customers`;

    constructor(private http: HttpClient) {}

    getCustomersByTenant(tenantId: string): Observable<Customer[]> {
        return this.http.get<Customer[]>(`${this.apiUrl}/tenant/${tenantId}`);
    }

    createCustomer(tenantId: string, name: string, email: string): Observable<Customer> {
        const params = new HttpParams()
            .set('tenantId',tenantId)
            .set('name',name)
            .set('email',email);
        return this.http.post<Customer>(this.apiUrl,null,{params});
    }
}