import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDCkWwXBDm82OnIrDXuN1qiC5fehj-1SqM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cyber-security-tracker.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cyber-security-tracker",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cyber-security-tracker.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "71021105314",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:71021105314:web:863c62f4f9358708c6c7fb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MC8G1K7954"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
