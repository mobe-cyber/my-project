import Layout from "@/components/layout/Layout";
import { useTheme } from "@/context/theme-context-types";
import { useTranslation } from "@/translations";
import { Button } from "@/components/ui/button";

const BookDaVinci = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 bg-purple-900 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">
          {language === 'en' ? 'The Da Vinci Code' : 'شيفرة دافنشي'}
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          {language === 'en' ? 'Unravel the mysteries of The Da Vinci Code in the heart of the Vatican...' : 'اكتشف أسرار شيفرة دافنشي في قلب الفاتيكان...'}
        </p>
        <p className="text-md text-gray-200 mb-4">
          {language === 'en' ? 'Delve into a world of hidden symbols, cryptic clues, and ancient secrets guarded by the Knights Templar...' : 'غوص في عالم من الرموز الخفية، التلميحات المشفرة، والأسرار القديمة التي يحرسها فرسان الهيكل...'}
        </p>
        <p className="text-md text-gray-200 mb-6">
          {language === 'en' ? 'Embark on an interactive adventure: decode secret messages, explore the art of the Renaissance, and uncover the truth behind the code!' : 'انطلق في مغامرة تفاعلية: قم بفك شيفرات الرسائل السرية، استكشف فن عصر النهضة، واكتشف الحقيقة خلف الشيفرة!'}
        </p>
        <div className="bg-purple-800 border border-purple-600 rounded-lg p-4 mb-6">
          <p className="text-xl font-semibold text-purple-200">
            {language === 'en' ? 'Coming Soon...' : 'قريباً...'}
          </p>
          <p className="text-md text-purple-300">
            {language === 'en' ? 'This page is not ready yet, but a thrilling mystery awaits! Stay tuned for an unforgettable experience.' : 'هذه الصفحة ليست جاهزة بعد، لكن لغز مثير ينتظرك! ترقب تجربة لا تُنسى.'}
          </p>
        </div>
        <Button disabled className="bg-purple-700 text-white opacity-50 cursor-not-allowed">
          {language === 'en' ? 'Unveil the Code (Coming Soon)' : 'اكشف الشيفرة (قريباً)'}
        </Button>
      </div>
    </Layout>
  );
};

export default BookDaVinci;