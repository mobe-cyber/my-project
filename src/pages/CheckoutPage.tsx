import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

declare global {
  interface Window {
    NOWPayments: {
      init: (config: {
        api_key: string;
        payment_id: string;
        container_id: string;
        success_url: string;
        fail_url: string;
      }) => void;
    };
  }
}

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, User, Lock } from "lucide-react";
import { useTheme } from "@/context/theme-context-types";
import { useTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      const { language } = useTheme();
      return (
        <div className="text-center p-4">
          <h2 className="text-red-500">
            {language === "en" ? "Something went wrong." : "حدث خطأ ما."}
          </h2>
          <p>
            {language === "en" ? "Please try again later or contact support." : "يرجى المحاولة لاحقًا أو التواصل مع الدعم."}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// مكون لتحميل NOWPayments.js
const NowPaymentsScript = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://nowpayments.io/nowpayments.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

const CheckoutForm = ({ book, user, language, t, toast, navigate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const { theme } = useTheme();
  const apiKey = import.meta.env.VITE_NOWPAYMENTS_API_KEY;

  useEffect(() => {
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, [user]);

  const createNowPayment = async () => {
    if (!userEmail) {
      setErrorMessage(
        language === "en" ? "Please sign in to complete the purchase." : "يرجى تسجيل الدخول لإتمام الشراء."
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const paymentData = {
        price_amount: book.price,
        price_currency: "usdttrc20", // Changed from "usd" to "usdttrc20" as per supported currencies
        pay_currency: "usdttrc20",   // Changed from "usdt" to "usdttrc20"
        order_id: `ORDER_${user.uid}_${book.id}_${Date.now()}`,
        order_description: `${book.title} from MobeStore`,
        // Removed ipn_callback_url since it's optional and requires a valid URL
      };

      // Validate payment data
      if (!book.price || isNaN(book.price) || book.price <= 0) {
        throw new Error(language === "en" ? "Invalid book price." : "سعر الكتاب غير صالح.");
      }
      if (!book.title) {
        throw new Error(language === "en" ? "Book title is missing." : "عنوان الكتاب مفقود.");
      }

      const response = await fetch("https://us-central1-mobestore-e1db5.cloudfunctions.net/makePayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data = await response.json();

      if (data.payment_id) {
        const script = document.createElement("script");
        script.src = "https://nowpayments.io/nowpayments.js";
        script.async = true;
        script.onload = () => {
          if (window.NOWPayments) {
            window.NOWPayments.init({
              api_key: apiKey,
              payment_id: data.payment_id,
              container_id: "nowpayments-widget",
              success_url: `https://mobe-store.web.app/success`, // Updated to deployed URL
              fail_url: `https://mobe-store.web.app/fail`,       // Updated to deployed URL
            });
          } else {
            throw new Error(language === "en" ? "Failed to load NOWPayments widget." : "فشل في تحميل واجهة NOWPayments.");
          }
        };
        script.onerror = () => {
          throw new Error(language === "en" ? "Failed to load NOWPayments script." : "فشل في تحميل سكربت NOWPayments.");
        };
        document.body.appendChild(script);
      } else {
        throw new Error(
          language === "en" ? "Failed to create payment. No payment ID returned." : "فشل في إنشاء الدفع. لم يتم إرجاع معرف الدفع."
        );
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error occurred.";
      setErrorMessage(
        language === "en"
          ? `Failed to process payment. ${errorMsg}`
          : `فشل في معالجة الدفع. ${errorMsg}`
      );
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100">
        <CreditCard className="me-3 h-6 w-6 text-blue-500 dark:text-blue-400" />
        {language === "en" ? "Payment Information" : "معلومات الدفع"}
      </h2>

      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        {language === "en"
          ? "Choose your payment method. Currently, only cryptocurrency is active."
          : "اختر طريقة الدفع. حاليًا، الدفع بالعملات الرقمية فقط نشط."}
      </p>

      <div className="mb-6 space-y-4">
        <div
          className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50"
        >
          <div className="flex items-center">
            <Lock className="me-3 h-5 w-5 text-gray-400" />
            <span>{language === "en" ? "PayPal (Coming Soon)" : "بايبال (قريبًا)"}</span>
          </div>
          <span className="text-sm text-gray-500">Disabled</span>
        </div>

        <div
          className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50"
        >
          <div className="flex items-center">
            <Lock className="me-3 h-5 w-5 text-gray-400" />
            <span>{language === "en" ? "Visa/Mastercard (Coming Soon)" : "فيزا/ماستركارد (قريبًا)"}</span>
          </div>
          <span className="text-sm text-gray-500">Disabled</span>
        </div>

        <div
          className="flex items-center justify-between p-4 border border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800"
          onClick={createNowPayment}
        >
          <div className="flex items-center">
            <CreditCard className="me-3 h-5 w-5 text-green-500 dark:text-green-400" />
            <span>{language === "en" ? "Cryptocurrency (USDT-TRC20)" : "عملات رقمية (USDT-TRC20)"}</span>
          </div>
          <span className="text-sm text-green-500 dark:text-green-400">Active</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <User className="me-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
          {language === "en" ? "Email" : "البريد الإلكتروني"}
        </label>
        <div className="relative">
          <input
            type="email"
            value={userEmail}
            readOnly
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-300 shadow-sm"
          />
          <User className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {language === "en"
            ? "Your email is used for payment confirmation."
            : "بريدك الإلكتروني يُستخدم لتأكيد الدفع."}
        </p>
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm mb-6 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <Button
        onClick={createNowPayment}
        className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isProcessing || !userEmail}
      >
        {isProcessing ? (
          <>
            <span className="animate-spin me-2">⚪</span>
            {language === "en" ? "Processing..." : "جاري المعالجة..."}
          </>
        ) : (
          language === "en" ? "Confirm Purchase" : "تأكيد الشراء"
        )}
      </Button>

      <div id="nowpayments-widget" className="mt-4"></div>

      <div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
        <span>
          {language === "en" ? "By completing your purchase, you agree to our " : "بإكمال الشراء، فإنك توافق على "}
        </span>
        <Link to="/terms" className="text-blue-500 dark:text-blue-400 hover:underline">
          {language === "en" ? "Terms of Service" : "شروط الخدمة"}
        </Link>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { book: initialBook } = location.state || {};
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [user, setUser] = useState(auth.currentUser);
  const [book, setBook] = useState<any>(initialBook);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (!initialBook && location.pathname) {
        const bookId = location.pathname.split("/checkout/")[1];
        if (bookId) {
          try {
            const bookDoc = await getDoc(doc(db, "books", bookId));
            if (bookDoc.exists()) {
              setBook({ id: bookDoc.id, ...bookDoc.data() });
            } else {
              toast({
                title: language === "en" ? "Error" : "خطأ",
                description: language === "en" ? "Book not found." : "الكتاب غير موجود.",
                variant: "destructive",
              });
              navigate("/");
            }
          } catch (error) {
            console.error("Error fetching book:", error);
            toast({
              title: language === "en" ? "Error" : "خطأ",
              description: language === "en" ? "Failed to load book." : "فشل في تحميل الكتاب.",
              variant: "destructive",
            });
            navigate("/");
          }
        }
      }
      setLoading(false);
    };

    fetchBook();
  }, [initialBook, location, language, toast, navigate]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("Auth state changed, user:", currentUser);
      setUser(currentUser);
      if (!book && currentUser) {
        toast({
          title: language === "en" ? "Error" : "خطأ",
          description: language === "en" ? "No book selected." : "لم يتم اختيار كتاب.",
          variant: "destructive",
        });
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [book, language, toast, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <span className="animate-pulse text-gray-600 dark:text-gray-400">
            {language === "en" ? "Loading..." : "جاري التحميل..."}
          </span>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          {language === "en" ? "No book selected." : "لم يتم اختيار كتاب."}
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          {language === "en" ? "Please sign in to proceed." : "يرجى تسجيل الدخول للمتابعة."}
          <Button className="mt-4" onClick={() => navigate("/login")}>
            {language === "en" ? "Sign In" : "تسجيل الدخول"}
          </Button>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ar-EG", {
      style: "currency",
      currency: "USD", // Kept as USD for display purposes, but payment uses usdttrc20
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <ErrorBoundary>
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-10 text-gray-800 dark:text-gray-100">
            {language === "en" ? "Checkout" : "إتمام الشراء"}
          </h1>

          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/2">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg transition-all duration-300">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                  {language === "en" ? "Order Summary" : "ملخص الطلب"}
                </h2>

                <div className="space-y-5 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{book.title || "Unknown Book"}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">{formatCurrency(book.price)}</span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-5 font-bold text-lg flex justify-between">
                    <span className="text-gray-800 dark:text-gray-100">{language === "en" ? "Total" : "المجموع"}</span>
                    <span className="text-blue-600 dark:text-blue-400">{formatCurrency(book.price)}</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 me-2 text-green-500" />
                    {language === "en" ? "Instant Digital Delivery" : "تسليم رقمي فوري"}
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 me-2 text-green-500" />
                    {language === "en" ? "Access in your Library forever" : "الوصول إلى مكتبتك إلى الأبد"}
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 me-2 text-green-500" />
                    {language === "en" ? "PDF & ePub formats included" : "تشمل صيغ PDF و ePub"}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <NowPaymentsScript />
              <CheckoutForm
                book={book}
                user={user}
                language={language}
                t={t}
                toast={toast}
                navigate={navigate}
              />
            </div>
          </div>
        </div>
      </Layout>
    </ErrorBoundary>
  );
};

export default CheckoutPage;