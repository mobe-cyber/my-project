import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // متغير جديد للتأكد من اكتمال التحقق
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const token = await getIdTokenResult(currentUser, true);
        if (token.claims?.admin === true && window.location.pathname === "/admin/login") {
          navigate("/admin/dashboard", { replace: true });
        } else if (token.claims?.admin !== true && window.location.pathname.startsWith("/admin/")) {
          await auth.signOut();
          navigate("/admin/login");
        }
      }
      setUser(currentUser);
      setLoading(false);
      setAuthChecked(true); // التحقق اكتمل
    });

    return () => unsubscribe();
  }, [navigate]);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    navigate("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {authChecked ? children : null} {/* لا نرندر الأطفال حتى ينتهي التحقق */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);