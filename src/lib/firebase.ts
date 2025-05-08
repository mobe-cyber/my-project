// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics"; // إذا كنت تستخدم Analytics

const firebaseConfig = {
  apiKey: "AIzaSyD0XmUHuJMIyRj6nS4pRwIZpOMOEF332Pk",
  authDomain: "mobestore-e1db5.firebaseapp.com",
  projectId: "mobestore-e1db5",
  storageBucket: "mobestore-e1db5.firebasestorage.app",
  messagingSenderId: "228993829122",
  appId: "1:228993829122:web:518e56e55ae1f231521a1b",
  measurementId: "G-CG0Q5VT0HB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const analytics = getAnalytics(app); // إذا كنت تستخدم Analytics