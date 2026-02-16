import React from 'react';
import { InvoiceData } from '../types';
import { calculateTotals, formatCurrency, formatDate } from '../services/invoiceUtils';

interface InvoicePreviewProps {
  data: InvoiceData;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const { subtotal, taxAmount, total } = calculateTotals(data.job);

  return (
    <div className="w-full h-full bg-gray-100 p-4 md:p-8 overflow-auto flex justify-start md:justify-center items-start">
      {/* A4 Paper Aspect Ratio (approx). min-w-[210mm] enforces A4 width even on mobile, triggering scroll */}
      <div className="bg-white shadow-2xl w-[210mm] min-w-[210mm] min-h-[297mm] p-12 relative flex flex-col text-sm text-gray-800 shrink-0 scale-90 md:scale-100 origin-top">
        
        {/* Recurring Badge */}
        {data.recurring.frequency !== 'None' && (
          <div className="absolute top-0 right-0 bg-brand-50 text-brand-600 text-xs font-semibold px-4 py-2 rounded-bl-lg border-b border-l border-brand-100 uppercase tracking-wide">
            Recurring: {data.recurring.frequency}
          </div>
        )}
        
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex flex-col">
            {data.company.logoUrl && (
              <img 
                src={data.company.logoUrl} 
                alt="Company Logo" 
                className="h-16 w-auto object-contain mb-4 self-start" 
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {data.company.name || 'Your Company Name'}
            </h1>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-light text-gray-300 tracking-widest mb-2">INVOICE</h2>
            <p className="text-gray-500 font-medium">#{data.invoiceNumber}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
            <p className="font-semibold text-gray-900">{data.customer.name || 'Customer Name'}</p>
            <p className="text-gray-600 whitespace-pre-line">{data.customer.address || 'Address'}</p>
            <p className="text-gray-600 mt-2">{data.customer.email}</p>
            <p className="text-gray-600">{data.customer.phone}</p>
          </div>
          <div className="text-right">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice Date</h3>
              <p className="text-gray-900">{formatDate(data.date)}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Due Date</h3>
              <p className="text-gray-900">{formatDate(data.job.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Job Details Table */}
        <div className="mb-12">
          <div className="border-b-2 border-gray-100 pb-2 mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Details</h3>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="w-3/4">
              <h4 className="font-semibold text-gray-900">{data.job.type || 'Job Type'}</h4>
              <p className="text-gray-600 mt-1 text-sm">{data.job.description || 'Description of the services performed...'}</p>
            </div>
            <div className="w-1/4 text-right font-medium text-gray-900">
              {formatCurrency(data.job.cost)}
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Tax ({data.job.taxRate}%)</span>
              <span className="font-medium text-gray-900">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-lg font-bold text-brand-600">Total Due</span>
              <span className="text-lg font-bold text-brand-600">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-gray-100 pt-8 text-center text-gray-500 text-sm">
          <p className="mb-2">Thank you for your business!</p>
          <p>Please make checks payable to {data.company.name || 'Company Name'}.</p>
        </div>

      </div>
    </div>
  );
};

export default InvoicePreview;