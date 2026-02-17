import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import Dashboard from './components/Dashboard';
import Button from './components/Button';
import SuccessModal from './components/SuccessModal';
import { InvoiceData } from './types';
import { DEFAULT_INVOICE } from './constants';
import { initializeGoogleApi, signInWithGoogle, createInvoiceDoc } from './services/googleService';
import { Wand2, LogOut, FileText, Edit3, Eye, LayoutDashboard, Plus } from 'lucide-react';
import { auth, signInWithGoogle as firebaseSignIn, logout as firebaseLogout, saveInvoice, getUserInvoices } from './services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// Use a simple mock for authentication state since we can't fully implement
// secure backend persistence in this frontend-only demo.
const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // App Views: 'dashboard' | 'editor'
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('editor');

  // Data State
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(DEFAULT_INVOICE);
  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceData[]>([]);

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [generatedDocUrl, setGeneratedDocUrl] = useState<string | null>(null);
  const [generatedDocId, setGeneratedDocId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    // Initialize Google API client on load
    initializeGoogleApi().then(() => {
      console.log('Google APIs initialized');
    });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);
        setCurrentView('dashboard');

        // Fetch history
        setIsLoadingHistory(true);
        try {
          const invoices = await getUserInvoices(firebaseUser.uid);
          setInvoiceHistory(invoices);
        } catch (error) {
          console.error("Failed to load history", error);
        } finally {
          setIsLoadingHistory(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setCurrentView('editor');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await firebaseSignIn();
      // Auth state listener handles the rest
    } catch (error) {
      console.error('Login failed', error);
      // Removed mock fallback to ensure real auth works
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      setInvoiceData(DEFAULT_INVOICE);
      setGeneratedDocUrl(null);
      setGeneratedDocId(null);
      setInvoiceHistory([]);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleCreateNew = () => {
    // Reset the form data for a new invoice
    setInvoiceData({
      ...DEFAULT_INVOICE,
      id: crypto.randomUUID(), // Ensure a unique internal ID
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
      // Preserve company info if desired, but for now reset to default or keep last used?
      // Let's reset but maybe keep company name if it was set in a real app.
    });
    setCurrentView('editor');
    setMobileTab('editor');
  };

  const handleGenerate = async () => {
    if (!user) {
      alert('Please log in to save invoices.');
      return;
    }

    setIsGenerating(true);
    try {
      const { docUrl, docId } = await createInvoiceDoc(invoiceData);
      setGeneratedDocUrl(docUrl);
      setGeneratedDocId(docId);

      // Save to Firestore
      const completedInvoice: InvoiceData = {
        ...invoiceData,
        status: 'Generated',
        docUrl: docUrl,
        docId: docId,
        id: invoiceData.id || crypto.randomUUID()
      };

      await saveInvoice(user.uid, completedInvoice);

      // Optionally update history locally or re-fetch in Dashboard
      setInvoiceHistory(prev => [completedInvoice, ...prev]);

    } catch (error) {
      console.error('Failed to generate doc', error);
      alert('Failed to generate document. Please check console and ensure Firebase is configured.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setGeneratedDocUrl(null);
    setGeneratedDocId(null);
    // Optionally redirect to dashboard or stay on editor
    // Let's ask user or just stay. Staying allows them to tweak and regenerate if needed.
  };

  if (!isAuthenticated) {
    return <LandingPage onStart={handleLogin} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 h-16 z-20 shadow-sm">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setCurrentView('dashboard')}
        >
          <div className="bg-brand-600 text-white p-1.5 rounded-lg">
            <FileText size={20} />
          </div>
          <span className="font-bold text-gray-800 text-lg hidden sm:inline">DocuInvoice Pro</span>
          <span className="font-bold text-gray-800 text-lg sm:hidden">DocuInvoice</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 mr-4">
            <Button
              variant={currentView === 'dashboard' ? 'secondary' : 'ghost'}
              onClick={() => setCurrentView('dashboard')}
              icon={<LayoutDashboard size={16} />}
              className={currentView === 'dashboard' ? 'bg-gray-100' : ''}
            >
              Dashboard
            </Button>
            <Button
              variant={currentView === 'editor' ? 'primary' : 'ghost'}
              onClick={() => setCurrentView('editor')}
              icon={<Plus size={16} />}
            >
              New Invoice
            </Button>
          </div>

          <span className="text-sm text-gray-500 hidden lg:inline border-r border-gray-200 pr-4 mr-1">
            {user?.displayName || user?.email || 'User'}
          </span>
          <Button variant="ghost" onClick={handleLogout} icon={<LogOut size={16} />}>
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">

        {currentView === 'dashboard' ? (
          <div className="w-full h-full overflow-y-auto bg-gray-50">
            <Dashboard
              invoices={invoiceHistory}
              isLoading={isLoadingHistory}
              onCreateNew={handleCreateNew}
            />
          </div>
        ) : (
          /* Editor View */
          <>
            {/* Mobile Tab Navigation (Only visible in editor view on mobile) */}
            <div className="lg:hidden absolute top-0 left-0 right-0 flex border-b border-gray-200 bg-white shrink-0 z-30">
              <button
                onClick={() => setMobileTab('editor')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mobileTab === 'editor' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500'
                  }`}
              >
                <Edit3 size={16} /> Editor
              </button>
              <button
                onClick={() => setMobileTab('preview')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mobileTab === 'preview' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500'
                  }`}
              >
                <Eye size={16} /> Preview
              </button>
            </div>

            {/* Left Panel: Form */}
            <div
              className={`w-full lg:w-5/12 bg-white border-r border-gray-200 flex flex-col shadow-xl z-10 transition-transform duration-300 absolute inset-0 lg:static mt-11 lg:mt-0 ${mobileTab === 'editor' ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
              <InvoiceForm data={invoiceData} onChange={setInvoiceData} />

              {/* Sticky Footer for Action */}
              <div className="p-4 border-t border-gray-200 bg-white absolute bottom-0 w-full z-20">
                <Button
                  className="w-full py-3 text-lg shadow-lg"
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                  icon={<Wand2 size={20} />}
                >
                  Generate Invoice
                </Button>
              </div>
            </div>

            {/* Right Panel: Preview */}
            <div
              className={`w-full lg:flex-1 bg-gray-100 flex items-start justify-center relative absolute inset-0 lg:static mt-11 lg:mt-0 transition-transform duration-300 ${mobileTab === 'preview' ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
                }`}
            >
              <div className="hidden lg:block absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-500 shadow-sm border border-gray-200 z-10">
                Live Preview
              </div>
              <InvoicePreview data={invoiceData} />

              {/* Mobile Preview Generate Button */}
              <div className="lg:hidden absolute bottom-4 right-4 z-20">
                <Button
                  className="rounded-full w-14 h-14 shadow-xl flex items-center justify-center p-0"
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                >
                  <Wand2 size={24} />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Success Modal */}
      {generatedDocUrl && generatedDocId && (
        <SuccessModal
          docUrl={generatedDocUrl}
          docId={generatedDocId}
          onClose={handleCloseSuccessModal}
        />
      )}
    </div>
  );
};

export default App;
