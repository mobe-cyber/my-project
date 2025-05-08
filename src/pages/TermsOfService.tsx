import React from 'react';
import { useTheme } from "@/context/ThemeContext";

const TermsOfService = () => {
  const { language } = useTheme();

  const content = {
    ar: {
      title: "شروط الخدمة",
      description: "باستخدام هذا الموقع، فإنك توافق على الالتزام بجميع القوانين والشروط الموضحة هنا."
    },
    en: {
      title: "Terms of Service",
      description: "By using this website, you agree to comply with all the laws and terms outlined here."
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">{content[language].title}</h1>
      <p>{content[language].description}</p>
    </div>
  );
};

export default TermsOfService;
