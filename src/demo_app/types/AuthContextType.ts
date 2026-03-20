export interface AuthContextType {
  user: any;
  setUser: (user:any) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setIsLoggingOut: (isLoggingOut: boolean) => void;
}