import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronDown, ChevronUp, Book, CreditCard, RotateCw, Phone, Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";

const FAQPage: React.FC = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);

  const generalFAQs = [
    {
      question: t("howToCreateAccount"),
      answer: t("howToCreateAccountAnswer"),
    },
    {
      question: t("readDirectly"),
      answer: t("readDirectlyAnswer"),
    },
    {
      question: t("multiDeviceAccess"),
      answer: t("multiDeviceAccessAnswer"),
    },
    {
      question: t("recoverPassword"),
      answer: t("recoverPasswordAnswer"),
    },
  ];

  const purchaseFAQs = [
    {
      question: t("howToBuy"),
      answer: t("howToBuyAnswer"),
    },
    {
      question: t("paymentMethods"),
      answer: t("paymentMethodsAnswer"),
    },
    {
      question: t("paymentSecurity"),
      answer: t("paymentSecurityAnswer"),
    },
    {
      question: t("refundPolicy"),
      answer: t("refundPolicyAnswer"),
    },
    {
      question: t("promoCodes"),
      answer: t("promoCodesAnswer"),
    },
  ];

  const technicalFAQs = [
    {
      question: t("ebookFormats"),
      answer: t("ebookFormatsAnswer"),
    },
    {
      question: t("systemRequirements"),
      answer: t("systemRequirementsAnswer"),
    },
    {
      question: t("offlineReading"),
      answer: t("offlineReadingAnswer"),
    },
    {
      question: t("technicalSupport"),
      answer: t("technicalSupportAnswer"),
    },
  ];

  // إضافة أيقونة ديناميكية للأكورديون
  const CustomAccordionTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <AccordionTrigger
        className={`text-right hover:no-underline ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-right flex-1">{children}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </AccordionTrigger>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
        <div className="container mx-auto py-10 flex-grow">
          {/* ترويسة الصفحة */}
          <div className="flex items-center justify-center mb-8 text-center">
            <div>
              <div className="flex justify-center">
                <HelpCircle className="text-brand-blue h-12 w-12 mb-4 animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {language === "en" ? "Frequently Asked Questions" : "الأسئلة الشائعة"}
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                {language === "en"
                  ? "We answer the most common questions to help you use our platform. If you don’t find an answer, feel free to contact us."
                  : "نجيب على الأسئلة الأكثر شيوعاً لمساعدتك في استخدام منصتنا. إذا لم تجد إجابة لسؤالك، يمكنك التواصل معنا مباشرة."}
              </p>
            </div>
          </div>

          {/* تصنيف الأسئلة */}
          <Tabs defaultValue="general" className="mb-8">
            <div className="flex justify-center mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <TabsTrigger
                  value="general"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-md rounded-md transition-all duration-200"
                >
                  <Book className="h-4 w-4" />
                  <span>{t("general")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="purchase"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-md rounded-md transition-all duration-200"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>{t("purchase")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="technical"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-md rounded-md transition-all duration-200"
                >
                  <RotateCw className="h-4 w-4" />
                  <span>{t("technical")}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* الأسئلة العامة */}
            <TabsContent value="general" className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                {generalFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <CustomAccordionTrigger>
                      {faq.question}
                    </CustomAccordionTrigger>
                    <AccordionContent className="text-gray-600 bg-gray-50 dark:bg-gray-900 p-4 rounded-b-md">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* أسئلة الشراء والدفع */}
            <TabsContent value="purchase" className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                {purchaseFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <CustomAccordionTrigger>
                      {faq.question}
                    </CustomAccordionTrigger>
                    <AccordionContent className="text-gray-600 bg-gray-50 dark:bg-gray-900 p-4 rounded-b-md">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* أسئلة الدعم التقني */}
            <TabsContent value="technical" className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                {technicalFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <CustomAccordionTrigger>
                      {faq.question}
                    </CustomAccordionTrigger>
                    <AccordionContent className="text-gray-600 bg-gray-50 dark:bg-gray-900 p-4 rounded-b-md">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>

          {/* قسم التواصل */}
          <div className="mt-12 bg-brand-cream p-8 rounded-lg text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              {language === "en" ? "Didn’t Find Your Answer?" : "لم تجد إجابة لسؤالك؟"}
            </h2>
            <p className="text-gray-700 mb-6 max-w-xl mx-auto">
              {language === "en"
                ? "Our support team is here to help with all your inquiries. Contact us anytime!"
                : "فريق الدعم لدينا متاح للإجابة على جميع استفساراتك. لا تتردد في التواصل معنا."}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 flex items-center gap-2 transition-all duration-200">
                <Phone className="h-4 w-4" />
                <span>{t("callUs")}</span>
              </Button>
              <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10 flex items-center gap-2 transition-all duration-200" asChild>
                <a href="/contact">
                  <Mail className="h-4 w-4" />
                  <span>{t("sendMessage")}</span>
                </a>
              </Button>
              <Button variant="secondary" className="bg-gray-200 hover:bg-gray-300 flex items-center gap-2 transition-all duration-200" asChild>
                <a href="mailto:support@mobistore.sa">
                  <Mail className="h-4 w-4" />
                  <span>{t("emailSupport")}</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default FAQPage;