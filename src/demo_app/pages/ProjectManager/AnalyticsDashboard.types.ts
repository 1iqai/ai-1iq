
export type ProjectStatusType = {
  actualPercentComplete: number;
  initialPercentComplete: number;
  averageInitialCompletion: number;
  averageActualCompletion: number;
  isEmpty?: boolean;
};

export type ProjectType = {
  active: boolean;
  name: string;
  managerId: string;
  startDate: string;
  teams: {
    active: boolean;
    dateCreated: string;
    dateUpdated: string;
    id: string;
    name: string;
    projectId: string;
    members: {
      userId: string // the users id
    }[]
  }[];
  description: string;
  endDate: string;
  id: string;
  milestones: {
    active: "Active";
    id: string;
    name: string;
    projectId: string;
    tasks: Task[];
  }[];

  projectStatus?: ProjectStatusType;
};

export type Task = {
  active: boolean;
  changeOrder: number;
  dateCreated: string;
  dateEnded: string | null;
  teamResponsibleId: string;//id
  dateStarted: string | null;
  assignee: string | null;// the users id
  dateUpdated: string;
  startDate: string;
  endDate: string;
  status: "NotStarted" | "InProgress" | "MarkedComplete" | "TaskComplete" | "TaskRejected";
  taskBudget: number;
  percentComplete: 0 | 100;
  id: string;
  teamId?: string;
  milestoneId?: string;
  issues: {
    status: "Resolved" | "NotResolved"
  }[]
}