import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApCcUVh9-Dh2ES9AWowz003CEGwr38E14",
  authDomain: "campus-hustle-a3c9b.firebaseapp.com",
  projectId: "campus-hustle-a3c9b",
  storageBucket: "campus-hustle-a3c9b.firebasestorage.app",
  messagingSenderId: "981139895305",
  appId: "1:981139895305:web:ffcaf19b34c57d3cae34d8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
