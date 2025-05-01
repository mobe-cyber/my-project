
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useTheme } from "@/context/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { language } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {language === 'en' ? "Oops! Page not found" : "عذراً! الصفحة غير موجودة"}
        </p>
        <Button asChild>
          <Link to="/">
            {language === 'en' ? "Return to Home" : "العودة للرئيسية"}
          </Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
