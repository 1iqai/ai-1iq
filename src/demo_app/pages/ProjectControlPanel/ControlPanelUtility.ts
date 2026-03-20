import { calculateProgress } from "../../utility/analyticsCalculations";
import type { Task } from "./ControlPanel.types";

export const getSortedTasks = (tasks: Task[], sortBy: string, sortOrder: string) => {
    const copy = [...tasks];
    copy.sort((a: Task, b: Task) => {
        let av: string | number = '';
        let bv: string | number = '';
        switch (sortBy) {
            case 'name':
                av = a.name?.toLowerCase() ?? '';
                bv = b.name?.toLowerCase() ?? '';
                break;
            case 'current':
                av = a.status?.toLowerCase() ?? '';
                bv = b.status?.toLowerCase() ?? '';
                break;
            case 'team':
                av = (a.teamName ?? '').toLowerCase();
                bv = (b.teamName ?? '').toLowerCase();
                break;
            case 'assignee':
                av = (a.assigneeUser ?? '-').toLowerCase();
                bv = (b.assigneeUser ?? '-').toLowerCase();
                break;
            case "dependency":
                av = (a.dependentDetails[0]?.name ?? '').toLowerCase();
                bv = (b.dependentDetails[0]?.name ?? '').toLowerCase();
                break;
            case 'milestone':
                av = (a.milestone?.name ?? '').toLowerCase();
                bv = (b.milestone?.name ?? '').toLowerCase();
                break;
            case 'startDate':
                av = a.startDate ? new Date(a.startDate).getTime() : 0;
                bv = b.startDate ? new Date(b.startDate).getTime() : 0;
                break;
            case 'endDate':
                av = a.endDate ? new Date(a.endDate).getTime() : 0;
                bv = b.endDate ? new Date(b.endDate).getTime() : 0;
                break;
            case 'budget':
                av = a.anticipatedBudget ?? 0;
                bv = b.anticipatedBudget ?? 0;
                break;
            case 'changeOrder':
                av = a.changeOrder ?? 0;
                bv = b.changeOrder ?? 0;
                break;
            case "status":
                av = calculateProgress(a.startDate, a.endDate);
                bv = calculateProgress(b.startDate, b.endDate);
                break;
            default:
                av = '';
                bv = '';
        }

        let comparison = 0;
        if (typeof av === 'number' && typeof bv === 'number') {
            comparison = av - bv;
        } else {
            comparison = av > bv ? 1 : av < bv ? -1 : 0;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    return copy;
}