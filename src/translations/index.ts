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
    
    // Homepage (Index.tsx)
    welcomeHeading: "Discover a World of Knowledge",
    welcomeSubheading: "Buy, download and read thousands of eBooks instantly",
    exploreButton: "Explore Books",
    featuredBooks: "Featured Books",
    newArrivals: "New Arrivals",
    bestSellers: "Best Sellers",
    viewAll: "View All",
    fictionBooks: "Fiction Books",
    programmingCybersecurity: "Programming and Cybersecurity",
    
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
    faq: "FAQ",
    
    // FAQ Page
    general: "General",
    purchase: "Purchase & Payment",
    technical: "Technical Support",
    callUs: "Call Us",
    sendMessage: "Send Message",
    emailSupport: "Email Support",
    howToCreateAccount: "How do I create a new account?",
    howToCreateAccountAnswer: "You can create a new account by clicking 'Register' at the top of the page, then entering your personal details like name, email, and password. A verification email will be sent to confirm your account.",
    readDirectly: "Can I read books directly from the site?",
    readDirectlyAnswer: "Yes, you can read all purchased books directly through our built-in reading app. You can also download books in PDF or EPUB formats to read on your preferred devices.",
    multiDeviceAccess: "Can I access my books on multiple devices?",
    multiDeviceAccessAnswer: "Yes, you can access your digital library from any internet-connected device using one account. Reading progress and bookmarks are synced automatically across all devices.",
    recoverPassword: "How can I recover my password?",
    recoverPasswordAnswer: "If you forgot your password, click 'Forgot Password?' on the login page. A reset link will be sent to your registered email.",
    howToBuy: "How do I buy a book?",
    howToBuyAnswer: "To buy a book, browse the store, select the book you want, then click 'Add to Cart'. You can continue shopping or proceed to the cart to complete the purchase with available payment methods.",
    paymentMethods: "What payment methods are accepted?",
    paymentMethodsAnswer: "We accept payments via Visa and Mastercard.",
    paymentSecurity: "Is my payment information secure?",
    paymentSecurityAnswer: "Yes, we use industry-standard encryption and secure payment gateways to protect your payment information. Your data is never stored on our servers.",
    refundPolicy: "What is the refund policy for digital books?",
    refundPolicyAnswer: "Refunds are available within 7 days of purchase if there is a technical issue preventing access to the book. Contact our support team to initiate a refund.",
    promoCodes: "Can I use promotional codes or discounts?",
    promoCodesAnswer: "Yes, you can apply promotional codes at checkout. Enter the code in the designated field to receive your discount. Check our Offers page for current promotions.",
    cancelOrder: "Can I cancel my order after purchase?",
    cancelOrderAnswer: "Digital books cannot be canceled after purchase due to their instant delivery nature. However, you can request a refund within 7 days if there is a technical issue.",
    ebookFormats: "What eBook formats are available?",
    ebookFormatsAnswer: "Our library offers books in PDF and EPUB formats. PDF preserves the original page design, while EPUB offers flexibility in text size and adapts to various screen sizes.",
    systemRequirements: "What are the system requirements for reading books?",
    systemRequirementsAnswer: "Books can be read via a web browser on any device (PC, tablet, smartphone) with an internet connection. For offline reading, download the book and use apps like Adobe Acrobat Reader for PDF or Apple Books/Google Play Books for EPUB.",
    offlineReading: "Can I read books offline?",
    offlineReadingAnswer: "Yes, you can download purchased books and read them offline. Ensure you log in and download the books you want before going offline.",
    technicalSupport: "How can I resolve technical issues?",
    technicalSupportAnswer: "If you encounter a technical issue, try refreshing the page or logging out and back in. Ensure you’re using the latest browser version. If the issue persists, contact support via the 'Contact Us' page or email support@mobistore.sa.",
    
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
    
    // Homepage (Index.tsx)
    welcomeHeading: "اكتشف عالماً من المعرفة",
    welcomeSubheading: "اشترِ وحمّل واقرأ آلاف الكتب الإلكترونية فوراً",
    exploreButton: "تصفح الكتب",
    featuredBooks: "كتب مميزة",
    newArrivals: "وصل حديثاً",
    bestSellers: "الأكثر مبيعاً",
    viewAll: "عرض الكل",
    fictionBooks: "كتب الخيال",
    programmingCybersecurity: "البرمجة والأمن السيبراني",
    
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
    faq: "الأسئلة الشائعة",
    
    // FAQ Page
    general: "عام",
    purchase: "الشراء والدفع",
    technical: "الدعم التقني",
    callUs: "اتصل بنا",
    sendMessage: "إرسال رسالة",
    emailSupport: "دعم البريد الإلكتروني",
    howToCreateAccount: "كيف يمكنني إنشاء حساب جديد؟",
    howToCreateAccountAnswer: "يمكنك إنشاء حساب جديد بالنقر على 'تسجيل' في أعلى الصفحة، ثم إدخال بياناتك الشخصية مثل الاسم والبريد الإلكتروني وكلمة المرور. بعد إكمال التسجيل، سيتم إرسال رسالة تحقق إلى بريدك الإلكتروني لتأكيد حسابك.",
    readDirectly: "هل يمكنني قراءة الكتب مباشرة من الموقع؟",
    readDirectlyAnswer: "نعم، يمكنك قراءة جميع الكتب التي اشتريتها مباشرةً من خلال تطبيق القراءة المدمج في موقعنا. كما يمكنك تحميل الكتب بتنسيق PDF أو EPUB لقراءتها على أجهزتك المفضلة.",
    multiDeviceAccess: "هل يمكنني الوصول إلى كتبي من أجهزة متعددة؟",
    multiDeviceAccessAnswer: "نعم، يمكنك الوصول إلى مكتبتك الرقمية من أي جهاز متصل بالإنترنت باستخدام حساب واحد. يتم مزامنة تقدم القراءة والإشارات المرجعية تلقائيًا عبر جميع أجهزتك.",
    recoverPassword: "كيف يمكنني استعادة كلمة المرور؟",
    recoverPasswordAnswer: "إذا نسيت كلمة المرور، يمكنك النقر على 'نسيت كلمة المرور؟' في صفحة تسجيل الدخول. سيتم إرسال رابط لإعادة تعيين كلمة المرور إلى بريدك الإلكتروني المسجل.",
    howToBuy: "كيف يمكنني شراء كتاب؟",
    howToBuyAnswer: "لشراء كتاب، تصفح المتجر واختر الكتاب الذي تريده، ثم انقر على 'إضافة للسلة'. يمكنك متابعة التسوق أو الانتقال إلى سلة التسوق لإكمال عملية الشراء باستخدام طرق الدفع المتاحة.",
    paymentMethods: "ما هي طرق الدفع المقبولة؟",
    paymentMethodsAnswer: "نقبل الدفع عبر فيزا وماستركارد.",
    paymentSecurity: "هل معلومات الدفع الخاصة بي آمنة؟",
    paymentSecurityAnswer: "نعم، نستخدم تشفيرًا قياسيًا عالي المستوى وبوابات دفع آمنة لحماية معلومات الدفع الخاصة بك. لا يتم تخزين بياناتك على خوادمنا.",
    refundPolicy: "ما هي سياسة الاسترداد للكتب الرقمية؟",
    refundPolicyAnswer: "يمكن استرداد الأموال خلال 7 أيام من الشراء إذا واجهت مشكلة تقنية تمنع الوصول إلى الكتاب. تواصل مع فريق الدعم لتقديم طلب الاسترداد.",
    promoCodes: "هل يمكنني استخدام كوبونات خصم أو عروض ترويجية؟",
    promoCodesAnswer: "نعم، يمكنك إدخال كوبونات الخصم عند الدفع. أدخل الكود في الحقل المخصص للحصول على الخصم. تحقق من صفحة العروض لمعرفة العروض الحالية.",
    cancelOrder: "هل يمكنني إلغاء طلبي بعد الشراء؟",
    cancelOrderAnswer: "لا يمكن إلغاء الكتب الرقمية بعد الشراء بسبب طبيعة التسليم الفوري. ومع ذلك، يمكنك طلب استرداد الأموال خلال 7 أيام إذا واجهت مشكلة تقنية.",
    ebookFormats: "ما هي صيغ الكتب الإلكترونية المتوفرة؟",
    ebookFormatsAnswer: "توفر مكتبتنا الكتب بصيغ PDF وEPUB. تتميز صيغة PDF بالحفاظ على تصميم الصفحات الأصلي، بينما تتميز EPUB بالمرونة في تغيير حجم النص والتكيف مع أحجام الشاشات المختلفة.",
    systemRequirements: "ما هي متطلبات النظام لقراءة الكتب؟",
    systemRequirementsAnswer: "يمكن قراءة الكتب من خلال متصفح الويب على أي جهاز (حاسوب، لوحي، هاتف ذكي) متصل بالإنترنت. للقراءة دون اتصال، يمكنك تحميل الكتاب واستخدام تطبيقات مثل Adobe Acrobat Reader للملفات بصيغة PDF أو تطبيقات مثل Apple Books أو Google Play Books لملفات EPUB.",
    offlineReading: "هل يمكنني قراءة الكتب بدون إنترنت؟",
    offlineReadingAnswer: "نعم، يمكنك تحميل الكتب التي اشتريتها وقراءتها بدون إنترنت. تأكد من تسجيل الدخول وتحميل الكتب التي تريد قراءتها قبل قطع الاتصال بالإنترنت.",
    technicalSupport: "كيف يمكنني حل المشكلات التقنية؟",
    technicalSupportAnswer: "إذا واجهت أي مشكلة تقنية، يرجى تجربة تحديث الصفحة أو إعادة تسجيل الدخول. تأكد أيضًا من استخدام أحدث إصدار من المتصفح. إذا استمرت المشكلة، يمكنك التواصل مع فريق الدعم الفني عبر صفحة 'اتصل بنا' أو عبر البريد الإلكتروني support@mobistore.sa.",
    
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