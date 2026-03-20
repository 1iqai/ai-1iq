import { addBusinessDays, eachDayOfInterval, isValid, isWeekend, parseISO } from "date-fns";
import { toDateOnly } from "./dateCalculations";
import type { Task } from "../pages/ProjectManager/AnalyticsDashboard.types";

/**
* Calculate number of workdays (Mon–Fri) between two dates
* @param {Date|string} startDate
* @param {Date|string} endDate
* @returns {number} Count of workdays
*/
export default function getWorkdaysBetween(startDate: string | Date, endDate: Date | string): number {
  const days = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  });
  // Filter out weekends (Saturday & Sunday)
  const workdays = days.filter((day) => !isWeekend(day));

  return workdays.length;
}

/**
 * Calculates the progress of a task as a percentage (0–100) based on workdays
 * between a start and end date, relative to today's date.
 *
 * **Logic**
 * - If either `startDate` or `endDate` is missing ⇒ returns `0`.
 * - Converts inputs to `Date` objects and normalizes all dates to midnight.
 * - If dates are invalid or `start >= end` ⇒ returns `0`.
 * - If today is before start ⇒ returns `0`.
 * - If today is on/after end ⇒ returns `100`.
 * - Otherwise:
 *   - `totalDays = getWorkdaysBetween(start, end)`
 *   - `elapsedDays = getWorkdaysBetween(start, today)`
 *   - Progress = `(elapsedDays / totalDays) * 100`, rounded and capped at `100`.
 *
 * **Assumptions**
 * - `getWorkdaysBetween(a, b)` returns the number of workdays between two dates.
 *   Confirm inclusivity rules to avoid off-by-one errors.
 * - Dates are normalized to midnight to avoid time-of-day discrepancies.
 *
 * **Edge Cases**
 * - Invalid dates or reversed range ⇒ `0`.
 * - Today before start ⇒ `0`.
 * - Today on/after end ⇒ `100`.
 * - If `totalDays` is `0` or negative ⇒ returns `0`.
 *
 * @param {string | Date | null} startDate - Start date (ISO string or Date).
 * @param {string | Date | null} endDate - End date (ISO string or Date).
 * @returns {number} Progress percentage (integer) between `0` and `100`.
 *
 * @example
 * calculateProgress('2025-12-01', '2025-12-10');
 * // => e.g., 30 (if 3 workdays have passed out of 10)
 *
 * @example
 * calculateProgress(null, '2025-12-10'); // => 0
 *
 * @example
 * calculateProgress('2025-12-01', '2025-12-01'); // => 0 (invalid range)
 *
 * @example
 * calculateProgress('2025-11-01', '2025-11-10'); // => 100 (if today >= end)
 */
export const calculateProgress = (startDate: string | Date | null, endDate: string | Date | null): number => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  // Strip time from all dates (set to midnight)
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return 0;
  if (today < start) return 0;
  if (today >= end) return 100;

  const totalDays = getWorkdaysBetween(start, end);
  const elapsedDays = getWorkdaysBetween(start, today);

  return Math.min(Math.round((elapsedDays / totalDays) * 100), 100);
}




/**
 * Computes the fraction of a date range that has been completed as of "today",
 * measured in **workdays** (as defined by `getWorkdaysBetween`).
 *
 * The function:
 * - Normalizes `start`, `end`, and today's date to date-only values using `toDateOnly`.
 * - Validates `start` and `end` using `isValid`.
 * - Returns `0` if the inputs are invalid, the range is invalid (start > end), or today is before the start.
 * - Returns `1` if today is on/after the end date, or if start === end.
 * - Otherwise, returns the clamped ratio of elapsed workdays from `start` to today over total workdays from `start` to `end`.
 *
 * **Assumptions / Dependencies**
 * - `isValid(date)` returns `true` if the provided date value is a valid `Date` or date string that can be converted.
 * - `toDateOnly(date)` converts a `Date` or date string to a `Date` at midnight local time (strips the time component).
 * - `getWorkdaysBetween(a, b)` returns the count of workdays between two dates.
 *
 * **Edge Cases Handled**
 * - Invalid inputs (`null`, invalid date string, invalid `Date`) ⇒ returns `0`.
 * - `start >= end`: if equal, returns `1` (single-day range considered complete); if `start > end`, returns `0`.
 * - Today < start ⇒ returns `0`.
 * - Today >= end ⇒ returns `1`.
 * - `getWorkdaysBetween(start, end)` returns `0` or a negative number ⇒ falls back to boundary checks (today >= end ? 1 : 0).
 * - The result is always clamped to `[0, 1]`.
 *
 * @param {Date | string | null} start - The start date (or date string). If `null` or invalid, completion is `0`.
 * @param {Date | string | null} end - The end date (or date string). If `null` or invalid, completion is `0`.
 * @returns {number} A number in the range `[0, 1]` representing the fraction of workdays elapsed in the range.
 *
 * @example
 * // With valid dates and today between them:
 * // Suppose there are 10 workdays from start to end, and 3 have elapsed as of today.
 * const fraction = getFractionComplete('2025-12-01', '2025-12-14');
 * // fraction ≈ 0.3
 *
 * @example
 * // Today before start:
 * getFractionComplete('2025-12-10', '2025-12-20'); // => 0
 *
 * @example
 * // Today on/after end:
 * getFractionComplete('2025-11-01', '2025-11-15'); // => 1
 *
 * @example
 * // Invalid dates:
 * getFractionComplete(null, '2025-12-31'); // => 0
 * getFractionComplete('not-a-date', '2025-12-31'); // => 0
 *
 * @example
 * // Start equals end (single-day range):
 * getFractionComplete('2025-12-05', '2025-12-05'); // => 1
 *
 * @example
 * // Misordered range:
 * getFractionComplete('2025-12-31', '2025-12-01'); // => 0
 */
export const getFractionComplete = (start: Date | string | null, end: Date | string | null): number => {

  if (!start || !isValid(start) || !end || !isValid(end)) return 0;
  const today = toDateOnly(new Date());
  start = toDateOnly(start);
  end = toDateOnly(end);

  if (start!.getTime() >= end!.getTime()) {
    if (start!.getTime() === end!.getTime()) {
      return 1;
    }
    return 0;
  }

  if (today! < start!) return 0;

  if (today! >= end!) return 1;

  const total = getWorkdaysBetween(start!, end!);
  if (!total || total <= 0) {

    return today! >= end! ? 1 : 0;
  }

  const elapsed = getWorkdaysBetween(start!, today!);

  const fraction = Math.max(0, Math.min(1, elapsed / total));
  return fraction;
}



/**
 * Computes the percent/fraction complete for a task in two ways:
 * 1. **initialFraction** — based on the *planned* start/end (`task.startDate`, `task.endDate`).
 * 2. **actualFraction** — based on the *actual* start/end (`task.dateStarted`, `task.dateEnded`).
 *
 * The calculation uses `getFractionComplete(start, end)`, which measures progress in **workdays**.
 *
 * **How actual start/end are derived**
 * - If `task.dateStarted` exists:
 *   - `start` = `task.dateStarted`.
 *   - If `task.dateEnded` exists: `end` = `task.dateEnded`.
 *   - Else if planned range exists (`task.startDate` and `task.endDate`):
 *     - Derive `end` by adding `days - 1` business days to `start`, where
 *       `days = getWorkdaysBetween(task.startDate, task.endDate)`.
 *     - This assumes the actual duration is intended to mirror the planned workday span.
 * - Else if only planned range exists:
 *   - `start` = `task.startDate`, `end` = `task.endDate`.
 * - If neither (actual nor planned) ranges are available, `actualFraction` will be computed
 *   with `null` dates (and thus return `0` from `getFractionComplete`).
 *
 * **Assumptions / Dependencies**
 * - `parseISO(string)` converts an ISO date string to a `Date`.
 * - `getWorkdaysBetween(a, b)` returns the count of workdays between two dates.
 *   Confirm whether it’s inclusive/exclusive to avoid off-by-one errors.
 * - `addBusinessDays(date, n)` adds `n` business days to a given `date`.
 * - `getFractionComplete(start, end)`:
 *   - Normalizes dates to date-only, clamps the result to `[0, 1]`,
 *   - Returns `0` for invalid ranges or if today is before the start,
 *   - Returns `1` if today is on/after end or start === end.
 *
 * **Edge Cases Handled**
 * - Missing planned dates ⇒ `initialFraction` becomes `0` (via `getFractionComplete(null, null)`).
 * - Missing actual end with actual start but planned range present ⇒ actual end is inferred from planned duration in workdays.
 * - Invalid or misordered ranges are handled by `getFractionComplete`.
 * - Result values are always within `[0, 1]`.
 *
 * @typedef {Object} Task
 * @property {Date | string} startDate - Planned start date (ISO string or Date).
 * @property {Date | string} endDate - Planned end date (ISO string or Date).
 * @property {Date | string} [dateStarted] - Actual start date (ISO string or Date).
 * @property {Date | string} [dateEnded] - Actual end date (ISO string or Date).
 *
 * @param {Task} task - Task object containing planned and/or actual dates.
 * @returns {{ actualFraction: number, initialFraction: number }}
 * An object with:
 * - `initialFraction`: fraction complete based on planned dates.
 * - `actualFraction`: fraction complete based on actual dates (or inferred when possible).
 *
 * @example
 * // Planned only:
 * const res1 = getPercentComplete({
 *   startDate: '2025-12-01',
 *   endDate: '2025-12-10'
 * });
 * // => { initialFraction: number between 0..1, actualFraction: same as initialFraction }
 *
 * @example
 * // Actual started, no actual end, infer end from planned workdays:
 * const res2 = getPercentComplete({
 *   startDate: '2025-12-01',
 *   endDate: '2025-12-10',
 *   dateStarted: '2025-12-03'
 * });
 * // => actualFraction uses range [2025-12-03, addBusinessDays(2025-12-03, plannedDays-1)]
 *
 * @example
 * // Actual with explicit end:
 * const res3 = getPercentComplete({
 *   startDate: '2025-12-01',
 *   endDate: '2025-12-10',
 *   dateStarted: '2025-12-02',
 *   dateEnded: '2025-12-08'
 * });
 * // => initialFraction from planned [12/01..12/10], actualFraction from [12/02..12/08]
 */
export const getPercentComplete = (task: Task): { actualFraction: number, initialFraction: number } => {
  const parseDate = (d: Date | string) => (typeof d === "string" ? parseISO(d) : d);

  let start: Date | null = null;
  let end: Date | null = null;

  let initialStart: Date | null = parseDate(task.startDate);
  let initialEnd: Date | null = parseDate(task.endDate);

  if (task.dateStarted) {
    start = parseDate(task.dateStarted);
    if (task.dateEnded) {
      end = parseDate(task.dateEnded);
    } else if (task.startDate && task.endDate) {
      // If dateStarted exists but planned range exists, compute end from workdays
      const days = getWorkdaysBetween(task.startDate, task.endDate);
      end = addBusinessDays(start!, Math.max(0, days - 1));
    }
  }
  // If dateStarted doesn't exist, start and end remain null
  // actualFraction will be 0 (task not started)

  const initialFraction = getFractionComplete(initialStart, initialEnd);
  let actualFraction = getFractionComplete(start, end);

  // Override actualFraction based on task status
  // This must match the backend calculation in dateFormat.ts
  if (task.status === 'MarkedComplete' || task.status === 'TaskComplete') {
    // Completed tasks are always 100%
    actualFraction = 1;
  } else if (task.status === 'InProgress') {
    // In-progress tasks: calculate based on days elapsed vs total duration
    // Duration is calculated from planned start/end dates
    const taskStart = start || initialStart;
    const duration = initialStart && initialEnd ? getWorkdaysBetween(initialStart, initialEnd) : 0;

    if (taskStart && duration > 0) {
      const today = toDateOnly(new Date());
      const daysElapsed = getWorkdaysBetween(taskStart, today!);
      const fraction = daysElapsed / duration;
      // Round to 3 decimal places (gives 1 decimal when converted to %), cap at 99%
      actualFraction = Math.min(Math.round(fraction * 1000) / 1000, 0.99);
    } else {
      actualFraction = 0;
    }
  } else {
    // NotStarted, TaskRejected - stay at 0%
    actualFraction = 0;
  }

  return {
    initialFraction,
    actualFraction
  }

};


/**
 * Computes the fraction of a task's progress as of "today", measured in **workdays**.
 *
 * Progress dates are determined from actuals when available; otherwise, the planned
 * dates are used. If an actual start exists but no actual end, the function infers
 * the actual end by mirroring the planned workday duration.
 *
 * **Date selection logic**
 * - If `task.dateStarted` exists:
 *   - `start` = `task.dateStarted` (parsed via `parseISO` if string).
 *   - If `task.dateEnded` exists: `end` = `task.dateEnded`.
 *   - Else if planned `task.startDate` and `task.endDate` exist:
 *     - Compute `totalWorkdays = getWorkdaysBetween(plannedStart, plannedEnd)`.
 *     - Infer `end = addBusinessDays(start, totalWorkdays - 1)` to match the planned duration.
 * - Else if planned `task.startDate` and `task.endDate` exist:
 *   - `start` = planned start, `end` = planned end.
 * - If neither a usable actual nor planned range is available ⇒ returns `0`.
 *
 * **Progress evaluation (clamped to [0, 1])**
 * - Dates are normalized to start-of-day using `startOfDay`.
 * - If start and end are the same day:
 *   - Return `1` if today is on/after that day; otherwise `0`.
 * - If today is before start ⇒ `0`.
 * - If today is on/after end ⇒ `1`.
 * - Otherwise:
 *   - `totalDays = getWorkdaysBetween(start, end)`.
 *   - `daysPassed = getWorkdaysBetween(start, today)`.
 *   - Return `daysPassed / totalDays` if `totalDays > 0`, else `0`.
 *
 * **Assumptions / Dependencies**
 * - `parseISO(string)` converts an ISO date string to a `Date`.
 * - `startOfDay(date)` truncates the time component to midnight local time.
 * - `getWorkdaysBetween(a, b)` returns a count of workdays between two dates.
 *   Confirm inclusivity (does it include the start/end?)—this code assumes:
 *     - `totalWorkdays` mirrors the planned duration, hence `addBusinessDays(start, totalWorkdays - 1)`.
 *     - When computing `daysPassed`, subtracts 1 to avoid counting the start day as "passed".
 * - `addBusinessDays(date, n)` adds `n` business days to a given `date`.
 *
 * **Edge Cases**
 * - Missing start or end after resolution ⇒ `0`.
 * - Single-day range ⇒ `1` if today is that day or later, else `0`.
 * - `today < start` ⇒ `0`; `today >= end` ⇒ `1`.
 * - `getWorkdaysBetween` returning `0` or negative ⇒ treated as `0` progress.
 * - Result is effectively clamped to `[0, 1]` by boundary checks; consider explicit clamping
 *   if you modify `daysPassed` logic.
 *
 * @typedef {Object} Task
 * @property {Date | string} [startDate] - Planned start date (ISO string or Date).
 * @property {Date | string} [endDate] - Planned end date (ISO string or Date).
 * @property {Date | string} [dateStarted] - Actual start date (ISO string or Date).
 * @property {Date | string} [dateEnded] - Actual end date (ISO string or Date).
 *
 * @param {Task} task - Task-like object with planned and/or actual dates.
 * @returns {number} A fraction in the range `[0, 1]` representing workday progress as of today.
 *
 * @example
 * // Planned only:
 * getTaskProgress({
 *   startDate: '2025-12-01',
 *   endDate: '2025-12-10'
 * }); // => progress between 0..1 based on today's position within planned workdays
 *
 * @example
 * // Actual started, no actual end, infer end from planned:
 * getTaskProgress({
 *   startDate: '2025-12-01',
 *   endDate: '2025-12-10',
 *   dateStarted: '2025-12-03'
 * }); // => uses [2025-12-03 .. addBusinessDays(2025-12-03, plannedWorkdays-1)]
 *
 * @example
 * // Actual with explicit end:
 * getTaskProgress({
 *   dateStarted: '2025-12-02',
 *   dateEnded: '2025-12-08'
 * }); // => uses [12/02 .. 12/08]
 */
export const getTaskProgress = (task: any): number => {
  // Completed tasks are always 100%
  if (task.status === 'TaskComplete' || task.status === 'MarkedComplete') {
    return 1;
  }

  // In-progress tasks: calculate based on days elapsed vs total duration
  if (task.status === 'InProgress') {
    const taskStart = task.dateStarted || task.startDate;
    const duration = task.startDate && task.endDate
      ? getWorkdaysBetween(new Date(task.startDate), new Date(task.endDate))
      : 0;

    if (taskStart && duration > 0) {
      const today = toDateOnly(new Date());
      const daysElapsed = getWorkdaysBetween(new Date(taskStart), today!);
      const fraction = daysElapsed / duration;
      // Round to 3 decimal places (gives 1 decimal when converted to %), cap at 99%
      return Math.min(Math.round(fraction * 1000) / 1000, 0.99);
    }
  }

  // NotStarted, TaskRejected - stay at 0%
  return 0;
}