
export type TaskPriority = "Critical" | "High" | "Medium" | "Low";

export interface Task {
  id: string;
  milestoneId: string
  name: string;
  description: string;
  project: string;
  assignee: string;
  status: "In Progress" | "Marked Complete" | "Not Started" | 'Task Rejected' | "Task Complete";
  priority?: TaskPriority;
  startDate: string;
  endDate: string;
  remarks: string;
  assignName: string;
  assigneeUser?: string;
  milestone: {
    name: string, id: string,
    projectId: string;
    project: {
      name: string;
    }
  };
  issues: {}[];
  dependentDetails: { name: string, id: string }[];
  anticipatedBudget: number;
  changeOrder: number;
  teamResponsibleId: string;
  teamName?: string;
  organizationId?: string;
  organizationName?: string;
  assigneeOrganizationName?: string;
  taskStartStatus?: number | null;
  taskEndStatus?: number | null;
}

export interface Milestone {
  id: string;
  name: string;
}

export interface Organization {
  id: string;
  name: string;
  type?: 'internal' | 'external';
}
export interface Team {
  active: boolean;
  id: string;
  name: string;
  members: {
    joinedAt: string;
    user: {
      name: string;
      email: string;
      role: string;
      roleID: string;
      id: string
    }
  }[]
}