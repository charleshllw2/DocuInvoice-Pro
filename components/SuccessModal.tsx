import React, { useState } from 'react';
import Button from './Button';
import { Check, Copy, ExternalLink, X, Download } from 'lucide-react';

interface SuccessModalProps {
  docUrl: string;
  docId: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ docUrl, docId, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(docUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Google Drive export link format for PDF
    const downloadUrl = `https://docs.google.com/document/d/${docId}/export?format=pdf`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in-up">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <Check size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Generated!</h2>
          <p className="text-gray-500 mb-8">
            Your Google Doc is ready. You can now view it, download it as a PDF, or share the link.
          </p>

          <div className="w-full space-y-3">
             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
               <input 
                 readOnly 
                 value={docUrl} 
                 className="bg-transparent border-none text-gray-600 text-sm flex-1 focus:ring-0 truncate"
               />
               <button 
                onClick={handleCopy}
                className="text-brand-600 hover:text-brand-700 font-medium text-sm"
               >
                 {copied ? 'Copied' : <Copy size={16} />}
               </button>
             </div>

             <div className="grid grid-cols-2 gap-3">
               <a 
                href={docUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
               >
                 <Button className="w-full" variant="secondary" icon={<ExternalLink size={16} />}>
                   View Doc
                 </Button>
               </a>
               <Button 
                variant="primary" 
                className="w-full" 
                onClick={handleDownload}
                icon={<Download size={16} />}
               >
                 Download PDF
               </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;