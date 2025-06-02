import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";

const Hero = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);

  return (
    <div className="relative bg-gradient-to-br from-primary/10 via-background to-background py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl z-10 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            {t('welcomeHeading')}
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            {t('welcomeSubheading')}
          </p>
          <Button size="lg" asChild>
            <Link to="/categories">{t('exploreButton')}</Link>
          </Button>
        </div>
      </div>

      {/* صورة احترافية بتأثيرات خرافية */}
      <div className="hidden md:block absolute top-1/2 end-8 transform -translate-y-1/2">
        <div className="relative group [perspective:1500px]">
          <div className="relative transform transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[4deg] group-hover:scale-[1.08]">
            
            {/* الصورة نفسها */}
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/mobestore-e1db5.firebasestorage.app/o/siteimg%2Fmobestoreimg.png?alt=media&token=47b714f3-975b-41ec-8491-a3c91236ea21" 
              alt="MobeStore" 
              className="w-[350px] h-auto rounded-3xl shadow-[0_0_60px_rgba(59,130,246,0.4)] border border-primary/30 backdrop-blur-2xl bg-white/10 transition-all duration-1000 group-hover:shadow-[0_0_80px_rgba(59,130,246,0.6)] group-hover:border-primary/80"
            />

            {/* هالة نيون ديناميكية */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent shadow-[0_0_25px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] transition-all duration-1000 pointer-events-none"></div>

            {/* طبقة خلفية ناعمة بالتمويه */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-primary/40 opacity-70 blur-xl group-hover:opacity-90 group-hover:blur-3xl transition-all duration-1000 pointer-events-none"></div>

            {/* وميض لطيف */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-primary/15 to-transparent opacity-0 group-hover:opacity-80 animate-pulse transition-opacity duration-1000 pointer-events-none"></div>

            {/* انعكاس تحت الصورة */}
            <div className="absolute -bottom-10 -right-10 w-[350px] h-auto bg-gradient-to-br from-primary/10 to-transparent rounded-3xl opacity-50 blur-2xl transform translate-y-8 group-hover:opacity-70 group-hover:blur-xl transition-all duration-1000 pointer-events-none"></div>

            {/* دوائر ضوء متحركة - سحر إضافي */}
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-spin-slow pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-ping pointer-events-none"></div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
