import { useCallback, useContext } from 'react';
import { TurnstileContext } from '../contexts/TurnstileContext';

/**
 * Custom hook to get Cloudflare Turnstile tokens
 *
 * This hook provides access to the Turnstile token from the TurnstileContext.
 * The token is automatically generated when the Turnstile widget completes verification.
 *
 * @returns {Object} Object containing the getToken function and reset function
 * @returns {Function} getToken - Function to get the current Turnstile token
 * @returns {Function} resetToken - Function to reset the Turnstile widget
 *
 * @example
 * const { getToken, resetToken } = useReCaptcha();
 * const token = getToken();
 */
export const useReCaptcha = () => {
  const context = useContext(TurnstileContext);

  if (!context) {
    throw new Error('useReCaptcha must be used within a TurnstileProvider');
  }

  const { token, resetToken } = context;

  /**
   * Gets the current Turnstile token
   *
   * @param {string} _action - The action name (kept for API compatibility, not used by Turnstile)
   * @returns {Promise<string | null>} The Turnstile token, or null if not available
   */
  const getToken = useCallback(
    async (_action?: string): Promise<string | null> => {
      // console.log(`[Turnstile] Token requested for action: ${_action}`);
      if (!token) {
        // console.warn('[Turnstile] Token not available. Verification may still be in progress.');
        return null;
      }
      // console.log(`[Turnstile] Token provided for action: ${_action}`, token.substring(0, 20) + '...');
      return token;
    },
    [token]
  );

  return { getToken, resetToken };
};
