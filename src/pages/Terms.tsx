import React from "react";
import Navbar from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Scale, FileText, Shield, User, DollarSign, AlertTriangle, Copyright, Gavel } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Terms = () => {
  const { language } = useTheme();

  const content = {
    ar: {
      termsOfService: "شروط الخدمة",
      introduction: "مقدمة",
      termsIntroduction: "باستخدام موقع MOBE-STORE، فإنك توافق على الالتزام بشروط الخدمة هذه. يرجى قراءتها بعناية لفهم حقوقك ومسؤولياتك.",
      acceptanceOfTerms: "١. القبول",
      acceptanceOfTermsText: "باستخدامك هذا الموقع، فإنك توافق على الالتزام بهذه الشروط. إذا لم توافق، يرجى عدم استخدام الخدمة.",
      permittedUse: "٢. الاستخدام المسموح",
      permittedUseText: "يُسمح باستخدام الموقع لأغراض شخصية وغير تجارية فقط.",
      prohibitedUse1: "التعدي على حقوق الملكية الفكرية",
      prohibitedUse2: "نشر المحتوى غير القانوني",
      prohibitedUse3: "محاولة اختراق النظام",
      prohibitedUse4: "استخدام الخدمة لأغراض تجارية دون إذن",
      intellectualProperty: "٣. الملكية الفكرية",
      intellectualPropertyText: "جميع المحتويات المعروضة هي ملك لـ MobeStore ولا يجوز نسخها أو إعادة استخدامها بدون إذن.",
      accountRegistration: "الحساب والتسجيل",
      accountRegistrationText: "للوصول إلى بعض الخدمات، قد تحتاج إلى إنشاء حساب.",
      accountRequirement1: "يجب أن تكون عمرك 13 عامًا على الأقل",
      accountRequirement2: "تقديم معلومات دقيقة ومحدثة",
      accountRequirement3: "حفظ كلمة المرور بأمان",
      paymentsAndPricing: "المدفوعات والأسعار",
      paymentsAndPricingText: "جميع المدفوعات يجب أن تتم عبر القنوات المعتمدة.",
      paymentTerm1: "الدفع مقدمًا لجميع الطلبات",
      paymentTerm2: "لا يوجد استرداد مالي إلا في حالات استثنائية",
      paymentTerm3: "الأسعار قد تتغير دون إشعار مسبق",
      termination: "إنهاء الخدمة",
      terminationText: "يمكننا إنهاء الخدمة في أي وقت إذا تم خرق الشروط.",
      limitationOfLiability: "حدود المسؤولية",
      limitationOfLiabilityText: "نحن لا نتحمل مسؤولية عن أي أضرار ناتجة عن استخدام الموقع.",
      changesOfTerms: "٤. التغييرات",
      changesOfTermsText: "نحتفظ بالحق في تعديل شروط الخدمة في أي وقت دون إشعار مسبق.",
      contactInformation: "معلومات الاتصال",
      contactInformationText: "لأي استفسار، تواصل معنا عبر: mobe.store0@gmail.com.",
      legalSupport: "الدعم القانوني",
      legalSupportText: "للمسائل القانونية، يمكنك التواصل مع فريقنا القانوني عبر البريد الإلكتروني: legal@mobe.store.com.",
      lastUpdated: "آخر تحديث",
    },
    en: {
      termsOfService: "Terms of Service",
      introduction: "Introduction",
      termsIntroduction: "By using the MOBE-STORE website, you agree to comply with these Terms of Service. Please read them carefully to understand your rights and responsibilities.",
      acceptanceOfTerms: "1. Acceptance",
      acceptanceOfTermsText: "By using this site, you agree to be bound by these terms. If you do not agree, please do not use the service.",
      permittedUse: "2. Permitted Use",
      permittedUseText: "This site may only be used for personal, non-commercial purposes.",
      prohibitedUse1: "Infringement of intellectual property rights",
      prohibitedUse2: "Posting illegal content",
      prohibitedUse3: "Attempting to hack the system",
      prohibitedUse4: "Using the service for commercial purposes without permission",
      intellectualProperty: "3. Intellectual Property",
      intellectualPropertyText: "All content is owned by MobeStore and may not be copied or reused without permission.",
      accountRegistration: "Account and Registration",
      accountRegistrationText: "To access certain services, you may need to create an account.",
      accountRequirement1: "Must be at least 13 years old",
      accountRequirement2: "Provide accurate and up-to-date information",
      accountRequirement3: "Keep your password secure",
      paymentsAndPricing: "Payments and Pricing",
      paymentsAndPricingText: "All payments must be made through approved channels.",
      paymentTerm1: "Pre-payment for all orders",
      paymentTerm2: "No refunds except in exceptional cases",
      paymentTerm3: "Prices may change without prior notice",
      termination: "Termination",
      terminationText: "We may terminate the service at any time if these terms are breached.",
      limitationOfLiability: "Limitation of Liability",
      limitationOfLiabilityText: "We are not liable for any damages resulting from website use.",
      changesOfTerms: "4. Changes",
      changesOfTermsText: "We reserve the right to modify these terms at any time without prior notice.",
      contactInformation: "Contact Information",
      contactInformationText: "For any inquiries, contact us at: mobe.store0@gmail.com.",
      legalSupport: "Legal Support",
      legalSupportText: "For legal matters, you may contact our legal team at: legal@mobe.store.com.",
      lastUpdated: "Last Updated",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-10 flex-grow">
        {/* ترويسة الصفحة */}
        <div className="flex items-center mb-8">
          <Scale className="text-blue-600 h-8 w-8 ltr:mr-3 rtl:ml-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{content[language].termsOfService}</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {/* مقدمة */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <FileText className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                {content[language].introduction}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].termsIntroduction}
              </p>
            </div>

            {/* القبول */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].acceptanceOfTerms}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].acceptanceOfTermsText}
              </p>
            </div>

            {/* الاستخدام المسموح */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].permittedUse}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {content[language].permittedUseText}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{content[language].prohibitedUse1}</li>
                <li>{content[language].prohibitedUse2}</li>
                <li>{content[language].prohibitedUse3}</li>
                <li>{content[language].prohibitedUse4}</li>
              </ul>
            </div>

            {/* الملكية الفكرية */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].intellectualProperty}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].intellectualPropertyText}
              </p>
            </div>

            {/* الحساب والتسجيل */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].accountRegistration}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {content[language].accountRegistrationText}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{content[language].accountRequirement1}</li>
                <li>{content[language].accountRequirement2}</li>
                <li>{content[language].accountRequirement3}</li>
              </ul>
            </div>

            {/* المدفوعات والأسعار */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].paymentsAndPricing}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {content[language].paymentsAndPricingText}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{content[language].paymentTerm1}</li>
                <li>{content[language].paymentTerm2}</li>
                <li>{content[language].paymentTerm3}</li>
              </ul>
            </div>

            {/* إنهاء الخدمة */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].termination}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].terminationText}
              </p>
            </div>

            {/* تحديد المسؤولية */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].limitationOfLiability}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].limitationOfLiabilityText}
              </p>
            </div>

            {/* التغييرات */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].changesOfTerms}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].changesOfTermsText}
              </p>
            </div>

            {/* معلومات الاتصال */}
            <div className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <Shield className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                {content[language].contactInformation}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].contactInformationText}
              </p>
            </div>

            {/* الدعم القانوني */}
            <div className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <Gavel className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                {content[language].legalSupport}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].legalSupportText}
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {content[language].lastUpdated}: {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;