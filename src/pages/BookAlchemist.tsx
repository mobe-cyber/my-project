import Layout from "@/components/layout/Layout";
import { useTheme } from "@/context/theme-context-types";
import { useTranslation } from "@/translations";
import { Button } from "@/components/ui/button";

const BookAlchemist = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          {language === 'en' ? 'The Alchemist' : 'الخيميائي'}
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          {language === 'en' ? 'Welcome to the world of The Alchemist, a journey through the desert to find your true treasure...' : 'مرحباً بك في عالم الخيميائي، رحلة عبر الصحراء للبحث عن كنزك الحقيقي...'}
        </p>
        <p className="text-md text-muted-foreground mb-4">
          {language === 'en' ? 'Step through the ancient wooden gate adorned with golden symbols, where legends come to life. Begin your quest with the shepherd\'s dream and uncover the secrets of the desert sands...' : 'اخترق البوابة الخشبية القديمة المرصعة بالرموز الذهبية، حيث تتحقق الأساطير. ابدأ رحلتك مع حلم الراعي واكتشف أسرار رمال الصحراء...'}
        </p>
        <p className="text-md text-muted-foreground mb-6">
          {language === 'en' ? 'Embark on an interactive journey: solve the golden safe puzzle, listen to the Alchemist’s wisdom, and explore an art gallery inspired by the sands of destiny!' : 'انطلق في رحلة تفاعلية: حل لغز الخزنة الذهبية، استمع إلى حكمة الخيميائي، واستكشف معرضاً فنياً مستوحى من رمال القدر!'}
        </p>
        <div className="bg-yellow-100 border border-yellow-600 rounded-lg p-4 mb-6">
          <p className="text-xl font-semibold text-yellow-900">
            {language === 'en' ? 'Coming Soon...' : 'قريباً...'}
          </p>
          <p className="text-md text-yellow-800">
            {language === 'en' ? 'This page is not ready yet, but something magical is on the way! Stay tuned for an unforgettable experience.' : 'هذه الصفحة ليست جاهزة بعد، لكن شيئاً ساحراً قادم في الطريق! ترقب تجربة لا تُنسى.'}
          </p>
        </div>
        <Button disabled className="bg-yellow-700 text-white opacity-50 cursor-not-allowed">
          {language === 'en' ? 'Explore the Journey (Coming Soon)' : 'استكشف الرحلة (قريباً)'}
        </Button>
      </div>
    </Layout>
  );
};

export default BookAlchemist;