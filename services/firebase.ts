import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { InvoiceData } from '../types';

// These should be set in .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Diagnostics (Safe for production, only logs presence or failure)
console.log('Firebase Config Check:', {
  apiKey: firebaseConfig.apiKey ? 'PRESENT' : 'MISSING',
  projectId: firebaseConfig.projectId ? 'PRESENT' : 'MISSING',
});

if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR_API_KEY')) {
  console.error('Firebase Error: Invalid or missing API Key. Check your .env.local file.');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/documents');
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');

let googleAccessToken: string | null = null;

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    googleAccessToken = credential?.accessToken || null;
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const getGoogleAccessToken = () => googleAccessToken;

export const logout = () => signOut(auth);

export const saveInvoice = async (userId: string, invoice: InvoiceData) => {
  try {
    const docRef = await addDoc(collection(db, 'invoices'), {
      ...invoice,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving invoice", error);
    throw error;
  }
};

export const getUserInvoices = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'invoices'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const invoices = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as InvoiceData[];

    // Sort manually by createdAt decending
    return invoices.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || 0;
      const dateB = b.createdAt?.toMillis?.() || 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error getting invoices", error);
    throw error;
  }
};
