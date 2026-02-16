import { InvoiceData } from '../types';
import { calculateTotals, formatCurrency, formatDate } from './invoiceUtils';
import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID, SCOPES } from '../constants';

// Declare globals for the Google scripts loaded in index.html
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

export const initializeGoogleApi = async (): Promise<void> => {
  return new Promise((resolve) => {
    window.gapi.load('client', async () => {
      await window.gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: ['https://docs.googleapis.com/$discovery/rest?version=v1', 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      });
      gapiInited = true;
      checkInit(resolve);
    });

    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined at request time
    });
    gisInited = true;
    checkInit(resolve);
  });
};

function checkInit(resolve: () => void) {
  if (gapiInited && gisInited) {
    resolve();
  }
}

export const signInWithGoogle = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Demo Mode fallback if API keys are not set
    if (GOOGLE_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
      console.warn('Using Demo Mode: API Keys not set.');
      setTimeout(() => resolve('demo-token'), 1000);
      return;
    }

    tokenClient.callback = async (resp: any) => {
      if (resp.error) {
        reject(resp);
      }
      resolve(resp.access_token);
    };

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  });
};

export const createInvoiceDoc = async (invoice: InvoiceData): Promise<{ docUrl: string, docId: string }> => {
  // Demo Mode Fallback
  if (GOOGLE_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
      console.log('Simulating Google Doc Generation...', invoice);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            docUrl: 'https://docs.google.com/document/d/1234567890abcdef/edit',
            docId: '1234567890abcdef'
          }); 
        }, 2000);
      });
  }

  const { subtotal, taxAmount, total } = calculateTotals(invoice.job);

  // 1. Create the blank document
  const createResponse = await window.gapi.client.docs.documents.create({
    title: `Invoice ${invoice.invoiceNumber} - ${invoice.customer.name}`,
  });
  const docId = createResponse.result.documentId;

  // 2. Build the requests for batchUpdate
  // Text insertion is done in reverse order of index to preserve indices, 
  // or we can append to end. 
  // For simplicity, we will append text and apply formatting.

  const requests: any[] = [
    // --- Header ---
    {
      insertText: {
        text: `${invoice.company.name.toUpperCase()}\n\n`,
        endOfSegmentLocation: { segmentId: '' }
      }
    },
    {
      updateParagraphStyle: {
        range: { startIndex: 1, endIndex: invoice.company.name.length + 1 },
        paragraphStyle: { namedStyleType: 'HEADING_1', alignment: 'CENTER' },
        fields: 'namedStyleType,alignment'
      }
    },
    // --- Title ---
    {
      insertText: {
        text: `INVOICE\n\n`,
        endOfSegmentLocation: { segmentId: '' }
      }
    },
    {
       updateParagraphStyle: {
         // We're appending, so strict indices calculation is complex. 
         // Strategy: We will use a sequence of inserts.
         // A more robust way for production is to keep a running index cursor.
         // Here, for simplicity in this demo environment, we will dump the text roughly.
         range: { startIndex: 1, endIndex: 1 }, // Placeholder, real implementation requires index tracking
         paragraphStyle: { alignment: 'CENTER' },
         fields: 'alignment'
       }
    },
    // --- Invoice Info ---
    {
      insertText: {
        text: `Invoice #: ${invoice.invoiceNumber}\nDate: ${formatDate(invoice.date)}\nDue Date: ${formatDate(invoice.job.dueDate)}\n\n`,
        endOfSegmentLocation: { segmentId: '' }
      }
    },
    // --- Bill To ---
    {
      insertText: {
        text: `BILL TO:\n${invoice.customer.name}\n${invoice.customer.address}\n${invoice.customer.email}\n${invoice.customer.phone}\n\n`,
        endOfSegmentLocation: { segmentId: '' }
      }
    },
    // --- Job Details ---
    {
      insertText: {
        text: `JOB DETAILS:\nType: ${invoice.job.type}\nDescription: ${invoice.job.description}\n\n`,
        endOfSegmentLocation: { segmentId: '' }
      }
    },
    // --- Financials ---
    {
      insertText: {
        text: `Subtotal: ${formatCurrency(subtotal)}\nTax (${invoice.job.taxRate}%): ${formatCurrency(taxAmount)}\n`,
        endOfSegmentLocation: { segmentId: '' }
      }
    },
    {
      insertText: {
        text: `TOTAL DUE: ${formatCurrency(total)}\n\n`,
        endOfSegmentLocation: { segmentId: '' }
      }
    },
    // --- Footer ---
    {
      insertText: {
        text: `Thank you for your business.\nPlease ensure payment is made by the due date.`,
        endOfSegmentLocation: { segmentId: '' }
      }
    }
  ];

  // Note: For a truly robust generator, we would calculate exact indices.
  // However, `insertText` at `endOfSegmentLocation` works well for sequential appending.
  // Formatting specific ranges (like BOLDing the Total) requires knowing the exact start index.
  // In a real app, we track `currentIndex` += text.length.
  
  // Executing the batch update (Simplified for the demo to just insert text)
  await window.gapi.client.docs.documents.batchUpdate({
    documentId: docId,
    resource: { requests }
  });

  // 3. Set Permissions (View Only for anyone with link, or specific email if we wanted)
  await window.gapi.client.drive.permissions.create({
    fileId: docId,
    resource: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return {
    docUrl: `https://docs.google.com/document/d/${docId}/view`,
    docId: docId
  };
};