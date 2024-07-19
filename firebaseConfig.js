// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional, add if using Analytics
};



let app;
try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('Firebase has been initialized.');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Export auth and GoogleAuthProvider instances
export const auth = app ? getAuth(app) : null;
export const googleAuthProvider = app ? new GoogleAuthProvider() : null;
