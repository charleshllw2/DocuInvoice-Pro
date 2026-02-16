import React from 'react';
import { InvoiceData } from '../types';
import Input from './Input';
import { Upload, FileText, User, Briefcase, DollarSign, CalendarClock } from 'lucide-react';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange }) => {
  
  const handleCompanyChange = (field: string, value: any) => {
    onChange({ ...data, company: { ...data.company, [field]: value } });
  };

  const handleCustomerChange = (field: string, value: any) => {
    onChange({ ...data, customer: { ...data.customer, [field]: value } });
  };

  const handleJobChange = (field: string, value: any) => {
    // Handle number inputs
    const val = (field === 'cost' || field === 'taxRate') ? parseFloat(value) || 0 : value;
    onChange({ ...data, job: { ...data.job, [field]: val } });
  };

  const handleRecurringChange = (field: string, value: any) => {
    onChange({ ...data, recurring: { ...data.recurring, [field]: value } });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCompanyChange('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 pb-24">
      
      {/* Company Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-brand-600 font-semibold border-b pb-2">
          <FileText size={18} />
          <h2>Company Details</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-brand-400">
              {data.company.logoUrl ? (
                <img src={data.company.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Upload className="text-gray-400" size={24} />
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleLogoUpload}
              />
            </div>
            <div className="flex-1">
              <Input 
                label="Company Name" 
                value={data.company.name} 
                onChange={(e) => handleCompanyChange('name', e.target.value)}
                placeholder="Acme Inc."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-brand-600 font-semibold border-b pb-2">
          <User size={18} />
          <h2>Customer Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Full Name" 
            value={data.customer.name} 
            onChange={(e) => handleCustomerChange('name', e.target.value)}
          />
          <Input 
            label="Email" 
            type="email"
            value={data.customer.email} 
            onChange={(e) => handleCustomerChange('email', e.target.value)}
          />
          <Input 
            label="Phone" 
            type="tel"
            value={data.customer.phone} 
            onChange={(e) => handleCustomerChange('phone', e.target.value)}
          />
          <Input 
            label="Address" 
            value={data.customer.address} 
            onChange={(e) => handleCustomerChange('address', e.target.value)}
          />
        </div>
      </section>

      {/* Job Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-brand-600 font-semibold border-b pb-2">
          <Briefcase size={18} />
          <h2>Job Details</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <Input 
              label="Job Type" 
              placeholder="e.g. Web Development"
              value={data.job.type} 
              onChange={(e) => handleJobChange('type', e.target.value)}
            />
             <Input 
              label="Due Date" 
              type="date"
              value={data.job.dueDate} 
              onChange={(e) => handleJobChange('dueDate', e.target.value)}
            />
          </div>
          <Input 
            label="Description" 
            multiline
            value={data.job.description} 
            onChange={(e) => handleJobChange('description', e.target.value)}
          />
          <div className="flex items-center gap-2 mb-4 text-brand-600 font-semibold pt-4">
            <DollarSign size={18} />
            <h2>Financials</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Cost ($)" 
              type="number"
              min="0"
              step="0.01"
              value={data.job.cost} 
              onChange={(e) => handleJobChange('cost', e.target.value)}
            />
            <Input 
              label="Tax Rate (%)" 
              type="number"
              min="0"
              step="0.1"
              value={data.job.taxRate} 
              onChange={(e) => handleJobChange('taxRate', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Recurring Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-brand-600 font-semibold border-b pb-2">
          <CalendarClock size={18} />
          <h2>Recurring Schedule</h2>
        </div>
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <select
              value={data.recurring.frequency}
              onChange={(e) => handleRecurringChange('frequency', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-3 py-2 border transition-colors bg-white"
            >
              <option value="None">One-time (No recurrence)</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          {data.recurring.frequency !== 'None' && (
            <div className="space-y-4 animate-fade-in pl-4 border-l-2 border-brand-100">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Start Date" 
                  type="date"
                  value={data.recurring.startDate} 
                  onChange={(e) => handleRecurringChange('startDate', e.target.value)}
                />
                <Input 
                  label="End Date (Optional)" 
                  type="date"
                  value={data.recurring.endDate || ''} 
                  onChange={(e) => handleRecurringChange('endDate', e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                 <input
                    type="checkbox"
                    id="autoSend"
                    checked={data.recurring.autoSend}
                    onChange={(e) => handleRecurringChange('autoSend', e.target.checked)}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoSend" className="text-sm text-gray-700 select-none cursor-pointer">
                    Automatically email invoice to customer
                  </label>
              </div>
              <p className="text-xs text-gray-500 italic">
                * This invoice will be automatically generated and sent every {data.recurring.frequency.toLowerCase()}.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default InvoiceForm;
