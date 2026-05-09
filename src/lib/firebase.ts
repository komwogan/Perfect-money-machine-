import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Handle potential missing or malformed config gracefully for various environments
const safeFirebaseConfig = (firebaseConfig && firebaseConfig.apiKey) ? firebaseConfig : {
  apiKey: "missing",
  authDomain: "missing",
  projectId: "missing",
  storageBucket: "missing",
  messagingSenderId: "missing",
  appId: "missing",
  firestoreDatabaseId: "(default)"
};

const app = initializeApp(safeFirebaseConfig);
export const db = getFirestore(app, safeFirebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Connectivity check as per guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'check'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('permission-denied')) {
      // This is actually a good sign - it means we connected but were blocked by rules as expected
      console.log("Firebase connection established (permissions confirmed).");
    } else if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: Client is offline.");
    } else {
      console.warn("Firebase connection test produced unexpected result:", error);
    }
  }
}

testConnection();
