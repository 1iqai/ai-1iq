export type BreadcrumbItem = {
  label: string;
  path?: string;
  onClick?: () => void;
};

export type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
};
