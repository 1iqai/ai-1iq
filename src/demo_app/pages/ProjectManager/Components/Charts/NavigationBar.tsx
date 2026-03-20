import React from "react";

type NavigationBarProps = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
};

const NavigationBar: React.FC<NavigationBarProps> = () => {
  //const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  //const shouldShowFull = !isCollapsed;

  // const toggleSection = (header: string) => {
  //   setExpandedSections((prev) => ({
  //     ...prev,
  //     [header]: !prev[header],
  //   }));
  // };

  // const toggleCollapse = () => {
  //   setIsCollapsed(!isCollapsed);
  //   // setIsHovering(false);
  // };

  return (
    <>
     
    </>
  );
};

export default NavigationBar;
