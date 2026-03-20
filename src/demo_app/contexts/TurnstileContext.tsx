import { createContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

interface TurnstileContextType {
  token: string | null;
  resetToken: () => void;
  isLoading: boolean;
  error: string | null;
}

export const TurnstileContext = createContext<TurnstileContextType | null>(null);

interface TurnstileProviderProps {
  children: ReactNode;
}

/**
 * TurnstileProvider - Provides Cloudflare Turnstile verification context
 *
 * Wraps the application with Turnstile widget and provides token access
 * to child components through the TurnstileContext.
 */
export const TurnstileProvider = ({ children }: TurnstileProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

  // console.log('[Turnstile] Provider mounted, siteKey:', siteKey ? siteKey.substring(0, 10) + '...' : 'MISSING');

  const handleSuccess = useCallback((newToken: string) => {
    // console.log('[Turnstile] Verification successful, token received:', newToken.substring(0, 20) + '...');
    setToken(newToken);
    setIsLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback(() => {
    console.error('[Turnstile] Verification failed');
    setToken(null);
    setIsLoading(false);
    setError('Turnstile verification failed. Please try again.');
  }, []);

  const handleExpire = useCallback(() => {
    console.log('[Turnstile] Token expired, resetting...');
    setToken(null);
    // Auto-reset on expiry
    turnstileRef.current?.reset();
  }, []);

  const resetToken = useCallback(() => {
    // console.log('[Turnstile] Manual reset triggered');
    setToken(null);
    setIsLoading(true);
    setError(null);
    turnstileRef.current?.reset();
  }, []);

  return (
    <TurnstileContext.Provider value={{ token, resetToken, isLoading, error }}>
      {children}
      {/* Invisible Turnstile widget */}
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onError={handleError}
        onExpire={handleExpire}
        options={{
          size: 'invisible',
          theme: 'auto',
        }}
      />
    </TurnstileContext.Provider>
  );
};

export default TurnstileProvider;
