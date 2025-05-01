
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
        title={t('newArrivals')} 
        limit={6} 
        viewAllLink="/new-arrivals"
      />
      <FeaturedBooks 
        title={t('bestSellers')} 
        limit={6} 
        viewAllLink="/bestsellers"
      />
    </Layout>
  );
};

export default Index;
