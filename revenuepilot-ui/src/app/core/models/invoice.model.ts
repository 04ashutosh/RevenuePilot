import { Customer } from "./customer.model";

export interface Invoice{
    id: string;
    customer: Customer;
    amount: number;
    dueDate: string;
    status: 'PAID' | 'PENDING' | 'OVERDUE';
    createdAt: string;
}