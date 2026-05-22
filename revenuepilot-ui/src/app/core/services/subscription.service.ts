import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Subscription } from "../models/subscription.model";

@Injectable({
    providedIn: 'root'
})

export class SubscriptionService {
    private readonly apiHost = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';
    private readonly apiUrl = `${this.apiHost}/api/subscriptions`;

    constructor(private http: HttpClient){}

    getByTenant(tenantId: string): Observable<Subscription[]>{
        return this.http.get<Subscription[]>(`${this.apiUrl}/tenant/${tenantId}`);
    }

    createSubscription(customerId: string, planId: string): Observable<Subscription> {
        const params = new HttpParams()
            .set('customerId',customerId)
            .set('planId',planId);
        return this.http.post<Subscription>(this.apiUrl,null,{params});
    }
}