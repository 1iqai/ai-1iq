import {
  Users,
  Settings,
  Shield,
  UserIcon,
  Database,
  Building2,
  ClipboardList,
} from "lucide-react";


interface LinkItem {
  txt: string;
  icon: React.ElementType;
  comp: string;
}

interface MenuSection {
  title: string;
  icon: React.ElementType;
  links: LinkItem[];
}

interface MenuStructure {
  Admin: MenuSection[];
  "Super Admin": MenuSection[];
}

const MENU: MenuStructure  = {
  "Admin": [
    {
      title: "User Management",
      icon: UserIcon,
      links: [
        { txt: "Users", icon: Users, comp: "usermanagement" }
      ]
    },
    {
      title: "Project Management",
      icon: ClipboardList,
      links: [{ txt: "Projects", icon: ClipboardList, comp: "projectmanagement" }],
    },
    {
      title: "Account Settings",
      icon: Settings,
      links: [{ txt: "Settings", icon: Shield, comp: "settings" }],
    }
  ],
  "Super Admin": [
    {
      title: "User Management",
      icon: UserIcon,
      links: [
        { txt: "Users", icon: Users, comp: "usermanagement" }
      ]
    },
    {
      title: "Industry Management",
      icon: Database,
      links: [{ txt: "Industries", icon: Building2, comp: "industrymanagement" }],
    },
    {
      title: "Organization Management",
      icon: Building2,
      links: [
        { txt: "Organizations", icon: Building2, comp: "organizationmanagement" },
        { txt: "Teams", icon: Building2, comp: "divisions" },
      ],
    },
    {
      title: "Account Settings",
      icon: Settings,
      links: [{ txt: "Settings", icon: Shield, comp: "settings" }],
    }
  ],
};

export default MENU;