import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AccountPage from "./pages/AccountPage";
import ChangePassword from "./pages/ChangePassword";
import EditProfile from "./pages/EditProfile";
import Index from "./pages/Index";
import BookDetails from "./pages/BookDetails";
import CategoriesPage from "./pages/CategoriesPage";
import BestSellersPage from "./pages/BestSellersPage";
import OffersPage from "./pages/OffersPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import LibraryPage from "./pages/LibraryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Terms from "@/pages/Terms";
import ReadPage from "./pages/ReadPage";
import FAQPage from "./pages/FAQPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminBooksPage from "./pages/AdminBooksPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import { useEffect } from "react";
const queryClient = new QueryClient();

// مكون لضبط التمرير للأعلى عند التنقل بين الصفحات
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// مكون للحماية من الوصول لغير المسؤولين
const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              {/* الصفحات العامة */}
              <Route path="/" element={<Index />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:categoryId" element={<CategoriesPage />} />
              <Route path="/featured" element={<CategoriesPage />} />
              <Route path="/bestsellers" element={<BestSellersPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/read/:bookId" element={<ReadPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              {/* صفحات الإدارة */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="books" element={<AdminBooksPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
              {/* صفحة Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;