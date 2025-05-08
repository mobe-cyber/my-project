import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext"; 
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
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { theme, toggleTheme, language, changeLanguage } = useTheme();
  const { t } = useTranslation(language);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const mockBooksEn = [
      "The Power of Habit",
      "The Alchemist",
      "The Art of Programming",
    ];
    const mockBooksAr = [
      "قوة العادة",
      "الخيميائي",
      "فن البرمجة",
    ];
    const books = language === "en" ? mockBooksEn : mockBooksAr;
    const filtered = books.filter((title) =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (searchTerm.trim() && filtered.length > 0) {
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, language]);

  const handleLogout = async () => {
    try {
      console.log("Attempting to sign out...");
      await signOut(auth);
      console.log("Sign out successful.");
      toast({
        title: language === "en" ? "Logged out" : "تم تسجيل الخروج",
        description: language === "en" ? "You have been logged out successfully." : "تم تسجيل خروجك بنجاح.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to log out. Please try again." : "فشل في تسجيل الخروج. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40 w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-6 w-6 text-primary rtl-mirror" />
              <span className="font-bold text-xl ms-2">MobeStore</span>
            </Link>
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

          <div className="flex items-center space-s-4">
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <Input 
                placeholder={t('search')} 
                className="w-64 pe-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              />
              <button type="submit" className="absolute top-0 end-0 h-full px-3 flex items-center justify-center bg-transparent border-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 bg-white dark:bg-zinc-900 text-black dark:text-white border border-border w-full mt-1 rounded-md shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onMouseDown={() => {
                        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                        setSearchTerm("");
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </form>

            <Button variant="ghost" size="icon" onClick={toggleTheme} title={theme === 'dark' ? t('lightMode') : t('darkMode')}>
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
              title={t('changeLanguage')}
            >
              <Globe className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>

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
                    <DropdownMenuItem onClick={handleLogout}>
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

            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

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
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              />
              <button type="submit" className="absolute top-0 end-0 h-full px-3 flex items-center justify-center bg-transparent border-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 bg-white dark:bg-zinc-900 text-black dark:text-white border border-border w-full mt-1 rounded-md shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onMouseDown={() => {
                        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                        setSearchTerm("");
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
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