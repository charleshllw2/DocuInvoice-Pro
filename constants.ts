import { InvoiceData } from './types';

// NOTE: In a real production app, these would come from environment variables.
// Users must supply their own API Key and Client ID to make the Google APIs work fully.
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
export const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || 'YOUR_API_KEY_HERE';
export const SCOPES = 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file';

export const DEFAULT_INVOICE: InvoiceData = {
  id: '',
  invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
  date: new Date().toISOString().split('T')[0],
  status: 'Draft',
  company: {
    name: '',
    logoUrl: null,
  },
  customer: {
    name: '',
    email: '',
    phone: '',
    address: '',
  },
  job: {
    type: '',
    description: '',
    cost: 0,
    taxRate: 0,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  recurring: {
    frequency: 'None',
    startDate: new Date().toISOString().split('T')[0],
    autoSend: false,
  },
};
