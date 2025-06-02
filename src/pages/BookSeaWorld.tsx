import Layout from "@/components/layout/Layout";
import { useTheme } from "@/context/theme-context-types";
import { useTranslation } from "@/translations";
import { Button } from "@/components/ui/button";

const BookSeaWorld = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 bg-blue-900 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">
          {language === 'en' ? 'Sea World' : 'عالم البحار'}
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          {language === 'en' ? 'Dive into the magical underwater world of Sea World...' : 'غُص في العالم السحري تحت الماء لعالم البحار...'}
        </p>
        <p className="text-md text-gray-200 mb-4">
          {language === 'en' ? 'Explore a realm where shimmering corals whisper ancient tales, and mysterious sea creatures guard hidden treasures...' : 'استكشف عالماً حيث تهمس الشعاب المرجانية المتلألئة بحكايات قديمة، وتحرس المخلوقات البحرية الغامضة كنوزاً مخفية...'}
        </p>
        <p className="text-md text-gray-200 mb-6">
          {language === 'en' ? 'Embark on an enchanting adventure: swim through interactive coral mazes, uncover secrets of the deep, and listen to the ocean’s song!' : 'انطلق في مغامرة ساحرة: سبح عبر متاهات مرجانية تفاعلية، اكتشف أسرار الأعماق، واستمع إلى أغنية المحيط!'}
        </p>
        <div className="bg-blue-800 border border-blue-600 rounded-lg p-4 mb-6">
          <p className="text-xl font-semibold text-blue-200">
            {language === 'en' ? 'Coming Soon...' : 'قريباً...'}
          </p>
          <p className="text-md text-blue-300">
            {language === 'en' ? 'This page is not ready yet, but a wondrous underwater journey awaits! Stay tuned for an unforgettable experience.' : 'هذه الصفحة ليست جاهزة بعد، لكن رحلة مذهلة تحت الماء تنتظرك! ترقب تجربة لا تُنسى.'}
          </p>
        </div>
        <Button disabled className="bg-blue-700 text-white opacity-50 cursor-not-allowed">
          {language === 'en' ? 'Dive into the Adventure (Coming Soon)' : 'غُص في المغامرة (قريباً)'}
        </Button>
      </div>
    </Layout>
  );
};

export default BookSeaWorld;