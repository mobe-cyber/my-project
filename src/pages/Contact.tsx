import React, { useState } from "react";
import Navbar from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Mail, Send, MessageSquare, Instagram, Facebook, BookOpen, Download, Shield, Clock } from "lucide-react";

const Contact = () => {
  const { language } = useTheme();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    ar: {
      title: "اتصل بنا",
      description: "نحن هنا للإجابة على أي استفسار لديك. تواصل معنا وسنكون سعداء بمساعدتك في أي وقت.",
      contactInfo: "معلومات الاتصال",
      emailLabel: "البريد الإلكتروني",
      email: "mobe.store0@gmail.com",
      socialMedia: "تابعنا على",
      instagram: "storemobe",
      facebook: "mobe.store.official",
      sendMessage: "أرسل لنا رسالة",
      nameLabel: "الاسم",
      namePlaceholder: "أدخل اسمك",
      emailLabelForm: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      subjectLabel: "الموضوع",
      subjectPlaceholder: "موضوع الرسالة",
      messageLabel: "الرسالة",
      messagePlaceholder: "اكتب رسالتك هنا...",
      sendButton: "إرسال الرسالة",
      sending: "جاري الإرسال...",
      whyChooseUs: "لماذا تختار MOBE-STORE؟",
      wideSelectionTitle: "تشكيلة واسعة من الكتب",
      wideSelectionDesc: "لدينا مجموعة كبيرة من الكتب في جميع المجالات لتلبية اهتماماتك.",
      instantDownloadTitle: "تحميل فوري",
      instantDownloadDesc: "احصل على كتبك الرقمية فوراً بعد الشراء بضغطة زر.",
      securePaymentTitle: "دفع آمن",
      securePaymentDesc: "طرق دفع آمنة وموثوقة لحماية معلوماتك الشخصية.",
      customerSupportTitle: "دعم عملاء 24/7",
      customerSupportDesc: "فريقنا جاهز لمساعدتك في أي وقت على مدار الساعة.",
      invalidEmail: "خطأ في البريد الإلكتروني",
      invalidEmailDesc: "يرجى إدخال بريد إلكتروني صالح",
      emptyMessage: "الرسالة فارغة",
      emptyMessageDesc: "يرجى كتابة رسالة قبل الإرسال",
      messageSent: "تم إرسال الرسالة",
      messageSentDesc: "سنقوم بالرد عليك في أقرب وقت ممكن",
    },
    en: {
      title: "Contact Us",
      description: "We are here to answer any questions you may have. Reach out to us and we'll be happy to assist you anytime.",
      contactInfo: "Contact Information",
      emailLabel: "Email",
      email: "mobe.store0@gmail.com",
      socialMedia: "Follow Us",
      instagram: "storemobe",
      facebook: "mobe.store.official",
      sendMessage: "Send Us a Message",
      nameLabel: "Name",
      namePlaceholder: "Enter your name",
      emailLabelForm: "Email",
      emailPlaceholder: "Enter your email",
      subjectLabel: "Subject",
      subjectPlaceholder: "Message subject",
      messageLabel: "Message",
      messagePlaceholder: "Write your message here...",
      sendButton: "Send Message",
      sending: "Sending...",
      whyChooseUs: "Why Choose MOBE-STORE?",
      wideSelectionTitle: "Wide Selection of Books",
      wideSelectionDesc: "We offer a vast collection of books across all genres to suit your interests.",
      instantDownloadTitle: "Instant Download",
      instantDownloadDesc: "Get your digital books immediately after purchase with a single click.",
      securePaymentTitle: "Secure Payment",
      securePaymentDesc: "Safe and reliable payment methods to protect your personal information.",
      customerSupportTitle: "24/7 Customer Support",
      customerSupportDesc: "Our team is ready to assist you anytime, around the clock.",
      invalidEmail: "Invalid Email",
      invalidEmailDesc: "Please enter a valid email address",
      emptyMessage: "Message is Empty",
      emptyMessageDesc: "Please write a message before sending",
      messageSent: "Message Sent",
      messageSentDesc: "We will get back to you as soon as possible",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!email.includes("@") || !email.includes(".")) {
      toast({
        title: content[language].invalidEmail,
        description: content[language].invalidEmailDesc,
        variant: "destructive",
      });
      return;
    }

    // Validate message
    if (!message.trim()) {
      toast({
        title: content[language].emptyMessage,
        description: content[language].emptyMessageDesc,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://your-region-your-project.cloudfunctions.net/sendContactEmail",
        { name, email, subject, message },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: content[language].messageSent,
          description: content[language].messageSentDesc,
        });

        // Reset form
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Error sending email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-10 flex-grow">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{content[language].title}</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{content[language].description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <div className="bg-blue-600 dark:bg-gray-700 p-6 rounded-lg h-full">
              <h2 className="text-xl font-bold mb-6 text-gray-100 dark:text-gray-100">{content[language].contactInfo}</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 ml-3 mt-1 text-gray-100 dark:text-gray-100" />
                  <div>
                    <p className="font-bold text-gray-100 dark:text-gray-100">{content[language].emailLabel}</p>
                    <a href={`mailto:${content[language].email}`} className="text-gray-100 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-300">
                      {content[language].email}
                    </a>
                  </div>
                </div>
              </div>

              <hr className="border-gray-300 dark:border-gray-300 my-8" />

              <div className="text-center">
                <h3 className="font-bold mb-2 text-gray-100 dark:text-gray-100">{content[language].socialMedia}</h3>
                <div className="flex justify-center gap-4">
                  <a href={`https://instagram.com/${content[language].instagram}`} target="_blank" rel="noopener noreferrer" className="text-gray-100 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-300">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href={`https://facebook.com/${content[language].facebook}`} target="_blank" rel="noopener noreferrer" className="text-gray-100 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-300">
                    <Facebook className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-gray-100">
                <MessageSquare className="h-6 w-6 ml-2" />
                {content[language].sendMessage}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {content[language].nameLabel}
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={content[language].namePlaceholder}
                      required
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {content[language].emailLabelForm}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={content[language].emailPlaceholder}
                      required
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {content[language].subjectLabel}
                  </label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={content[language].subjectPlaceholder}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {content[language].messageLabel}
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={content[language].messagePlaceholder}
                    rows={6}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 w-full text-gray-100 dark:text-gray-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>{content[language].sending}</span>
                  ) : (
                    <>
                      <Send className="ml-2 h-4 w-4" />
                      {content[language].sendButton}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Why Choose MOBE-STORE Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">{content[language].whyChooseUs}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{content[language].wideSelectionTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300">{content[language].wideSelectionDesc}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
              <Download className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{content[language].instantDownloadTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300">{content[language].instantDownloadDesc}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{content[language].securePaymentTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300">{content[language].securePaymentDesc}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{content[language].customerSupportTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300">{content[language].customerSupportDesc}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;