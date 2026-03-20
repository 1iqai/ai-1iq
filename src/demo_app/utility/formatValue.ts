
/**
 * Formats a given numeric value(or numeric string) into a US currency format.
 *
 * @function formatValue
 * @param { string | number } value - The value to format.Can be a number or a numeric string.
 * @returns { string } The formatted value as a currency string(e.g., "$1,234.56").
 * If the input is not a valid number, returns the original value.
 *
 * @example
  * formatValue(1234.56); // "$1,234.56"
 * formatValue("9876");  // "$9,876.00"
 * formatValue("abc");   // "abc" (fallback for invalid number)
 */
export const formatValue = (value: string | number) => {
  const numberValue = Number(value); // convert string to number
  if (isNaN(numberValue)) return value; // fallback if not a number
  return numberValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};