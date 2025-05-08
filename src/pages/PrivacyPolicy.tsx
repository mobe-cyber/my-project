import React from 'react';
import { useTheme } from "@/context/ThemeContext";

const PrivacyPolicy = () => {
  const { language } = useTheme();

  const content = {
    ar: {
      title: "سياسة الخصوصية",
      description: "نحن نحترم خصوصيتك ونلتزم بحماية بياناتك. لن نقوم بمشاركة معلوماتك مع أي جهة خارجية دون إذنك."
    },
    en: {
      title: "Privacy Policy",
      description: "We respect your privacy and are committed to protecting your data. We will not share your information with any third party without your consent."
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">{content[language].title}</h1>
      <p>{content[language].description}</p>
    </div>
  );
};

export default PrivacyPolicy;
