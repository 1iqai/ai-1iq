import type { SvgIconComponent } from '@mui/icons-material';

/**
 * Represents a single navigation item (leaf node in the menu)
 */
export interface NavigationSubItem {
  id: string;
  title: string;
  path: string; // React Router path (e.g., "/admin/users")
  icon: SvgIconComponent;
  roles: ('Admin' | 'Project Manager' | 'Super Admin')[];
}

/**
 * Represents a navigation section (group of items with a header)
 */
export interface NavigationSection {
  id: string;
  title: string;
  icon: SvgIconComponent;
  roles: ('Admin' | 'Project Manager'| 'Super Admin')[];
  items: NavigationSubItem[];
}

/**
 * Complete navigation configuration type
 */
export type NavigationConfig = NavigationSection[];
