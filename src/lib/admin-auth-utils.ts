import { getIdTokenResult, User } from "firebase/auth";
import CryptoJS from 'crypto-js';

const AUTHENTICATION_THROTTLE = 3000; // 3 seconds
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes
const MAX_RETRY_ATTEMPTS = 2; // تقليل عدد المحاولات
const RETRY_DELAY = 500; // تقليل التأخير إلى 500 مللي ثانية

interface AdminClaimsCache {
  isAdmin: boolean;
  expiry: number;
  tokenHash: string;
}

const adminClaimsCache: { [uid: string]: AdminClaimsCache } = {};
let lastAuthCheck = Date.now() - AUTHENTICATION_THROTTLE;
let isAuthenticating = false;
let retryCount = 0;

// تحويل الـ token.claims إلى هاش
const calculateTokenHash = (token: any): string => {
  try {
    return CryptoJS.SHA256(JSON.stringify(token.claims)).toString();
  } catch (error) {
    console.error('Error calculating token hash:', error);
    return Date.now().toString(36);
  }
};

// دالتان للتشفير وفك التشفير
const encryptData = (data: any, secret: string) => CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
const decryptData = (ciphertext: string, secret: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

export const verifyAdminClaims = async (user: User): Promise<boolean> => {
  try {
    const now = Date.now();
    const cached = adminClaimsCache[user.uid];

    // التحقق من التخزين المؤقت
    if (cached && cached.expiry > now) {
      try {
        const currentToken = await getIdTokenResult(user, false);
        const currentHash = calculateTokenHash(currentToken);
        
        if (currentHash === cached.tokenHash) {
          console.log("Using valid cached admin claims");
          return cached.isAdmin;
        }
      } catch (error) {
        console.warn("Error checking cached claims:", error);
      }
    }

    // محاولة الحصول على التوكن مع إعادة المحاولة
    let token;
    try {
      token = await retryOperation(() => getIdTokenResult(user, true));
    } catch (error) {
      console.error("Failed to get token after retries:", error);
      return await fallbackToSessionStorage(user);
    }

    const isAdmin = !!token?.claims?.admin;
    const tokenHash = calculateTokenHash(token);
    const encryptionSecret = import.meta.env.VITE_ENCRYPTION_SECRET || 'default-secret';

    // تحديث التخزين المؤقت
    adminClaimsCache[user.uid] = {
      isAdmin,
      expiry: now + CACHE_EXPIRY,
      tokenHash,
    };

    // حفظ نسخة احتياطية مشفرة في sessionStorage
    if (isAdmin) {
      try {
        const encryptedClaims = encryptData(token.claims, encryptionSecret);
        sessionStorage.setItem("adminToken", encryptedClaims);
        sessionStorage.setItem("adminTokenExpiry", String(now + CACHE_EXPIRY));
        sessionStorage.setItem("adminTokenHash", tokenHash);
      } catch (error) {
        console.warn("Failed to save to sessionStorage:", error);
      }
    }

    return isAdmin;
  } catch (error) {
    console.error("Error verifying admin claims:", error);
    return await fallbackToSessionStorage(user);
  } finally {
    isAuthenticating = false; // التأكد من إعادة تعيين isAuthenticating
  }
};

const retryOperation = async <T>(operation: () => Promise<T>): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let i = 0; i < MAX_RETRY_ATTEMPTS; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < MAX_RETRY_ATTEMPTS - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  
  throw lastError;
};

const fallbackToSessionStorage = async (user: User): Promise<boolean> => {
  try {
    const now = Date.now();
    const cachedToken = sessionStorage.getItem("adminToken");
    const cachedTokenExpiry = sessionStorage.getItem("adminTokenExpiry");
    const cachedTokenHash = sessionStorage.getItem("adminTokenHash");
    const encryptionSecret = import.meta.env.VITE_ENCRYPTION_SECRET || 'default-secret';

    if (cachedToken && cachedTokenExpiry && cachedTokenHash && Number(cachedTokenExpiry) > now) {
      try {
        const decryptedClaims = decryptData(cachedToken, encryptionSecret);
        if (decryptedClaims) {
          const isAdmin = !!decryptedClaims.admin;
          if (isAdmin) {
            adminClaimsCache[user.uid] = {
              isAdmin,
              expiry: now + CACHE_EXPIRY,
              tokenHash: cachedTokenHash,
            };
            return true;
          }
        }
      } catch (error) {
        console.warn("Error parsing cached token:", error);
      }
    }
  } catch (error) {
    console.error("Cache fallback failed:", error);
  }
  return false;
};

export const cleanupSession = () => {
  try {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminTokenExpiry");
    sessionStorage.removeItem("adminTokenHash");
    Object.keys(adminClaimsCache).forEach(key => delete adminClaimsCache[key]);
    isAuthenticating = false;
    lastAuthCheck = Date.now() - AUTHENTICATION_THROTTLE;
    retryCount = 0;
  } catch (error) {
    console.error("Error cleaning up session:", error);
  }
};

export const canPerformAuthCheck = (): boolean => {
  const now = Date.now();
  
  if (isAuthenticating) {
    console.log("Authentication is currently in progress");
    return false;
  }
  
  if ((now - lastAuthCheck) < AUTHENTICATION_THROTTLE) {
    const waitTime = AUTHENTICATION_THROTTLE - (now - lastAuthCheck);
    console.log(`Throttle limit reached, waiting: ${waitTime}ms`);
    return false;
  }
  
  lastAuthCheck = now;
  isAuthenticating = true;
  retryCount = 0;
  console.log("Authentication check allowed");
  return true;
};