import { format, isValid, parseISO } from "date-fns";

/**
 * Formats a given date string into "MM/dd/yyyy" format.
 *
 * @function formatDate
 * @param {string} date - The date string in ISO format.
 * @returns {string} The formatted date string, or "No deadline" if the input is invalid.
 *
 * @example
 * formatDate("2025-11-27"); // "11/27/2025"
 * formatDate(""); // "No deadline"
 */
export const formatDate = (date: string): string => {
  if (!date || !isValid(parseISO(date))) return "No deadline";
  return format(parseISO(date), "MM/dd/yyyy");
};

/**
 * Converts a Date or date string into a Date object with only year, month, and day (time set to midnight).
 *
 * @function toDateOnly
 * @param {Date | string | null | undefined} x - The input date, which can be a Date object, a string, or null/undefined.
 * @returns {Date | null} A Date object with time stripped, or null if input is invalid.
 *
 * @example
 * toDateOnly(new Date()); // Today's date at midnight
 * toDateOnly("2025-11-27"); // Date object for 2025-11-27 at midnight
 * toDateOnly(null); // null
 */
export const toDateOnly = (x: Date | string | null | undefined) => {
  if (!x) return null;
  const d = x instanceof Date ? x : new Date(x);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};


/**
 * Returns the minimum (earliest) valid `Date` from a list of `Date | null` values.
 *
 * - Filters out non-`Date` values and invalid dates (`NaN` time).
 * - If no valid dates remain, returns `null`.
 * - Creates and returns a new `Date` instance using the minimum timestamp.
 *
 * **Notes**
 * - The returned `Date` is a new object (not one of the inputs).
 * - `Date` validity is checked via `!isNaN(d.getTime())`.
 * - Only instances of `Date` are considered valid; other types are ignored.
 *
 * @param {(Date | null)[]} dates - Array of candidate dates which may include `null`.
 * @returns {Date | null} The earliest valid `Date`, or `null` if none are valid.
 *
 * @example
 * minDate([new Date('2025-01-05'), new Date('2025-01-01'), null]);
 * // => Date('2025-01-01T00:00:00.000Z')
 *
 * @example
 * minDate([null, new Date('invalid')]);
 * // => null
 *
 * @example
 * // All valid dates:
 * const earliest = minDate([new Date(0), new Date(1000)]);
 * // => Date(0)
 */
export const minDate = (dates: (Date | null)[]): Date | null => {
  const valid = dates.filter((d): d is Date => d instanceof Date && !isNaN(d.getTime()));
  if (valid.length === 0) return null;
  return new Date(Math.min(...valid.map((d) => d.getTime())));
};


/**
 * Returns the maximum (latest) valid `Date` from a list of `Date | null` values.
 *
 * - Filters out non-`Date` values and invalid dates (`NaN` time).
 * - If no valid dates remain, returns `null`.
 * - Creates and returns a new `Date` instance using the maximum timestamp.
 *
 * **Notes**
 * - The returned `Date` is a new object (not one of the inputs).
 * - `Date` validity is checked via `!isNaN(d.getTime())`.
 * - Only instances of `Date` are considered valid; other types are ignored.
 *
 * @param {(Date | null)[]} dates - Array of candidate dates which may include `null`.
 * @returns {Date | null} The latest valid `Date`, or `null` if none are valid.
 *
 * @example
 * maxDate([new Date('2025-01-05'), new Date('2025-01-10'), null]);
 * // => Date('2025-01-10T00:00:00.000Z')
 *
 * @example
 * maxDate([null, new Date('invalid')]);
 * // => null
 *
 * @example
 * // All valid dates:
 * const latest = maxDate([new Date(0), new Date(1000)]);
 * // => Date(1000)
 */
export const maxDate = (dates: (Date | null)[]): Date | null => {
  const valid = dates.filter((d): d is Date => d instanceof Date && !isNaN(d.getTime()));
  if (valid.length === 0) return null;
  return new Date(Math.max(...valid.map((d) => d.getTime())));
};