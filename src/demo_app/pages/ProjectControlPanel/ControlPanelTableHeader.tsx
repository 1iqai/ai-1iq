import React, {type ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth';

type ControlPanelTableHeaderProps = {
    handleSort: (value: string) => void,
    getSortIndicator: (value: string) => ReactNode;
}
const ControlPanelTableHeader: React.FC<ControlPanelTableHeaderProps> = ({ handleSort, getSortIndicator }) => {
    const { user } = useAuth()
    const isProjectManager = user.role === "Project Manager";
    return (
        <thead className="bg-bg-accent-light dark:bg-bg-accent-dark sticky top-0 z-10">
            <tr>
                <th onClick={() => handleSort('name')} className="px-2 py-3 text-left text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[150px] cursor-pointer select-none">
                    <div className="flex items-center">Task Name{getSortIndicator('name')}</div>
                </th>
                <th onClick={() => handleSort('dependency')} className="px-2 py-3 text-center text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[150px] cursor-pointer select-none">
                    <div className="flex items-center justify-center">Dependency{getSortIndicator('dependency')}</div>
                </th>
                <th
                    className=" py-3 text-center text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[80px] cursor-pointer select-none">
                    <div className="flex items-center justify-center">Issues</div>
                </th>
                <th onClick={() => handleSort('status')} className="px-2 py-3 text-center text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[120px] cursor-pointer select-none">
                    <div className="flex items-center justify-center">Status{getSortIndicator('status')}</div>
                </th>
                <th onClick={() => handleSort('current')} className="px-2 py-3 text-center text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[120px] cursor-pointer select-none">
                    <div className="flex items-center justify-center">Current{getSortIndicator('current')}</div>
                </th>
                <th onClick={() => handleSort('team')} className="px-2 py-3 text-center text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[100px] cursor-pointer select-none">
                    <div className="flex items-center justify-center">Team{getSortIndicator('team')}</div>
                </th>
                <th onClick={() => handleSort('assignee')} className="px-2 py-3 text-center text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[120px] cursor-pointer select-none">
                    <div className="flex items-center justify-center">Assignee{getSortIndicator('assignee')}</div>
                </th>
                <th onClick={() => handleSort('milestone')} className="px-2 py-3 text-center text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[120px] cursor-pointer select-none">
                    <div className="flex items-center justify-center">Milestone{getSortIndicator('milestone')}</div>
                </th>
                <th onClick={() => handleSort('startDate')} className="px-2 py-3 text-center text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[100px] cursor-pointer select-none">
                    <div className="flex items-center justify-center">Start Date{getSortIndicator('startDate')}</div>
                </th>
                <th onClick={() => handleSort('endDate')} className="px-2 py-3 text-center text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[100px] cursor-pointer select-none">
                    <div className="flex items-center justify-center">Due Date{getSortIndicator('endDate')}</div>
                </th>
                <th onClick={() => handleSort('budget')} className="px-2 py-3 text-center text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[90px] cursor-pointer select-none">
                    <div className="flex items-center justify-center">Budget{getSortIndicator('budget')}</div>
                </th>
                <th onClick={() => handleSort('changeOrder')} className="px-2 py-3 text-center text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider min-w-[110px] cursor-pointer select-none">
                    <div className="flex items-center justify-center">Change Order{getSortIndicator('changeOrder')}</div>
                </th>
                {isProjectManager && (
                    <th className="px-2 py-3 text-right text-xs font-medium text-txt-primary-light dark:text-txt-primary-dark uppercase tracking-wider pr-2 min-w-[100px]">
                        Actions
                    </th>
                )}
            </tr>
        </thead>
    )
}

export default ControlPanelTableHeader