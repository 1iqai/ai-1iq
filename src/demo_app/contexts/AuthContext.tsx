import { createContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { type AuthContextType } from "../types/AuthContextType";

export const permittedRoles = ["Project Manager", "Admin", "Super Admin"];
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}


const mockUser = {
  id: "admin123",
  email: "admin@1iq.ai",
  firstName: "Demo",
  lastName: "Admin",
  role: "Project Manager",
  companyId: "comp123",
};
localStorage.setItem("user", JSON.stringify(mockUser));
localStorage.setItem("token", "demo-token-local");

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(mockUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const logout = useCallback(async () => {
    setIsLoggedIn(false);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isLoggedIn,
        isLoading,
        setIsLoggedIn,
        setIsLoggingOut: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
