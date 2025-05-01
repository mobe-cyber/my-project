
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Menu,
  Search,
  ShoppingCart, 
  Sun, 
  Moon, 
  User,
  BookOpen,
  Globe
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { theme, toggleTheme, language, changeLanguage } = useTheme();
  const { t } = useTranslation(language);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated] = useState(false); // This will be replaced with actual auth state
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40 w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-6 w-6 text-primary rtl-mirror" />
              <span className="font-bold text-xl ms-2">MobeStore</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex ms-10">
              <ul className="flex space-s-8">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    {t('home')}
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-primary transition-colors">
                    {t('categories')}
                  </Link>
                </li>
                <li>
                  <Link to="/bestsellers" className="hover:text-primary transition-colors">
                    {t('bestsellers')}
                  </Link>
                </li>
                <li>
                  <Link to="/offers" className="hover:text-primary transition-colors">
                    {t('offers')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Search, Theme, Cart, User */}
          <div className="flex items-center space-s-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <Input 
                placeholder={t('search')} 
                className="w-64 pe-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute top-0 end-0 h-full px-3 flex items-center justify-center bg-transparent border-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            </form>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} title={theme === 'dark' ? t('lightMode') : t('darkMode')}>
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Language Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
              title={t('changeLanguage')}
            >
              <Globe className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="w-full">
                        {t('myAccount')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/library" className="w-full">
                        {t('myLibrary')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {t('logout')}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="w-full">
                        {t('login')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="w-full">
                        {t('register')}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300", 
          isMobileMenuOpen ? "max-h-96" : "max-h-0"
        )}>
          <div className="pb-4 flex flex-col space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Input 
                placeholder={t('search')} 
                className="w-full pe-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute top-0 end-0 h-full px-3 flex items-center justify-center bg-transparent border-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            </form>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="block py-2 hover:text-primary transition-colors">
                    {t('home')}
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="block py-2 hover:text-primary transition-colors">
                    {t('categories')}
                  </Link>
                </li>
                <li>
                  <Link to="/bestsellers" className="block py-2 hover:text-primary transition-colors">
                    {t('bestsellers')}
                  </Link>
                </li>
                <li>
                  <Link to="/offers" className="block py-2 hover:text-primary transition-colors">
                    {t('offers')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
