import { createContext, useContext, useState, type ReactNode } from "react";

interface NavbarFilterContextType {
  filterContent: ReactNode | null;
  setFilterContent: (content: ReactNode | null) => void;
  mobileFilterOpen: boolean;
  setMobileFilterOpen: (open: boolean) => void;
}

const NavbarFilterContext = createContext<NavbarFilterContextType | null>(null);

export const NavbarFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filterContent, setFilterContent] = useState<ReactNode | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <NavbarFilterContext.Provider
      value={{
        filterContent,
        setFilterContent,
        mobileFilterOpen,
        setMobileFilterOpen,
      }}
    >
      {children}
    </NavbarFilterContext.Provider>
  );
};

export const useNavbarFilter = () => {
  const context = useContext(NavbarFilterContext);
  if (!context) {
    throw new Error("useNavbarFilter must be used within a NavbarFilterProvider");
  }
  return context;
};

// Optional hook that doesn't throw - for components that may or may not be inside the provider
export const useNavbarFilterOptional = () => {
  return useContext(NavbarFilterContext);
};
