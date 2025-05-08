import React from 'react';
import { useTheme } from "@/context/ThemeContext";

const Contact = () => {
  const { language } = useTheme();

  const content = {
    ar: {
      title: "اتصل بنا",
      description: "إذا كان لديك أي استفسارات أو ملاحظات، لا تتردد في التواصل معنا عبر البريد الإلكتروني:",
      email: "mobe.store0@gmail.com"
    },
    en: {
      title: "Contact Us",
      description: "If you have any inquiries or feedback, feel free to contact us at:",
      email: "mobe.store0@gmail.com"
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">{content[language].title}</h1>
      <p>{content[language].description} <span className="text-blue-500">{content[language].email}</span></p>
    </div>
  );
};

export default Contact;
