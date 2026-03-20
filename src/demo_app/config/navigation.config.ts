import {
  SmartToyRounded,
  EventAvailableRounded,
  ShowChartRounded,
  SettingsRounded,
  DashboardRounded,
  FolderRounded,
  SecurityRounded,
  ViewKanbanRounded,
  PersonRounded,
  PeopleRounded,
  ArticleRounded,
  CorporateFareRounded,
  FactoryRounded,
  ArchiveRounded,
  BarChartRounded,
  TableChartRounded,
  TuneRounded
} from "@mui/icons-material";
import type { NavigationConfig } from "./navigation.types";

export const NAVIGATION_CONFIG: NavigationConfig = [
  // ============================================
  // SUPER ADMIN SECTIONS
  // ============================================
  {
    id: "super-admin-user-management",
    title: "User Management",
    icon: PersonRounded,
    roles: ["Super Admin"],
    items: [
      {
        id: "users",
        title: "Users",
        path: "/super-admin/users",
        icon: PeopleRounded,
        roles: ["Super Admin"],
      },
    ],
  },
  {
    id: "super-admin-industrymanagement",
    title: "Industry Management",
    icon: FactoryRounded,
    roles: ["Super Admin"],
    items: [
      {
        id: "industries",
        title: "Industries",
        path: "/super-admin/industries",
        icon: FactoryRounded,
        roles: ["Super Admin"],
      },
    ],
  },
  {
    id: "super-admin-organizationmanagement",
    title: "Organization Management",
    icon: CorporateFareRounded,
    roles: ["Super Admin"],
    items: [
      {
        id: "organizations",
        title: "Organizations",
        path: "/super-admin/organizations",
        icon: CorporateFareRounded,
        roles: ["Super Admin"],
      },
      // {
      //   id: "divisions",
      //   title: "Teams",
      //   path: "/super-admin/divisions",
      //   icon: CorporateFareRounded,
      //   roles: ["Super Admin"],
      // },
    ],
  },
  {
    id: "super-admin-account-settings",
    title: "Account Settings",
    icon: SettingsRounded,
    roles: ["Super Admin"],
    items: [
      {
        id: "settings",
        title: "Settings",
        path: "/super-admin/settings",
        icon: SecurityRounded,
        roles: ["Super Admin"],
      },
    ],
  },
  // ============================================
  // ADMIN SECTIONS
  // ============================================
  {
    id: "user-management",
    title: "User Management",
    icon: PersonRounded,
    roles: ["Admin"],
    items: [
      {
        id: "users",
        title: "Users",
        path: "/admin/users",
        icon: PeopleRounded,
        roles: ["Admin"],
      },
    ],
  },
  {
    id: "project-management-admin",
    title: "Projects",
    icon: ViewKanbanRounded,
    roles: ["Admin"],
    items: [
      {
        id: "projects",
        title: "Mission Control",
        path: "/admin/projectmanagement",
        icon: SettingsRounded,
        roles: ["Admin"],
      },
      {
        id: "archived-projects",
        title: "Project Management",
        path: "/admin/archived",
        icon: ArchiveRounded,
        roles: ["Admin"],
      },
    ],
  },
  {
    id: "file-management-admin",
    title: "File Management",
    icon: FolderRounded,
    roles: ["Admin"],
    items: [
      {
        id: "archived-projects-list",
        title: "Unarchive or Delete",
        path: "/admin/archived-projects",
        icon: ArchiveRounded,
        roles: ["Admin"],
      },
    ],
  },
  {
    id: "account-settings",
    title: "Account Settings",
    icon: SettingsRounded,
    roles: ["Admin"],
    items: [
      {
        id: "settings",
        title: "Settings",
        path: "/admin/settings",
        icon: SecurityRounded,
        roles: ["Admin"],
      },
    ],
  },

  // ============================================
  // PROJECT MANAGER SECTIONS
  // ============================================
  {
    id: "command-center",
    title: "Command Center",
    icon: DashboardRounded,
    roles: ["Project Manager"],
    items: [
      {
        id: "core",
        title: "Core",
        path: "/pm/core",
        icon: ShowChartRounded,
        roles: ["Project Manager"],
      },
      {
        id: "task-overview",
        title: "Field",
        path: "/pm/field",
        icon: TuneRounded,
        roles: ["Project Manager"],
      },
      {
        id: "task-details",
        title: "Intel",
        path: "/pm/intel",
        icon: TableChartRounded,
        roles: ["Project Manager"],
      },
      {
        id: "gantt",
        title: "Gantt",
        path: "/pm/gantt",
        icon: BarChartRounded,
        roles: ["Project Manager"],
      },
      {
        id: "chat",
        title: "Assistant",
        path: "/pm/chat",
        icon: SmartToyRounded,
        roles: ["Project Manager"],
      },
    ],
  },
  {
    id: "project-management",
    title: "Project Manager",
    icon: ViewKanbanRounded,
    roles: ["Project Manager"],
    items: [
      {
        id: "control-panel",
        title: "Mission Control",
        path: "/pm/control-panel",
        icon: SettingsRounded,
        roles: ["Project Manager"],
      },
      {
        id: "approvals",
        title: "Approvals and Issues",
        path: "/pm/approvals",
        icon: EventAvailableRounded,
        roles: ["Project Manager"],
      },
      {
        id: "reporting-page",
        title: "Reporting",
        path: "/pm/reporting",
        icon: ArticleRounded,
        roles: ["Project Manager"],
      },
    ],
  },
];
