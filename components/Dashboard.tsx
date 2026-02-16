import React from 'react';
import { InvoiceData } from '../types';
import { calculateTotals, formatCurrency, formatDate } from '../services/invoiceUtils';
import Button from './Button';
import { Plus, ExternalLink, FileText, Calendar, User, DollarSign } from 'lucide-react';

interface DashboardProps {
  invoices: InvoiceData[];
  onCreateNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ invoices, onCreateNew }) => {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <FileText size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Invoices Yet</h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Create your first invoice to see it appear here. You can generate PDF documents and share them instantly.
        </p>
        <Button onClick={onCreateNew} icon={<Plus size={20} />}>
          Create New Invoice
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Invoice History</h1>
        <Button onClick={onCreateNew} icon={<Plus size={18} />}>
          New Invoice
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => {
                const { total } = calculateTotals(invoice.job);
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'Generated' 
                          ? 'bg-green-100 text-green-800' 
                          : invoice.status === 'Paid'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {formatDate(invoice.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        {invoice.customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {invoice.docUrl ? (
                        <a 
                          href={invoice.docUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-brand-600 hover:text-brand-900 inline-flex items-center gap-1"
                        >
                          View Doc <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-gray-400">Draft</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Mobile Card View (visible only on small screens if we wanted to hide table, but scrolling table is often better. 
          Adding a simple summary count for now) */}
      <div className="mt-4 text-xs text-gray-500 text-center sm:text-left">
        Showing {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default Dashboard;
