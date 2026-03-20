export type Project = {
    id: string;
    name: string;
    description: string;
    projectId?:string;
    managerId: string;
    // customerId: string;
    startDate: string;
    endDate: string;
    percentComplete: number;
    totalTasks: number;
    completedTasks: number;
    totalIssues: number;
    dateCreated: string;
    dateUpdated: string;
    active: "Active" | "Deleted" | "Archived"; // Adjust based on your enum
    manager: {
        name: string;
        email: string;
        image?: string;
    };
    // customer: {
    //     name: string;
    //     email: string;
    //     image?: string;
    // };
    milestones: {
        id: string;
        name: string;
        startDate: string;
        endDate: string;
        active: string;
        dateCreated: string;
        dateUpdated: string;
        tags: string[];
        projectId: string;
    }[];
    teams: {
        id: string;
        name: string;
        projectId: string;
        dateCreated: string;
        dateUpdated: string;
    }[];
};

interface ProjectMobileSidebarHandler {
  toggle: () => void;
  isOpen: boolean;
  setShowSidebar: (value: boolean | ((prevState: boolean) => boolean)) => void;
}

export interface ArchiveProject {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  dueDate: string;
  status: string;
}