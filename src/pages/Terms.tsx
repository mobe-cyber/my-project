import React from "react";
import { useTheme } from "@/context/ThemeContext";

const Terms = () => {
  const { language } = useTheme();

  const content = {
    ar: {
      title: "شروط الخدمة",
      sections: [
        {
          heading: "١. القبول",
          text: "باستخدامك هذا الموقع، فإنك توافق على الالتزام بهذه الشروط."
        },
        {
          heading: "٢. الاستخدام المسموح",
          text: "يُسمح باستخدام الموقع لأغراض شخصية وغير تجارية فقط."
        },
        {
          heading: "٣. الملكية الفكرية",
          text: "جميع المحتويات المعروضة هي ملك لـ MobeStore ولا يجوز نسخها أو إعادة استخدامها بدون إذن."
        },
        {
          heading: "٤. التغييرات",
          text: "نحتفظ بالحق في تعديل شروط الخدمة في أي وقت دون إشعار مسبق."
        }
      ]
    },
    en: {
      title: "Terms of Service",
      sections: [
        {
          heading: "1. Acceptance",
          text: "By using this site, you agree to be bound by these terms."
        },
        {
          heading: "2. Permitted Use",
          text: "This site may only be used for personal, non-commercial purposes."
        },
        {
          heading: "3. Intellectual Property",
          text: "All content is owned by MobeStore and may not be copied or reused without permission."
        },
        {
          heading: "4. Changes",
          text: "We reserve the right to modify these terms at any time without prior notice."
        }
      ]
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{content[language].title}</h1>
      {content[language].sections.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
          <p className="text-muted-foreground">{section.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Terms;
