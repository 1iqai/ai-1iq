import type { SvgIconComponent } from '@mui/icons-material';

export interface NavigationDrawerProps {
  role: 'Admin' | 'Project Manager' | 'Super Admin' | null;
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export interface NavigationListProps {
  role: 'Admin' | 'Project Manager' | 'Super Admin' | null;
  collapsed: boolean;
  onItemClick?: () => void;
}

export interface NavigationSectionProps {
  section: {
    id: string;
    title: string;
    icon: SvgIconComponent;
    items: Array<{
      id: string;
      title: string;
      path: string;
      icon: SvgIconComponent;
    }>;
  };
  collapsed: boolean;
  onItemClick?: () => void;
}

export interface NavigationItemProps {
  item: {
    id: string;
    title: string;
    path: string;
    icon: SvgIconComponent;
  };
  collapsed: boolean;
  onItemClick?: () => void;
}

export interface DrawerHeaderProps {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  showToggle: boolean;
}
