import React from "react";
import Navbar from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield, Lock, Eye, Database, Cookie, User, Clock, Baby, FileText, Mail } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const PrivacyPolicy = () => {
  const { language } = useTheme();

  const content = {
    ar: {
      privacyPolicy: "سياسة الخصوصية",
      introduction: "مقدمة",
      privacyIntroduction: "نحن في MOBE-STORE نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمع معلوماتك واستخدامها وحمايتها.",
      informationWeCollect: "المعلومات التي نجمعها",
      personalInformation: "معلومات شخصية",
      personalInfo1: "الاسم",
      personalInfo2: "البريد الإلكتروني",
      personalInfo3: "رقم الهاتف (اختياري)",
      personalInfo4: "عنوان الشحن (إذا تم تقديمه)",
      usageInformation: "معلومات الاستخدام",
      usageInfo1: "الكتب التي قمت بتصفحها",
      usageInfo2: "الكتب التي قمت بشرائها",
      usageInfo3: "تاريخ التصفح",
      usageInfo4: "الروابط التي قمت بالنقر عليها",
      technicalInformation: "معلومات تقنية",
      technicalInfo1: "عنوان IP",
      technicalInfo2: "نوع المتصفح",
      technicalInfo3: "نظام التشغيل",
      howWeUseInformation: "كيف نستخدم المعلومات",
      useInfo1: "لتوفير خدماتنا وإتمام طلباتك",
      useInfo2: "لتحسين تجربة المستخدم",
      useInfo3: "لإرسال تحديثات وعروض ترويجية",
      useInfo4: "للتواصل معك بخصوص طلباتك",
      useInfo5: "لتحليل بيانات الاستخدام",
      useInfo6: "للامتثال للمتطلبات القانونية",
      informationSharing: "مشاركة المعلومات",
      informationSharingText: "نحن لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:",
      sharingCase1: "مع مزودي الخدمات لإتمام طلباتك (مثل خدمات الدفع)",
      sharingCase2: "للامتثال للقوانين أو الأوامر القضائية",
      sharingCase3: "لحماية حقوقنا أو ممتلكاتنا",
      sharingCase4: "بموافقتك الصريحة",
      dataSecurity: "أمان المعلومات",
      dataSecurityText: "نحن نستخدم تدابير أمنية لحماية بياناتك من الوصول غير المصرح به أو الاستخدام غير القانوني.",
      securityMeasure1: "تشفير البيانات أثناء النقل",
      securityMeasure2: "تخزين آمن للبيانات",
      securityMeasure3: "مراجعات أمنية دورية",
      securityMeasure4: "التدريب المستمر لفريقنا",
      cookies: "ملفات تعريف الارتباط",
      cookiesText: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع.",
      cookieType1: "ملفات تعريف ارتباط أساسية لتشغيل الموقع",
      cookieType2: "ملفات تعريف ارتباط تحليلية لفهم سلوك المستخدم",
      cookieType3: "ملفات تعريف ارتباط إعلانية لعرض إعلانات مخصصة",
      userRights: "حقوق المستخدم",
      userRightsText: "لديك الحق في التحكم بمعلوماتك الشخصية، بما في ذلك:",
      userRight1: "الوصول إلى بياناتك الشخصية",
      userRight2: "تصحيح أي معلومات غير دقيقة",
      userRight3: "طلب حذف بياناتك",
      userRight4: "إلغاء الاشتراك في الرسائل الترويجية",
      userRight5: "تقديم شكوى إلى الجهات الرقابية",
      dataRetention: "الاحتفاظ بالبيانات",
      dataRetentionText: "نحتفظ ببياناتك فقط طالما كان ذلك ضروريًا لتحقيق الأغراض المذكورة في هذه السياسة أو كما يقتضي القانون.",
      childrensPrivacy: "خصوصية الأطفال",
      childrensPrivacyText: "موقعنا غير موجه للأطفال دون سن 13 عامًا، ولا نجمع بياناتهم عن قصد. إذا علمنا بجمع بيانات طفل دون موافقة الوالدين، سنقوم بحذفها فورًا.",
      changesOfPolicy: "تغييرات على السياسة",
      changesOfPolicyText: "قد نحدّث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على الموقع.",
      contactInformation: "معلومات الاتصال",
      privacyContactText: "إذا كانت لديك أي استفسارات حول هذه السياسة، يرجى التواصل معنا عبر البريد الإلكتروني: mobe.store0@gmail.com.",
      lastUpdated: "آخر تحديث",
    },
    en: {
      privacyPolicy: "Privacy Policy",
      introduction: "Introduction",
      privacyIntroduction: "At MOBE-STORE, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information.",
      informationWeCollect: "Information We Collect",
      personalInformation: "Personal Information",
      personalInfo1: "Name",
      personalInfo2: "Email Address",
      personalInfo3: "Phone Number (optional)",
      personalInfo4: "Shipping Address (if provided)",
      usageInformation: "Usage Information",
      usageInfo1: "Books you have browsed",
      usageInfo2: "Books you have purchased",
      usageInfo3: "Browsing history",
      usageInfo4: "Links you have clicked",
      technicalInformation: "Technical Information",
      technicalInfo1: "IP Address",
      technicalInfo2: "Browser Type",
      technicalInfo3: "Operating System",
      howWeUseInformation: "How We Use Your Information",
      useInfo1: "To provide our services and fulfill your orders",
      useInfo2: "To improve user experience",
      useInfo3: "To send updates and promotional offers",
      useInfo4: "To communicate with you regarding your orders",
      useInfo5: "To analyze usage data",
      useInfo6: "To comply with legal requirements",
      informationSharing: "Information Sharing",
      informationSharingText: "We do not share your personal information with third parties except in the following cases:",
      sharingCase1: "With service providers to fulfill your orders (e.g., payment services)",
      sharingCase2: "To comply with laws or court orders",
      sharingCase3: "To protect our rights or property",
      sharingCase4: "With your explicit consent",
      dataSecurity: "Data Security",
      dataSecurityText: "We implement security measures to protect your data from unauthorized access or unlawful use.",
      securityMeasure1: "Data encryption during transmission",
      securityMeasure2: "Secure data storage",
      securityMeasure3: "Regular security audits",
      securityMeasure4: "Ongoing training for our team",
      cookies: "Cookies",
      cookiesText: "We use cookies to enhance your experience on our website.",
      cookieType1: "Essential cookies to operate the site",
      cookieType2: "Analytical cookies to understand user behavior",
      cookieType3: "Advertising cookies to display personalized ads",
      userRights: "User Rights",
      userRightsText: "You have the right to control your personal information, including:",
      userRight1: "Access your personal data",
      userRight2: "Correct any inaccurate information",
      userRight3: "Request deletion of your data",
      userRight4: "Opt-out of promotional emails",
      userRight5: "Lodge a complaint with a supervisory authority",
      dataRetention: "Data Retention",
      dataRetentionText: "We retain your data only as long as necessary for the purposes outlined in this policy or as required by law.",
      childrensPrivacy: "Children's Privacy",
      childrensPrivacyText: "Our website is not directed to children under 13 years of age, and we do not knowingly collect their data. If we learn that a child's data has been collected without parental consent, we will delete it immediately.",
      changesOfPolicy: "Changes to This Policy",
      changesOfPolicyText: "We may update this policy from time to time. We will notify you of any significant changes via email or through a notice on the website.",
      contactInformation: "Contact Information",
      privacyContactText: "If you have any questions about this policy, please contact us at: mobe.store0@gmail.com.",
      lastUpdated: "Last Updated",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-10 flex-grow">
        {/* ترويسة الصفحة */}
        <div className="flex items-center mb-8">
          <Shield className="text-blue-600 h-8 w-8 ltr:mr-3 rtl:ml-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{content[language].privacyPolicy}</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {/* مقدمة */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <Lock className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                {content[language].introduction}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].privacyIntroduction}
              </p>
            </div>

            {/* المعلومات التي نجمعها */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <Database className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                {content[language].informationWeCollect}
              </h2>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">{content[language].personalInformation}</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>{content[language].personalInfo1}</li>
                <li>{content[language].personalInfo2}</li>
                <li>{content[language].personalInfo3}</li>
                <li>{content[language].personalInfo4}</li>
              </ul>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">{content[language].usageInformation}</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>{content[language].usageInfo1}</li>
                <li>{content[language].usageInfo2}</li>
                <li>{content[language].usageInfo3}</li>
                <li>{content[language].usageInfo4}</li>
              </ul>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">{content[language].technicalInformation}</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{content[language].technicalInfo1}</li>
                <li>{content[language].technicalInfo2}</li>
                <li>{content[language].technicalInfo3}</li>
              </ul>
            </div>

            {/* كيف نستخدم المعلومات */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <Eye className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                {content[language].howWeUseInformation}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{content[language].useInfo1}</li>
                <li>{content[language].useInfo2}</li>
                <li>{content[language].useInfo3}</li>
                <li>{content[language].useInfo4}</li>
                <li>{content[language].useInfo5}</li>
                <li>{content[language].useInfo6}</li>
              </ul>
            </div>

            {/* مشاركة المعلومات */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].informationSharing}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {content[language].informationSharingText}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{content[language].sharingCase1}</li>
                <li>{content[language].sharingCase2}</li>
                <li>{content[language].sharingCase3}</li>
                <li>{content[language].sharingCase4}</li>
              </ul>
            </div>

            {/* أمان المعلومات */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].dataSecurity}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {content[language].dataSecurityText}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{content[language].securityMeasure1}</li>
                <li>{content[language].securityMeasure2}</li>
                <li>{content[language].securityMeasure3}</li>
                <li>{content[language].securityMeasure4}</li>
              </ul>
            </div>

            {/* ملفات تعريف الارتباط */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].cookies}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {content[language].cookiesText}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{content[language].cookieType1}</li>
                <li>{content[language].cookieType2}</li>
                <li>{content[language].cookieType3}</li>
              </ul>
            </div>

            {/* حقوق المستخدم */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].userRights}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {content[language].userRightsText}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{content[language].userRight1}</li>
                <li>{content[language].userRight2}</li>
                <li>{content[language].userRight3}</li>
                <li>{content[language].userRight4}</li>
                <li>{content[language].userRight5}</li>
              </ul>
            </div>

            {/* الاحتفاظ بالبيانات */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].dataRetention}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].dataRetentionText}
              </p>
            </div>

            {/* الأطفال */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].childrensPrivacy}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].childrensPrivacyText}
              </p>
            </div>

            {/* التغييرات */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{content[language].changesOfPolicy}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].changesOfPolicyText}
              </p>
            </div>

            {/* معلومات الاتصال */}
            <div className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <Mail className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                {content[language].contactInformation}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content[language].privacyContactText}
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

export default PrivacyPolicy;