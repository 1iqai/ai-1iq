import { capitalCase } from "change-case";

/**
 * Returns a formatted role name based on the input.
 *
 * - If the role is "laborer" (case-insensitive), it returns "Team Member".
 * - Otherwise, it converts the role to capital case (e.g., "project manager" → "Project Manager").
 *
 * @function getRole
 * @param {string | undefined} role - The role string to format.
 * @returns {string | undefined} The formatted role name, or undefined if no role is provided.
 *
 * @example
 * getRole("laborer"); // "Team Member"
 * getRole("project manager"); // "Project Manager"
 * getRole(undefined); // undefined
 */
export const getRole = (role: string | undefined): string | undefined => {
  if (!role) return undefined;
  return role.toLowerCase() === "laborer" ? "Team Member" : capitalCase(role);
};


/**
 * Formats a role string so that only the first character is uppercase and the rest are lowercase.
 *
 * - Uses `getRole()` for initial formatting.
 * - If no role is provided, returns "N/A".
 *
 * @function formatedRoleChars
 * @param {string | undefined} role - The role string to format.
 * @returns {string} The formatted role string with proper casing, or "N/A" if no role is provided.
 *
 * @example
 * formatedRoleChars("laborer"); // "Team member"
 * formatedRoleChars("ADMIN"); // "Admin"
 * formatedRoleChars(undefined); // "N/A"
 */
export const formatedRoleChars = (role: string | undefined): string => {
  const formatted = getRole(role);
  if (!formatted) return "N/A";
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
};