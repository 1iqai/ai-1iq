export type BudgetType = "Initial Budget" | "Change Order" | "Total Budget" | "Budget Utilized" | "Remaining Budget"

export const BudgetChartColours: Record<BudgetType, string> = {
    "Initial Budget": "#4ea2b5",
    "Change Order": "#eed263",
    "Total Budget": "#1859bc",
    "Budget Utilized": "#6b9b4e",
    "Remaining Budget": "#e07b62"
};

export type TaskStatusByDatesType = "On Time" | "Early" | "Delayed"

export const TaskStatusByDatesColours: Record<TaskStatusByDatesType, string> = {
    "On Time": '#3d8a9c',
    "Early": '#6b9b4e',
    "Delayed": '#c75a42'
}

export type TaskStatusType = "Finished" | "Started" | "Not Started"

export const TaskStatusColours: Record<TaskStatusType, string> = {
    "Finished": "#2e7d32",
    "Started": "#4fa2b5",
    "Not Started": "#a9a9a9"
}

export type IssueStatusType = "Resolved" | "Not Resolved"

export const IssueStatusColours: Record<IssueStatusType, string> = {
    "Resolved": '#97be7b',
    "Not Resolved": '#e07a62'
}

export type TaskAcceptanceStatusType = "Marked Complete" | "Task Rejected" | "Task Complete"

export const TaskAcceptanceStatusColours: Record<TaskAcceptanceStatusType, string> = {
    "Marked Complete": '#66bb6a',
    "Task Rejected": '#e07a62',
    "Task Complete": '#2e7d32',
};


export type ProjectStatusType = "Current Completion" | "Initial Completion" | "Current Remaining" | "Initial Remaining"

export const ProjectStatusColours: Record<ProjectStatusType, string> = {
    "Current Completion": "#4fa2b5",
    "Initial Completion": "#d8dadd",
    "Current Remaining": "transparent",
    "Initial Remaining": "transparent"
};

export type TaskPriorityType = "Critical" | "High" | "Medium" | "Low";

export const TaskPriorityColours: Record<TaskPriorityType, string> = {
    "Critical": "#dc2626",  // Red
    "High": "#ea580c",      // Orange
    "Medium": "#2563eb",    // Blue
    "Low": "#16a34a"        // Green
};
