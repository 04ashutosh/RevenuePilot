import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly apiHost = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';
  private readonly apiUrl = `${this.apiHost}/api/ai`;

  constructor(private http: HttpClient) {}

  chat(tenantId: string, message: string): Observable<{ response: string }> {
    const params = new HttpParams()
      .set('tenantId', tenantId)
      .set('message', message);
    return this.http.post<{ response: string }>(`${this.apiUrl}/chat`, {}, { params });
  }

  generateInvoiceEmail(invoiceId: string): Observable<{ email: string }> {
    const params = new HttpParams().set('invoiceId', invoiceId);
    return this.http.post<{ email: string }>(`${this.apiUrl}/invoice-email`, {}, { params });
  }
}