
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";

const Hero = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);

  return (
    <div className="relative bg-gradient-to-r from-primary/10 to-background py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('welcomeHeading')}
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            {t('welcomeSubheading')}
          </p>
          <Button size="lg" asChild>
            <Link to="/categories">
              {t('exploreButton')}
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="hidden md:block absolute top-1/2 end-8 transform -translate-y-1/2">
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(book => (
            <div 
              key={book} 
              className="w-32 h-48 rounded shadow-md transform rotate-3 bg-card border border-border"
              style={{
                transform: `rotate(${Math.random() * 24 - 12}deg)`,
              }}
            >
              {/* This would be book covers */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
