import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, ChevronDown, ChevronRight, X } from "lucide-react";
import { cn } from "../../utility/uiUtility";
import Logo from "../Logo/Logo";
import MENU from "../Menu";

interface MobileSidebarProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
  onClose: () => void;
}

const MobileSidebar = ({
  setActiveComponent,

  onClose,
}: MobileSidebarProps) => {
  const [userRole, setUserRole] = useState<'Admin' | 'Super Admin' | null>(null);
  const [activeItem, setActiveItem] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let user: { role?: string } | null = null;
    if (storedUser) {
      user = JSON.parse(storedUser);
    }

    if (user?.role) setUserRole(user.role as 'Admin' | 'Super Admin');
    else setUserRole('Admin')
  }, []);

  useEffect(() => {
    if (userRole) {
      const sections = MENU[userRole] || [];
      const initialExpanded: { [key: string]: boolean } = {};
      sections.forEach((section) => {
        initialExpanded[section.title] = true;
      });
      setExpandedSections(initialExpanded);
    }
  }, [userRole]);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const handleItemClick = (comp: string, txt: string) => {
    setActiveComponent(comp);
    setActiveItem(txt);
    onClose();
  };


  const sections = (userRole === "Admin" || userRole === "Super Admin") ? MENU[userRole] : [];

  return (
    <div className="flex flex-col h-full bg-bg-secondary-light dark:bg-bg-secondary-dark backdrop-blur-md border-r border-gray-200/30 dark:border-gray-700/30">
      {/* Header */}
      <div className="h-16 flex items-center  border-b border-gray-200/20 dark:border-gray-700/20 bg-bg-primary-light dark:bg-bg-primary-dark px-3">
        <div className="flex items-center gap-2.5">
          <div>
            <Logo className="" />
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors ml-auto"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-txt-primary-light dark:text-txt-primary-dark" />
        </button>
      </div>
      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
        {sections.map(({ title, icon: SectionIcon, links }, i: number) => (
          <div key={i} className="space-y-1">
            {/* Section Header - Clickable */}
            <button
              onClick={() => toggleSection(title)}
              className={cn(
                "w-full justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-300 flex items-center",
                "bg-bg-primary-light dark:bg-bg-primary-dark",
                "hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark",
                "text-txt-primary-light dark:text-txt-primary-dark",
                "border border-gray-200/20 dark:border-gray-700/20",
                
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-6 h-6 rounded-md bg-brand-primary-50 dark:bg-brand-primary-900/20 flex items-center justify-center",
                  
                )}>
                  <SectionIcon className={cn(
                    "w-3.5 h-3.5 text-brand-primary-600 dark:text-brand-primary-400",
                    
                  )} />
                </div>
                <span className="font-medium tracking-wide uppercase">{title}</span>
              </div>
              {expandedSections[title] ? (
                <ChevronDown className="h-3.5 w-3.5 text-txt-secondary-light dark:text-txt-secondary-dark" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-txt-secondary-light dark:text-txt-secondary-dark" />
              )}
            </button>

            {/* Collapsible Links */}
            {expandedSections[title] && (
              <motion.div
                className="ml-3 space-y-1 border-l border-gray-300/30 dark:border-gray-600/30 pl-3 py-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {links.map(({ txt, icon: Icon, comp }, linkIndex: number) => (
                  <motion.button
                    key={txt}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: linkIndex * 0.05 }}
                    onClick={() => handleItemClick(comp, txt)}
                    className={cn(
                      "w-full justify-start gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-300 flex items-center",
                      activeItem === txt
                        ? "bg-brand-primary-600 text-white shadow-lg font-medium"
                        : "text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium tracking-wide">{txt}</span>
                  
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Separator */}
            {i !== sections.length - 1 && (
              <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-300/20 dark:via-gray-600/20 to-transparent" />
            )}
          </div>
        ))}

        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center mb-3">
              <Settings className="w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
            </div>
            <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark font-medium">Loading menu...</p>
          </div>
        )}
      </nav>
    </div>
  );
};

export default MobileSidebar;