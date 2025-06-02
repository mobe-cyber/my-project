import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";

interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId: string | undefined;
}

const isProduction = process.env.NODE_ENV === "production";

// تحقق من البيئة قبل تهيئة Firebase
const getFirebaseConfig = (): FirebaseConfig => {
  if (!isProduction && !import.meta.env.DEV) {
    throw new Error("Firebase configuration is not available in development mode without proper environment variables.");
  }
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
};

// تهيئة Firebase مع التحقق من وجود المتغيرات
const firebaseConfig = getFirebaseConfig();
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
  throw new Error("Missing required Firebase environment variables.");
}

let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  throw new Error("Failed to initialize Firebase application.");
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// إضافة تحقق من الأمان للإعدادات
const verifyFirebaseConfig = (config: FirebaseConfig): boolean => {
  return Object.values(config).every(value => value && typeof value === "string" && value.length > 0);
};

if (!verifyFirebaseConfig(firebaseConfig)) {
  throw new Error("Invalid Firebase configuration detected.");
}