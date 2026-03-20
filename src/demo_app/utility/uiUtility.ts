import type { UserStatus } from "../pages/Admin/DashBoards/UserManagement";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Returns Tailwind CSS classes for background, text, and border colors based on task status.
 *
 * @function getStatusColor
 * @param {string} status - The status of the task (e.g., "Marked Complete", "In Progress").
 * @returns {string} A string of Tailwind CSS classes for styling the status badge.
 *
 * @example
 * getStatusColor("Marked Complete");
 * // "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
 */
export const getStatusColor = (status: string) => {
  switch (status) {
    case "Marked Complete":
    case "Task Complete":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
    case "In Progress":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800";
    case "Task Rejected":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800";
    case "Not Started":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
    default:
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800";
  }
};

/**
 * Generates a deterministic hex color code based on a given string.
 *
 * @function stringToColor
 * @param {string} str - The input string used to generate the color.
 * @returns {string} A hex color code (e.g., "#a1b2c3").
 *
 * @example
 * stringToColor("username"); // "#d4e5f6"
 */
export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(
    Math.abs(Math.sin(hash) * 16777215) % 16777215
  ).toString(16);
  return "#" + "000000".substring(0, 6 - color.length) + color;
}


/**
 * Returns Tailwind CSS classes for a status chip based on user status.
 *
 * @function getStatusChipClass
 * @param {UserStatus} status - The user status (e.g., "Active", "Disabled", "Invited", "Deleted").
 * @returns {string} A string of Tailwind CSS classes for styling the chip.
 *
 * @example
 * getStatusChipClass("Active");
 * // "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
 */
export const getStatusChipClass = (status: UserStatus) => {

  switch (status) {
    case "Active": return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300";
    case "Disabled": return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300";
    case "Invited": return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
    case "Deleted": return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
    default: return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
  }
};


/**
 * Returns Tailwind CSS classes for a status badge based on task status.
 *
 * @function getStatusBadgeClasses
 * @param {string} status - The status of the task (e.g., "TaskRejected", "TaskComplete").
 * @returns {string} A string of Tailwind CSS classes for styling the badge.
 *
 * @example
 * getStatusBadgeClasses("TaskComplete");
 * // "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/30"
 */
export const getStatusBadgeClasses = (status: string) => {
  switch (status) {
    case "TaskRejected":
      return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800/30";
    case "TaskComplete":
      return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/30";
    case "MarkedComplete":
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/30";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700/30";
  }
};


/**
 * Returns Tailwind CSS classes for a status dot based on task status and selection state.
 *
 * @function getStatusDotColor
 * @param {string} status - The status of the task (e.g., "TaskRejected", "MarkedComplete").
 * @param {boolean} isSelected - Whether the dot is in a selected state.
 * @returns {string} A string of Tailwind CSS classes for styling the dot.
 *
 * @example
 * getStatusDotColor("TaskRejected", false);
 * // "bg-red-400 group-hover:bg-red-500"
 *
 * getStatusDotColor("TaskComplete", true);
 * // "bg-brand-primary-500"
 */
export const getStatusDotColor = (status: string, isSelected: boolean) => {
  if (isSelected) {
    return "bg-brand-primary-500";
  }
  switch (status) {
    case "TaskRejected":
      return "bg-red-400 group-hover:bg-red-500";
    case "TaskComplete":
      return "bg-yellow-400 group-hover:bg-yellow-500";
    case "MarkedComplete":
      return "bg-green-400 group-hover:bg-green-500";
    default:
      return "bg-gray-300 dark:bg-gray-600 group-hover:bg-brand-primary-400";
  }
};




/**
 * Merges Tailwind CSS classes with clsx for a more robust class name utility.
 * @param inputs - An array of class names, conditional classes, or class objects.
 * @returns A single, merged string of class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
