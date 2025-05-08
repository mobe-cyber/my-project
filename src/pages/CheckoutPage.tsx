import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RJ3PoPNvGoODCV7Jfz9cWrFKNPluhpY5J1LqcEWsHEYSnzzxwdgAdzy1zgh3suc9PS93mODDCpcPVmo0PmPpbsB00jHyokWsP");

const CheckoutForm = ({ book, user, language, t, toast, navigate }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cardholderName, setCardholderName] = useState("");
  const { theme } = useTheme();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage(language === "en" ? "Stripe is not loaded. Please refresh the page." : "Stripe لم يتم تحميله. يرجى تحديث الصفحة.");
      return;
    }

    if (!cardholderName.trim()) {
      setErrorMessage(language === "en" ? "Please enter the cardholder name." : "يرجى إدخال اسم صاحب البطاقة.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setErrorMessage(language === "en" ? "Card details are missing. Please try again." : "بيانات البطاقة مفقودة. حاول مرة أخرى.");
        setIsProcessing(false);
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardholderName.trim(),
        },
      });

      if (error) {
        console.log("Payment Method Error:", error.message);
        setErrorMessage(error.message);
        setIsProcessing(false);
        return;
      }

      console.log("Payment Method created:", paymentMethod);

      if (!user || !user.uid) {
        setErrorMessage(language === "en" ? "Please sign in to complete the purchase." : "يرجى تسجيل الدخول لإتمام الشراء.");
        setIsProcessing(false);
        return;
      }

      // تسجيل الشراء في Firestore
      const purchaseId = `${user.uid}_${book.id}`;
      await setDoc(doc(db, "purchases", purchaseId), {
        userId: user.uid,
        bookId: book.id,
        title: book.title,
        price: book.price,
        purchaseDate: new Date().toISOString(),
      });
      console.log("Purchase recorded in Firestore with ID:", purchaseId);

      toast({
        title: language === "en" ? "Purchase Successful" : "تم الشراء بنجاح",
        description: language === "en" ? "Redirecting to the book..." : "جاري التحويل إلى الكتاب...",
      });

      navigate(`/read/${book.id}`);
    } catch (error) {
      console.error("Error completing purchase:", error.message || error);
      setErrorMessage(
        language === "en"
          ? `Failed to process payment. ${error.message || "Please try again later."}`
          : `فشل في معالجة الدفع. ${error.message || "يرجى المحاولة لاحقًا."}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100">
          <CreditCard className="me-3 h-6 w-6 text-blue-500 dark:text-blue-400" />
          {language === "en" ? "Payment Information" : "معلومات الدفع"}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          {language === "en"
            ? "Secure payment is processed by Stripe. We do not store your payment information."
            : "تتم معالجة الدفع الآمن بواسطة Stripe. نحن لا نخزن معلومات الدفع الخاصة بك."}
        </p>

        <div className="flex justify-center mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png"
            alt="Stripe"
            className="h-12"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/150";
            }}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <User className="me-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            {language === "en" ? "Cardholder Name" : "اسم صاحب البطاقة"}
          </label>
          <div className="relative">
            <input
              id="cardholderName"
              type="text"
              value={cardholderName}
              onChange={(e) => {
                console.log("Cardholder Name Input:", e.target.value);
                setCardholderName(e.target.value);
              }}
              placeholder={language === "en" ? "John Doe" : "جون دو"}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-sm"
              required
            />
            <User className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {language === "en" ? "Enter the name as it appears on your card." : "أدخل الاسم كما يظهر على بطاقتك."}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <CreditCard className="me-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            {language === "en" ? "Card Details" : "تفاصيل البطاقة"}
          </label>
          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm transition-all duration-300">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: theme === "dark" ? "#E5E7EB" : "#1F2937",
                    "::placeholder": {
                      color: theme === "dark" ? "#9CA3AF" : "#9CA3AF",
                    },
                    padding: "12px",
                    backgroundColor: "transparent",
                    iconColor: theme === "dark" ? "#60A5FA" : "#2563EB",
                    lineHeight: "24px",
                  },
                  invalid: {
                    color: "#EF4444",
                    iconColor: "#EF4444",
                  },
                },
                hidePostalCode: true,
              }}
              onChange={(e) => {
                console.log("CardElement Change:", e);
              }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {language === "en" ? "Example: 4242 4242 4242 4242, MM/YY, CVC" : "مثال: 4242 4242 4242 4242، MM/YY، CVC"}
          </p>
        </div>

        {errorMessage && <div className="text-red-500 text-sm mb-6 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">{errorMessage}</div>}

        <Button
          type="submit"
          className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isProcessing || !stripe || !cardholderName.trim()}
        >
          {isProcessing ? (
            <>
              <span className="animate-spin me-2">⚪</span>
              {language === "en" ? "Processing..." : "جاري المعالجة..."}
            </>
          ) : language === "en" ? "Confirm Purchase" : "تأكيد الشراء"}
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
    </form>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { book } = location.state || {};
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [user, setUser] = useState(auth.currentUser);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ar-EG", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
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
            <Elements stripe={stripePromise}>
              <CheckoutForm
                book={book}
                user={user}
                language={language}
                t={t}
                toast={toast}
                navigate={navigate}
              />
            </Elements>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;