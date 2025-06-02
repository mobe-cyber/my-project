import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import Categories from "@/components/home/Categories";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";

const Index = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);

  return (
    <Layout>
      <Hero />
      <FeaturedBooks 
        title={t('featuredBooks')} 
        limit={6} 
        viewAllLink="/featured"
      />
      <Categories />
      <FeaturedBooks 
        title={language === 'en' ? 'Fiction Books' : 'كتب الخيال'} 
        limit={6} 
        viewAllLink="/categories/1"
        categoryId={1}
      />
      <FeaturedBooks 
        title={language === 'en' ? 'Programming and Cybersecurity' : 'البرمجة والأمن السيبراني'} 
        limit={6} 
        viewAllLink="/categories/2"
        categoryId={2}
      />
    </Layout>
  );
};

export default Index;