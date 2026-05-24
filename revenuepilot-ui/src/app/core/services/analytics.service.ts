import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface MrrDataPoint {
  month: string;
  mrr: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly apiHost = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';
  private readonly apiUrl = `${this.apiHost}/api/analytics`;

  constructor(private http: HttpClient) {}

  getMrrHistory(tenantId: string): Observable<MrrDataPoint[]> {
    return this.http.get<MrrDataPoint[]>(`${this.apiUrl}/tenant/${tenantId}/mrr-history`);
  }

  getSubscriptionsDistribution(tenantId: string): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/tenant/${tenantId}/subscriptions-distribution`);
  }

  getInvoicesStatus(tenantId: string): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/tenant/${tenantId}/invoices-status`);
  }
}
