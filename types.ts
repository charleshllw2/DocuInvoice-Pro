export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface JobDetails {
  type: string;
  description: string;
  cost: number;
  taxRate: number; // Percentage
  dueDate: string;
}

export interface Company {
  name: string;
  logoUrl: string | null;
}

export type RecurringFrequency = 'None' | 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';

export interface RecurringOptions {
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string;
  autoSend: boolean;
}

export interface InvoiceData {
  id: string; // Internal ID
  invoiceNumber: string;
  date: string;
  customer: Customer;
  job: JobDetails;
  company: Company;
  recurring: RecurringOptions;
  status: 'Draft' | 'Generated' | 'Paid';
  docUrl?: string;
  docId?: string;
  createdAt?: any; // Firebase Timestamp
  updatedAt?: any; // Firebase Timestamp
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
