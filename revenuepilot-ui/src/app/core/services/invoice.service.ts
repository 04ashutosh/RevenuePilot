import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Invoice } from "../models/invoice.model";

@Injectable({
    providedIn: 'root'
})

export class InvoiceService{
    private readonly apiUrl = 'http://localhost:8080/api/invoices';

    constructor(private http: HttpClient) {}

    getInvoicesByTenant(tenantId: string): Observable<Invoice[]>{
        return this.http.get<Invoice[]>(`${this.apiUrl}/tenant/${tenantId}`);
    }
}