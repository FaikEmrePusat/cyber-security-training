import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCkWwXBDm82OnIrDXuN1qiC5fehj-1SqM",
  authDomain: "cyber-security-tracker.firebaseapp.com",
  projectId: "cyber-security-tracker",
  storageBucket: "cyber-security-tracker.firebasestorage.app",
  messagingSenderId: "71021105314",
  appId: "1:71021105314:web:863c62f4f9358708c6c7fb",
  measurementId: "G-MC8G1K7954"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
