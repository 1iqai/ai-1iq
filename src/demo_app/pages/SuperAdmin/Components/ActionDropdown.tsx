import { useState } from "react";
import { MoreHorizontalIcon } from "../../../components/Icons/MoreHorizontalIcon";
import { AnimatePresence, motion } from "framer-motion";

interface ActionDropdownProps<T> {
    item: T;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    editLabel?: string;
    deleteLabel?: string;
}

export function ActionDropdown<T>({ item, onEdit, onDelete, editLabel = "Edit", deleteLabel = "Delete" }: ActionDropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative self-center-safe">
            <button onClick={() => setIsOpen(!isOpen)} onBlur={() => setTimeout(() => setIsOpen(false), 150)} className="p-2 rounded-md hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark">
                <MoreHorizontalIcon />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-[-32px] w-48 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200/50 dark:border-gray-700/50 rounded-lg shadow-xl z-10"
                    >
                        <ul className="p-1">
                            <li className="px-3 py-2 text-sm rounded-md hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark cursor-pointer" onClick={() => { onEdit(item); setIsOpen(false); }}>{editLabel}</li>
                            <li className="px-3 py-2 text-sm text-red-500 rounded-md hover:bg-red-500/10 cursor-pointer" onClick={() => { onDelete(item); setIsOpen(false); }}>{deleteLabel}</li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
