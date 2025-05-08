import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  signInWithEmailAndPassword,
  getIdTokenResult,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

interface Credentials {
  email: string;
  password: string;
}

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useTheme();
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [lastLoginAttempt, setLastLoginAttempt] = useState<number | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const hasNavigated = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    console.log("Checking authentication state...");

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!mounted.current) return;

      if (user && !hasNavigated.current) {
        try {
          console.log("User found:", user.email);
          const token = await getIdTokenResult(user, true);
          console.log("Token claims:", token.claims);

          if (token.claims && token.claims.admin === true) {
            console.log("Admin privileges confirmed");
            hasNavigated.current = true;
            navigate("/admin/dashboard", { replace: true });
          } else {
            console.log("No admin privileges found");
            await auth.signOut();
            if (mounted.current) {
              toast({
                title: language === "en" ? "Access Denied" : "تم رفض الوصول",
                description: language === "en" 
                  ? "You do not have admin privileges" 
                  : "ليس لديك صلاحيات المسؤول",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("Auth check error:", error);
          if (mounted.current) {
            toast({
              title: language === "en" ? "Error" : "خطأ",
              description: language === "en"
                ? "Error verifying admin status"
                : "خطأ في التحقق من صلاحيات المسؤول",
              variant: "destructive",
            });
          }
        }
      }
    });

    return () => {
      mounted.current = false;
      unsubscribe();
    };
  }, [navigate, toast, language]);

  useEffect(() => {
    mounted.current = true;
    const blockedUntil = localStorage.getItem("adminLoginBlockedUntil");
    const storedFailedAttempts = localStorage.getItem("adminLoginFailedAttempts");

    if (blockedUntil && Number(blockedUntil) > Date.now()) {
      setIsBlocked(true);
      setFailedAttempts(Number(storedFailedAttempts || 0));

      const timeoutId = setTimeout(() => {
        if (mounted.current) {
          setIsBlocked(false);
          setFailedAttempts(0);
          localStorage.removeItem("adminLoginBlockedUntil");
          localStorage.removeItem("adminLoginFailedAttempts");
        }
      }, Number(blockedUntil) - Date.now());

      return () => clearTimeout(timeoutId);
    }

    return () => {
      mounted.current = false;
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!credentials.email) {
      errors.email = language === "en" 
        ? "Email is required"
        : "البريد الإلكتروني مطلوب";
      isValid = false;
    } else if (!validateEmail(credentials.email)) {
      errors.email = language === "en"
        ? "Invalid email format"
        : "تنسيق البريد الإلكتروني غير صحيح";
      isValid = false;
    }

    if (!credentials.password) {
      errors.password = language === "en"
        ? "Password is required"
        : "كلمة المرور مطلوبة";
      isValid = false;
    } else if (!validatePassword(credentials.password)) {
      errors.password = language === "en"
        ? "Password must be at least 6 characters"
        : "يجب أن تكون كلمة المرور 6 أحرف على الأقل";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleFailedAttempt = () => {
    const newFailedAttempts = failedAttempts + 1;
    setFailedAttempts(newFailedAttempts);
    localStorage.setItem("adminLoginFailedAttempts", String(newFailedAttempts));

    if (newFailedAttempts >= 5) {
      const blockUntil = Date.now() + 15 * 60 * 1000;
      setIsBlocked(true);
      localStorage.setItem("adminLoginBlockedUntil", String(blockUntil));
      toast({
        title: language === "en" ? "Account Locked" : "تم قفل الحساب",
        description: language === "en" 
          ? "Too many failed attempts. Please try again after 15 minutes."
          : "محاولات فاشلة كثيرة. يرجى المحاولة مرة أخرى بعد 15 دقيقة.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt started");

    if (isBlocked) {
      toast({
        title: language === "en" ? "Access Denied" : "تم رفض الوصول",
        description: language === "en"
          ? "Please wait until the blocking period ends."
          : "يرجى الانتظار حتى تنتهي فترة الحظر.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      console.log("Attempting sign in...");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const user = userCredential.user;
      console.log("User signed in:", user.email);

      await user.getIdToken(true);
      const token = await getIdTokenResult(user, true);
      console.log("Token claims after login:", token.claims);

      if (token.claims && token.claims.admin === true) {
        console.log("Admin login successful");
        setFailedAttempts(0);
        localStorage.removeItem("adminLoginFailedAttempts");
        localStorage.removeItem("adminLoginBlockedUntil");

        toast({
          title: language === "en" ? "Success" : "نجاح",
          description: language === "en" ? "Logged in successfully" : "تم تسجيل الدخول بنجاح",
        });

        navigate("/admin/dashboard", { replace: true });
        hasNavigated.current = true;
      } else {
        console.log("No admin privileges found after login");
        await auth.signOut();
        throw new Error("no_admin_privileges");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.message === "no_admin_privileges") {
        toast({
          title: language === "en" ? "Access Denied" : "تم رفض الوصول",
          description: language === "en"
            ? "This account does not have admin privileges."
            : "هذا الحساب لا يملك صلاحيات المسؤول.",
          variant: "destructive",
        });
      } else {
        handleFailedAttempt();
        
        const errorMessage = getErrorMessage(error.code);
        toast({
          title: language === "en" ? "Error" : "خطأ",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    const messages: Record<string, { en: string; ar: string }> = {
      "auth/invalid-credential": {
        en: "Invalid email or password.",
        ar: "بريد إلكتروني أو كلمة مرور غير صحيحة.",
      },
      "auth/user-not-found": {
        en: "No account found with this email.",
        ar: "لم يتم العثور على حساب بهذا البريد الإلكتروني.",
      },
      "auth/wrong-password": {
        en: "Incorrect password.",
        ar: "كلمة المرور غير صحيحة.",
      },
      "auth/too-many-requests": {
        en: "Too many failed attempts. Please try again later.",
        ar: "محاولات فاشلة كثيرة. يرجى المحاولة لاحقاً.",
      },
      "default": {
        en: "An error occurred. Please try again.",
        ar: "حدث خطأ. يرجى المحاولة مرة أخرى.",
      },
    };

    const message = messages[errorCode] || messages["default"];
    return language === "en" ? message.en : message.ar;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex items-center justify-center bg-background p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center mb-4"
          >
            <Shield className="h-12 w-12 text-primary" />
          </motion.div>
          <CardTitle className="text-2xl font-bold">
            {language === "en" ? "Admin Login" : "تسجيل دخول المسؤول"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? "Enter your credentials to access the admin panel"
              : "أدخل بيانات الاعتماد للوصول إلى لوحة المسؤول"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AnimatePresence>
            {isBlocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {language === "en" ? "Account Locked" : "تم قفل الحساب"}
                  </AlertTitle>
                  <AlertDescription>
                    {language === "en"
                      ? "Too many failed attempts. Please try again later."
                      : "محاولات فاشلة كثيرة. يرجى المحاولة لاحقاً."}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === "en" ? "Email" : "البريد الإلكتروني"}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                disabled={isLoading || isBlocked}
                className={validationErrors.email ? "border-red-500" : ""}
                placeholder={language === "en" ? "admin@example.com" : "admin@example.com"}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {language === "en" ? "Password" : "كلمة المرور"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={isLoading || isBlocked}
                  className={validationErrors.password ? "border-red-500" : ""}
                  placeholder={language === "en" ? "••••••••" : "••••••••"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isBlocked}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                           text-muted-foreground hover:text-foreground
                           focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-primary rounded border-gray-300
                           focus:ring-primary"
                  disabled={isLoading || isBlocked}
                />
                <span className="text-sm text-muted-foreground">
                  {language === "en" ? "Remember me" : "تذكرني"}
                </span>
              </label>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || isBlocked}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isLoading
              ? language === "en"
                ? "Logging in..."
                : "جاري تسجيل الدخول..."
              : language === "en"
              ? "Login"
              : "تسجيل الدخول"}
          </Button>

          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="h-4 w-4 mr-2" />
            {language === "en"
              ? "Admin access only. Contact support if you need assistance."
              : "الوصول للمسؤولين فقط. تواصل مع الدعم إذا كنت بحاجة للمساعدة."}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AdminLoginPage;