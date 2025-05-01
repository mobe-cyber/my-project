
type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  en: {
    // Navigation
    home: "Home",
    categories: "Categories",
    bestsellers: "Bestsellers",
    offers: "Offers",
    about: "About Us",
    contact: "Contact",
    search: "Search for books...",
    login: "Login",
    register: "Register",
    myAccount: "My Account",
    myLibrary: "My Library",
    dashboard: "Dashboard",
    logout: "Logout",
    
    // Homepage
    welcomeHeading: "Discover a World of Knowledge",
    welcomeSubheading: "Buy, download and read thousands of eBooks instantly",
    exploreButton: "Explore Books",
    featuredBooks: "Featured Books",
    newArrivals: "New Arrivals",
    bestSellers: "Best Sellers",
    viewAll: "View All",
    
    // Book details
    author: "Author",
    category: "Category",
    pages: "Pages",
    format: "Format",
    price: "Price",
    rating: "Rating",
    description: "Description",
    buyNow: "Buy Now",
    addToCart: "Add to Cart",
    reviews: "Reviews",
    writeReview: "Write a Review",
    
    // Auth
    emailAddress: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    
    // User dashboard
    accountInfo: "Account Information",
    myBooks: "My Books",
    purchaseHistory: "Purchase History",
    settings: "Settings",
    
    // Footer
    copyrights: "© 2025 MobeStore. All rights reserved.",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    
    // Theme
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    
    // Language
    changeLanguage: "العربية",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    categories: "التصنيفات",
    bestsellers: "الأكثر مبيعاً",
    offers: "العروض",
    about: "من نحن",
    contact: "اتصل بنا",
    search: "ابحث عن الكتب...",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    myAccount: "حسابي",
    myLibrary: "مكتبتي",
    dashboard: "لوحة التحكم",
    logout: "تسجيل الخروج",
    
    // Homepage
    welcomeHeading: "اكتشف عالماً من المعرفة",
    welcomeSubheading: "اشترِ وحمّل واقرأ آلاف الكتب الإلكترونية فوراً",
    exploreButton: "تصفح الكتب",
    featuredBooks: "كتب مميزة",
    newArrivals: "وصل حديثاً",
    bestSellers: "الأكثر مبيعاً",
    viewAll: "عرض الكل",
    
    // Book details
    author: "المؤلف",
    category: "التصنيف",
    pages: "الصفحات",
    format: "الصيغة",
    price: "السعر",
    rating: "التقييم",
    description: "الوصف",
    buyNow: "اشترِ الآن",
    addToCart: "أضف إلى السلة",
    reviews: "التقييمات",
    writeReview: "اكتب تقييماً",
    
    // Auth
    emailAddress: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    createAccount: "إنشاء حساب",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    dontHaveAccount: "ليس لديك حساب؟",
    
    // User dashboard
    accountInfo: "معلومات الحساب",
    myBooks: "كتبي",
    purchaseHistory: "سجل المشتريات",
    settings: "الإعدادات",
    
    // Footer
    copyrights: "© 2025 متجر موبي. جميع الحقوق محفوظة.",
    termsOfService: "شروط الخدمة",
    privacyPolicy: "سياسة الخصوصية",
    
    // Theme
    darkMode: "الوضع المظلم",
    lightMode: "الوضع المضيء",
    
    // Language
    changeLanguage: "English",
  }
};

export const useTranslation = (language: string) => {
  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return { t };
};
