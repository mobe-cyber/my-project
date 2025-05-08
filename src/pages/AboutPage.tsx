import React from 'react';
import { useTheme } from "@/context/ThemeContext";

const AboutPage = () => {
  const { language } = useTheme();

  const content = {
    ar: {
      title: "من نحن",
      description: `نحن في MobeStore نؤمن بأن القراءة هي مفتاح المعرفة والتقدم. تأسس متجرنا ليكون المنصة الأولى للكتب الإلكترونية عالية الجودة.
نسعى لتوفير مكتبة شاملة من الكتب التي تلبي اهتمامات جميع القراء، من الروايات إلى الكتب التعليمية.

فريقنا يتألف من شغوفين بالكتب والتقنية، ونعمل باستمرار على تحسين تجربتكم وتوسيع مجموعتنا.`,
    },
    en: {
      title: "About Us",
      description: `At MobeStore, we believe that reading is the key to knowledge and progress. Our store was founded to be the leading platform for high-quality eBooks.
We aim to offer a comprehensive library of books that cater to all readers' interests—from novels to educational content.

Our team is passionate about books and technology, and we continuously work to improve your experience and expand our collection.`,
    }
  };

  const t = content[language];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
      <p className="whitespace-pre-line">{t.description}</p>
    </div>
  );
};

export default AboutPage;
