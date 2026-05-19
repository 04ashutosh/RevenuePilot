import { Customer } from "./customer.model";
import { Plan } from "./plan.model";

export interface Subscription {
    id: string;
    customer: Customer;
    plan: Plan;
    status: string;
    startDate: string;
    endDate: string | null;
    createdAt: string;
}