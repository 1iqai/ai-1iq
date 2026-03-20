import type { ProjectType } from "../pages/ProjectManager/AnalyticsDashboard.types";

export interface ProjectStatusType {
  initialPercentComplete: number;
  averageInitialCompletion: number;
  actualPercentComplete: number;
  averageActualCompletion: number;
  isEmpty: boolean;
}

export interface OrganizationType {
  id: string;
  name: string;
  description?: string;
}

export interface PMContextType {
  // Filter state
  selectedOrganization: string | null;
  selectedProject: any;
  selectedMilestone: string | null;
  selectedTeam: string | null;
  selectedTask: string | null;
  organizationList: OrganizationType[];
  projectList: ProjectType[];

  // Filter handlers
  selectOrganization: (organizationId: string | null) => void;
  selectProject: (projectId: string) => void;
  selectMilestone: (milestoneId: string | null) => void;
  selectTeam: (teamId: string | null) => void;
  selectTask: (taskId: string | null) => void;

  // Chart data
  milestoneData: any[];
  teamData: any[];
  organizationData: any[];
  budgetData1: any[];
  taskStatusOverview: any[];
  statusByStartDate: any[];
  statusByEndDate: any[];
  taskPriorityOverview: any[];
  issueData: any[];
  overallProjectStatus: ProjectStatusType | null;

  // Raw task data by project ID
  projectTasks: { [key: string]: any[] };

  // Derived options
  availableMilestones: any[];
  availableTeams: any[];
  taskCandidates: any[];

  // Status
  loading: boolean;
  chartLoading: boolean;
  error: string | null;
  taskDetailRefreshKey: number;
  fetchProjects: (preserveSelection?: boolean, showLoading?: boolean, selectProjectId?: string) => Promise<void>;

  // Project creation
  createProject: (data: {
    name: string;
    description: string;
    managerId: string;
    startDate: string;
    endDate: string;
  }) => Promise<{ success: boolean; message: string }>;

  // Task management - for instant UI updates
  addTaskToProject: (projectId: string, task: any) => void;
  updateTaskInProject: (projectId: string, taskId: string, updates: any) => void;
  removeTaskFromProject: (projectId: string, taskId: string) => void;
}
