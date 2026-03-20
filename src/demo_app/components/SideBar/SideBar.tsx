import React, { useState, useEffect } from "react";
import { Settings, ChevronDown, ChevronRight, PanelLeftClose, PanelLeft, } from "lucide-react";
import MENU from "../Menu";
import { Button } from "../UI/Button";
import { cn } from "../../utility/uiUtility";
import Logo from "../Logo/Logo";

interface SidebarProps {
  setActiveComponent: (comp: string) => void;
  onStateChange?: (isCollapsed: boolean, isHovering: boolean) => void;
  NavbarItems?: React.ReactNode;
}

const Sidebar = ({ setActiveComponent, onStateChange }: SidebarProps) => {
  const [userRole, setRole] = useState<"Admin" | "Super Admin" | null>(null);
  const [activeItem, setActiveItem] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let user: { role?: string } | null = null;
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
    if (user?.role) setRole(user.role as "Admin" | "Super Admin");
    else setRole("Admin")
  }, []);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(isCollapsed, isHovering);
    }
  }, [isCollapsed, isHovering, onStateChange]);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setExpandedSections({});
  };

  const shouldShowFull = !isCollapsed;
  const sections = (userRole === "Admin" || userRole === "Super Admin") ? MENU[userRole] : [];

  const MenuBlock = () => (
    <aside className={cn(
      "flex h-full flex-col border-r transition-all duration-300",
      "bg-bg-secondary-light dark:bg-bg-primary-dark",
      "border-gray-200/30 dark:border-gray-700/30",
      shouldShowFull ? "w-64" : "w-20"
    )}>

      <div className=" flex items-center border-b border-gray-200/20 dark:border-gray-700/20 bg-opa px-3">
        <div
          className={`h-16 flex items-center ${shouldShowFull ? 'justify-start' : 'justify-center '} `}
        >
          <Logo className="" />
        </div>
      </div>
      <aside
        className={cn(
          "flex h-full flex-col backdrop-blur-md border-r transition-all duration-300",
          "bg-bg-secondary-light dark:bg-bg-secondary-dark",
          "border-gray-200/30 dark:border-gray-700/30",
          shouldShowFull ? "w-64" : "w-20"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Header */}


        <div className="px-3 py-2 border-b border-gray-200/10 dark:border-gray-700/10">
          <Button
            onClick={toggleCollapse}
            variant="ghost"
            size="sm"
            className={cn(
              "transition-all duration-300 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark",
              shouldShowFull ? "w-full justify-start gap-2" : "w-10 h-10 p-0 justify-center"
            )}
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
            {shouldShowFull && (
              <span className="text-xs font-medium">{isCollapsed ? "Expand" : "Collapse"}</span>
            )}
          </Button>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {sections.map(({ title, icon: SectionIcon, links }, i: number) => (
            <div key={i} className="space-y-1">
              {/* Section Header - Clickable */}
              {shouldShowFull ? (
                <Button
                  onClick={() => toggleSection(title)}
                  variant="ghost"
                  className={cn(
                    "w-full justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-300",
                    "bg-bg-primary-light dark:bg-bg-primary-dark",
                    "hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark",
                    "text-txt-primary-light dark:text-txt-primary-dark",
                    "border border-gray-200/20 dark:border-gray-700/20"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-brand-primary-50 dark:bg-brand-primary-900/20 flex items-center justify-center">
                      <SectionIcon className="w-3.5 h-3.5 text-brand-primary-600 dark:text-brand-primary-400" />
                    </div>
                    <span className="font-medium tracking-wide uppercase">{title}</span>
                  </div>
                  {expandedSections[title] ? (
                    <ChevronDown className="h-3.5 w-3.5 text-txt-secondary-light dark:text-txt-secondary-dark" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-txt-secondary-light dark:text-txt-secondary-dark" />
                  )}
                </Button>
              ) : (
                // Collapsed state - show only icon
                <div className="flex justify-center mb-3">
                  <div
                    className="w-10 h-10 rounded-lg bg-bg-primary-light dark:bg-bg-primary-dark flex items-center justify-center border border-gray-200/20 dark:border-gray-700/20 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition-all duration-300"
                    title={title}
                  >
                    <SectionIcon className="w-5 h-5 text-brand-primary-600 dark:text-brand-primary-400" />
                  </div>
                </div>
              )}

              {/* Collapsible Links */}
              {shouldShowFull && expandedSections[title] && (
                <div className="ml-3 space-y-1 border-l border-gray-300/30 dark:border-gray-600/30 pl-3 py-1">
                  {links.map(({ txt, icon: Icon, comp }) => (
                    <Button
                      key={txt}
                      onClick={() => {
                        setActiveComponent(comp);
                        setActiveItem(txt);
                      }}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-300",
                        activeItem === txt
                          ? "bg-brand-primary-600 text-white shadow-lg font-medium"
                          : "text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium tracking-wide">{txt}</span>
                    </Button>
                  ))}
                </div>
              )}

              {/* Show collapsed menu items as icons only */}
              {!shouldShowFull && (
                <div className="space-y-2">
                  {links.map(({ txt, icon: Icon, comp }) => (
                    <div key={txt} className="flex justify-center">
                      <Button
                        onClick={() => {
                          setActiveComponent(comp);
                          setActiveItem(txt);
                        }}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-10 h-10 p-0 rounded-lg transition-all duration-300",
                          activeItem === txt
                            ? "bg-brand-primary-600 text-white shadow-lg"
                            : "text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                        )}
                        title={txt}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Separator */}
              {shouldShowFull && i !== sections.length - 1 && (
                <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-300/20 dark:via-gray-600/20 to-transparent" />
              )}
            </div>
          ))}

          {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center mb-3">
                <Settings className="w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
              </div>
              {shouldShowFull && (
                <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark font-medium">Loading menu...</p>
              )}
            </div>
          )}
        </nav>
      </aside>
    </aside>
  );

  return (
    <>
      <div
        className={cn(
          "hidden lg:block fixed top-0 left-0 h-full z-40 transition-all duration-300",
          shouldShowFull ? "w-64" : "w-16"
        )}
      >
        <MenuBlock />
      </div>
    </>
  );
};

export default Sidebar;