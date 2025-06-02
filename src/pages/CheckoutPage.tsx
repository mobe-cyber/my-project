import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, User, Lock, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

// صنف معالجة الأخطاء المخصص
class PaymentError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "PaymentError";
    Object.setPrototypeOf(this, PaymentError.prototype);
  }
}

// الواجهات
interface PaymentData {
  price_amount: number;
  price_currency: string;
  order_id: string;
  order_description: string;
  ipn_callback_url?: string;
  success_url: string;
  cancel_url: string;
}

interface PaymentResponse {
  payment_id: string;
  pay_url?: string;
  price_amount: number;
  price_currency: string;
  payment_status?: string;
  [key: string]: any;
}

interface Book {
  id: string;
  title: string;
  price: number;
  [key: string]: any;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  language: string;
}

// مكون ErrorBoundary المحسن كـ Functional Component
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, language }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: Error, errorInfo: React.ErrorInfo) => {
      console.error("Checkout Error:", error, errorInfo);
      setHasError(true);
    };
    window.addEventListener("error", (event) => errorHandler(event.error, {}));
    return () => window.removeEventListener("error", (event) => errorHandler(event.error, {}));
  }, []);

  if (hasError) {
    return (
      <div className="text-center p-4">
        <h2 className="text-red-500">
          {language === "en" ? "Something went wrong." : "حدث خطأ ما."}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {language === "en"
            ? "Please try again later or contact support."
            : "يرجى المحاولة لاحقًا أو التواصل مع الدعم."}
        </p>
        <Button onClick={() => setHasError(false)} className="mt-4">
          {language === "en" ? "Try Again" : "حاول مرة أخرى"}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

interface CheckoutFormProps {
  book: Book;
  user: any;
  language: string;
  t: (key: string) => string;
  toast: any;
  navigate: (path: string) => void;
}

// خدمة معالجة الدفع (Lahza فقط)
class PaymentService {
  private static readonly LAHZA_API_ENDPOINT = "https://api.lahza.io/transaction/initialize";
  private static readonly TIMEOUT = 30000;

  static async createPayment(
    paymentData: PaymentData,
    lahzaSecretKey: string
  ): Promise<PaymentResponse> {
    if (!lahzaSecretKey) {
      throw new PaymentError(
        "Lahza API key is missing",
        "MISSING_API_KEY",
        { apiKey: "lahza" }
      );
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      if (paymentData.price_amount <= 0) {
        throw new PaymentError(
          "Invalid price amount",
          "INVALID_AMOUNT",
          { price_amount: paymentData.price_amount }
        );
      }

      console.log("Sending request to Lahza API:", {
        endpoint: this.LAHZA_API_ENDPOINT,
        headers: {
          Authorization: `Bearer ${lahzaSecretKey}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: paymentData,
      });

      const response = await fetch(this.LAHZA_API_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lahzaSecretKey}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          email: paymentData.order_description.split("@")[0],
          amount: paymentData.price_amount * 100,
          currency: "usd",
          ref: paymentData.order_id,
          callback_url: paymentData.ipn_callback_url,
          metadata: { product_id: paymentData.order_id },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Lahza API error response:", {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new PaymentError(
          "Payment creation failed",
          "API_ERROR",
          { status: response.status, details: errorText }
        );
      }

      const data = await response.json();
      console.log("Lahza API full response:", data);

      if (!data.data?.authorization_url) {
        throw new PaymentError(
          "Invalid payment response: missing authorization_url",
          "INVALID_RESPONSE",
          { data }
        );
      }

      return {
        payment_id: data.data.transaction_id || data.data.id || data.reference,
        pay_url: data.data.authorization_url,
        price_amount: paymentData.price_amount,
        price_currency: "usd",
        payment_status: data.status || true,
      } as PaymentResponse;
    } catch (error) {
      if (error instanceof PaymentError) throw error;
      console.error("Unexpected error in createPayment:", error);
      throw new PaymentError(
        "Payment processing error",
        "PROCESSING_ERROR",
        { originalError: error }
      );
    }
  }
}

// مكون نافذة الدفع المنبثقة
interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  paymentLink: string;
  amount: number;
  currency: string;
  language: string;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({
  isOpen,
  onClose,
  paymentLink,
  amount,
  currency,
  language,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleIframeError = () => {
    setIframeError(true);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {language === "en" ? "Complete Payment" : "إكمال الدفع"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === "en" ? "Amount: " : "المبلغ: "}
              <span className="font-medium">{amount} {currency.toUpperCase()}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <div className="flex gap-2">
              <button
                onClick={() => window.open(paymentLink, "_blank")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                {language === "en" ? "Open in New Tab" : "فتح في تبويب جديد"}
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex-1 h-full">
          {isLoading && !iframeError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === "en" ? "Loading payment page..." : "جاري تحميل صفحة الدفع..."}
                </p>
              </div>
            </div>
          )}

          {iframeError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="text-center">
                <p className="text-red-500 mb-4">
                  {language === "en"
                    ? "Failed to load payment page due to security restrictions. Please use the 'Open in New Tab' option."
                    : "فشل في تحميل صفحة الدفع بسبب قيود أمنية. يرجى استخدام خيار 'فتح في تبويب جديد'."}
                </p>
                <button
                  onClick={() => window.open(paymentLink, "_blank")}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  {language === "en" ? "Open in New Tab" : "فتح في تبويب جديد"}
                </button>
              </div>
            </div>
          ) : (
            <iframe
              src={paymentLink}
              className="w-full h-full border-0"
              title={language === "en" ? "Payment Gateway" : "بوابة الدفع"}
              onLoad={() => setIsLoading(false)}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            />
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>
                {language === "en" ? "Secure Payment Gateway" : "بوابة دفع آمنة"}
              </span>
            </div>
            <div className="text-center">
              <p>
                {language === "en"
                  ? "Having trouble? Contact our support team."
                  : "تواجه مشكلة؟ تواصل مع فريق الدعم."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  book,
  user,
  language,
  t,
  toast,
  navigate,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    amount: number;
    currency: string;
    paymentLink: string;
    language: string;
  } | null>(null);
  const lahzaSecretKey = import.meta.env.VITE_LAHZA_SECRET_KEY || "";

  useEffect(() => {
    if (user && user.email) {
      setUserEmail(user.email);
    } else {
      setUserEmail("");
    }
  }, [user]);

  const createPayment = async () => {
    if (!userEmail) {
      setErrorMessage(
        language === "en"
          ? "Please sign in to complete the purchase."
          : "يرجى تسجيل الدخول لإتمام الشراء."
      );
      return;
    }

    if (!book?.price || book.price <= 0) {
      setErrorMessage(
        language === "en"
          ? "Invalid book price. Please select a different book."
          : "سعر الكتاب غير صالح. يرجى اختيار كتاب آخر."
      );
      return;
    }

    if (!lahzaSecretKey) {
      setErrorMessage(
        language === "en"
          ? "Payment configuration error. Please contact support."
          : "خطأ في إعدادات الدفع. يرجى التواصل مع الدعم."
      );
      return;
    }

    const minAmount = 1;
    if (book.price < minAmount) {
      setErrorMessage(
        language === "en"
          ? `Amount (${book.price} USD) is less than the minimum (${minAmount} USD).`
          : `المبلغ (${book.price} USD) أقل من الحد الأدنى (${minAmount} USD).`
      );
      return;
    }

    if (!user?.uid || !book?.id) {
      console.log("User or Book data:", { user, book });
      setErrorMessage(
        language === "en"
          ? "Invalid user or book data. Please try again."
          : "بيانات المستخدم أو الكتاب غير صالحة. يرجى المحاولة مرة أخرى."
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setPaymentDetails(null);

    try {
      const orderId = `ORDER_${user.uid}_${book.id}_${Date.now()}`;
      const paymentData: PaymentData = {
        price_amount: Number(book.price.toFixed(2)),
        price_currency: "usd",
        order_id: orderId,
        order_description: `${book.title || "Unknown Book"} from MobeStore - ${userEmail}`,
        ipn_callback_url: "https://us-central1-mobestore-e1db5.cloudfunctions.net/paymentCallback",
        success_url: `https://mobe-store.web.app/read?bookId=${book.id}`,
        cancel_url: `https://mobe-store.web.app/fail`,
      };

      const result = await PaymentService.createPayment(paymentData, lahzaSecretKey);

      console.log("Full Payment Response:", result);

      let paymentLink = result.pay_url || `https://checkout.lahza.io/payment/?transaction_id=${result.payment_id}`;
      if (paymentLink.startsWith("http://")) {
        paymentLink = paymentLink.replace("http://", "https://");
      }

      console.log("Final Payment Link:", paymentLink);

      if (!result.payment_id) {
        console.warn("Payment ID is missing, using orderId as fallback:", orderId);
        await setDoc(doc(db, "orders", orderId), {
          userId: user.uid,
          bookId: book.id,
          status: "pending",
          payment_id: orderId,
          amount: book.price,
          currency: "usd",
          created_at: new Date().toISOString(),
          email: userEmail,
        }, { merge: true });
      } else {
        await setDoc(doc(db, "orders", orderId), {
          userId: user.uid,
          bookId: book.id,
          status: "pending",
          payment_id: result.payment_id,
          amount: book.price,
          currency: "usd",
          created_at: new Date().toISOString(),
          email: userEmail,
        }, { merge: true });
      }

      await setDoc(doc(db, `users/${user.uid}/userBooks`, book.id), {
        bookId: book.id,
        title: book.title,
        addedAt: new Date().toISOString(),
        status: "purchased",
      }, { merge: true });

      setPaymentDetails({
        amount: book.price,
        currency: "USD",
        paymentLink: paymentLink,
        language: language,
      });

      setShowPaymentPopup(true);
    } catch (error) {
      const message = error instanceof PaymentError
        ? `${language === "en" ? "Payment error: " : "خطأ دفع: "} ${error.message} (Code: ${error.code}, Status: ${error.details?.status})`
        : language === "en"
          ? "Failed to process payment. Please try again later or contact support."
          : "فشل في معالجة الدفع. يرجى المحاولة لاحقًا أو التواصل مع الدعم.";
      setErrorMessage(message);
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100">
          <CreditCard className="me-3 h-6 w-6 text-blue-500 dark:text-blue-400" />
          {language === "en" ? "Payment Information" : "معلومات الدفع"}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          {language === "en"
            ? "Choose your payment method. Currently, only Visa/Mastercard is active."
            : "اختر طريقة الدفع. حاليًا، فقط Visa/Mastercard نشط."}
        </p>

        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50">
            <div className="flex items-center">
              <Lock className="me-3 h-5 w-5 text-gray-400" />
              <span>{language === "en" ? "PayPal (Coming Soon)" : "بايبال (قريبًا)"}</span>
            </div>
            <span className="text-sm text-gray-500">Disabled</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800">
            <div className="flex items-center">
              <CreditCard className="me-3 h-5 w-5 text-green-500 dark:text-green-400" />
              <span>{language === "en" ? "Visa/Mastercard" : "فيزا/ماستركارد"}</span>
            </div>
            <span className="text-sm text-green-500 dark:text-green-400">Active</span>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              {language === "en" ? "Price: " : "السعر: "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {book.price} USD
              </span>
            </p>
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
          onClick={createPayment}
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

        <div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          <span>
            {language === "en" ? "By completing your purchase, you agree to our " : "بإكمال الشراء، فإنك توافق على "}
          </span>
          <Link to="/terms" className="text-blue-500 dark:text-blue-400 hover:underline">
            {language === "en" ? "Terms of Service" : "شروط الخدمة"}
          </Link>
        </div>
      </div>

      {showPaymentPopup && paymentDetails && (
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          paymentLink={paymentDetails.paymentLink}
          amount={paymentDetails.amount}
          currency={paymentDetails.currency}
          language={paymentDetails.language}
        />
      )}
    </>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems: initialCartItems } = location.state || {};
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [user, setUser] = useState(auth.currentUser);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false); // حالة جديدة للتحكم في عرض الرسالة

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (initialCartItems && initialCartItems.length > 0) {
          setCartItems(initialCartItems.map(item => ({ ...item, quantity: 1 })));
          setDataLoaded(true); // البيانات جاهزة من الـ state
        } else {
          const fetchCart = async () => {
            const cartRef = collection(db, "carts");
            const q = query(cartRef, where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), quantity: 1 }));
            if (items.length === 0) {
              toast({
                title: language === "en" ? "Error" : "خطأ",
                description: language === "en" ? "No items in cart." : "لا يوجد عناصر في السلة.",
                variant: "destructive",
              });
              navigate("/cart");
            } else {
              setCartItems(items);
            }
            setDataLoaded(true); // البيانات جاهزة من Firestore
          };
          fetchCart();
        }
      } else {
        toast({
          title: language === "en" ? "Please sign in" : "يرجى تسجيل الدخول",
          description: language === "en" ? "Sign in to proceed with checkout." : "سجل الدخول للمتابعة.",
          variant: "destructive",
        });
        navigate("/login");
        setDataLoaded(true); // لمنع عرض الرسالة أثناء التوجيه
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [location.state, language, toast, navigate]);

  if (loading || !dataLoaded) {
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

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          {language === "en" ? "No items to checkout." : "لا يوجد عناصر للدفع."}
          <Button className="mt-4" onClick={() => navigate("/cart")}>
            {language === "en" ? "Back to Cart" : "العودة للسلة"}
          </Button>
        </div>
      </Layout>
    );
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ar-EG", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <ErrorBoundary language={language}>
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
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{item.title}</span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">
                        {formatCurrency(item.price * (item.quantity || 1))}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-5 font-bold text-lg flex justify-between">
                    <span className="text-gray-800 dark:text-gray-100">{language === "en" ? "Total" : "المجموع"}</span>
                    <span className="text-blue-600 dark:text-blue-400">{formatCurrency(totalPrice)}</span>
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
              <CheckoutForm
                book={{ id: cartItems[0]?.id || "", title: cartItems[0]?.title || "", price: totalPrice }}
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