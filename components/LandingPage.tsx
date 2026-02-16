import React from 'react';
import Button from './Button';
import { FileText, Zap, Shield, Share2 } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 text-white p-2 rounded-lg">
            <FileText size={24} />
          </div>
          <span className="text-xl font-bold text-gray-900">DocuInvoice Pro</span>
        </div>
        <Button onClick={onStart} variant="secondary">Log In</Button>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-8">
            Create and Share Professional <br/>
            <span className="text-brand-600">Google Doc Invoices</span> in Seconds.
          </h1>
          <p className="text-xl text-gray-500 mb-10">
            Stop messing with Word templates. Generate beautiful, auto-calculated invoices directly to your Google Drive and share them instantly with clients.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={onStart} className="text-lg px-8 py-4">Create Invoice Now</Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Generation</h3>
              <p className="text-gray-500">
                Fill out the form and click generate. We use the Google Docs API to build your invoice in real-time.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-6">
                <Share2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">One-Click Sharing</h3>
              <p className="text-gray-500">
                Get a "View Only" link instantly. No need to download PDFs or attach files to emails.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-500">
                Your data lives in your Google Drive. We just help you format it perfectly every time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
