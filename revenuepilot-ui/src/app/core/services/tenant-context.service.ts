import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class TenantContextService{
    //BehaviorSubject remembers the last value and immediately gives it to new subscribers
    private tenantIdSubject = new BehaviorSubject<string | null>(null);

    //Expose as an Observable so components can listen to changes
    public currentTenant$: Observable<string | null> = this.tenantIdSubject.asObservable();

    setTenantId(id:string): void{
        this.tenantIdSubject.next(id);
    }

    getCurrentTenantId(): string | null {
        return this.tenantIdSubject.getValue();
    }
}