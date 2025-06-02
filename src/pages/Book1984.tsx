import Layout from "@/components/layout/Layout";
import { useTheme } from "@/context/theme-context-types";
import { useTranslation } from "@/translations";
import { Button } from "@/components/ui/button";

const Book1984 = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 bg-gray-900 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">1984</h1>
        <p className="text-lg text-gray-300 mb-4">
          {language === 'en' ? 'Enter the dystopian world of 1984, where surveillance reigns supreme...' : 'ادخل عالم 1984 الديستوبي، حيث تسود المراقبة...'}
        </p>
        <p className="text-md text-gray-400 mb-4">
          {language === 'en' ? 'Step into a chilling reality of Big Brother’s watchful eyes, where truth is rewritten and freedom is a distant memory...' : 'ادخل إلى واقع مخيف تحت عيون الأخ الكبير، حيث تُعاد كتابة الحقيقة وتتحول الحرية إلى ذكرى بعيدة...'}
        </p>
        <p className="text-md text-gray-400 mb-6">
          {language === 'en' ? 'Embark on a thrilling experience: decode hidden messages, evade surveillance, and uncover the rebellion’s secrets!' : 'انطلق في تجربة مثيرة: افك شيفرات الرسائل الخفية، تجنب المراقبة، واكتشف أسرار التمرد!'}
        </p>
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
          <p className="text-xl font-semibold text-gray-200">
            {language === 'en' ? 'Coming Soon...' : 'قريباً...'}
          </p>
          <p className="text-md text-gray-300">
            {language === 'en' ? 'This page is not ready yet, but a gripping dystopian adventure awaits! Stay tuned for an unforgettable experience.' : 'هذه الصفحة ليست جاهزة بعد، لكن مغامرة ديستوبية مشوقة تنتظرك! ترقب تجربة لا تُنسى.'}
          </p>
        </div>
        <Button disabled className="bg-gray-700 text-white opacity-50 cursor-not-allowed">
          {language === 'en' ? 'Join the Rebellion (Coming Soon)' : 'انضم للتمرد (قريباً)'}
        </Button>
      </div>
    </Layout>
  );
};

export default Book1984;