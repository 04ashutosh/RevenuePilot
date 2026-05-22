import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Invoice } from "../models/invoice.model";

@Injectable({
    providedIn: 'root'
})

export class InvoiceService{
    private readonly apiHost = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';
    private readonly apiUrl = `${this.apiHost}/api/invoices`;

    constructor(private http: HttpClient) {}

    getInvoicesByTenant(tenantId: string): Observable<Invoice[]>{
        return this.http.get<Invoice[]>(`${this.apiUrl}/tenant/${tenantId}`);
    }
}