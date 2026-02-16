import { JobDetails } from '../types';

export const calculateTotals = (job: JobDetails) => {
  const subtotal = job.cost || 0;
  const taxAmount = (subtotal * (job.taxRate || 0)) / 100;
  const total = subtotal + taxAmount;

  return {
    subtotal,
    taxAmount,
    total,
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
