import { useEffect, useState } from 'react';
import { BotDetector, RateLimiter } from '@/utils/botDetection';

interface BotProtectionProps {
  children: React.ReactNode;
}

export const BotProtection = ({ children }: BotProtectionProps) => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Initialize bot detection tracking
    BotDetector.initializeTracking();

    // Check for bot behavior
    const checkForBots = () => {
      const detection = BotDetector.detectBot();
      
      if (detection.isBot) {
        console.warn('Bot detected (non-blocking):', detection.reasons);
        // No longer blocking, just logging
      }

      // Check rate limiting
      if (RateLimiter.isRateLimited()) {
        console.warn('Rate limit exceeded');
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 5000);
      }
    };

    // Initial check
    setTimeout(checkForBots, 2000);

    // Periodic checks
    const interval = setInterval(checkForBots, 10000);

    // Add honeypot elements (invisible to users, visible to bots)
    const honeypot = document.createElement('div');
    honeypot.style.cssText = 'position:absolute;left:-9999px;visibility:hidden;';
    honeypot.innerHTML = '<input type="email" name="email_check" tabindex="-1" autocomplete="off">';
    document.body.appendChild(honeypot);

    // Check if honeypot is interacted with
    const honeypotInput = honeypot.querySelector('input');
    if (honeypotInput) {
      honeypotInput.addEventListener('change', () => {
        console.warn('Honeypot triggered - bot detected (non-blocking)');
        // No longer blocking, just logging
      });
    }

    return () => {
      clearInterval(interval);
      if (honeypot.parentNode) {
        honeypot.parentNode.removeChild(honeypot);
      }
    };
  }, []);

  return (
    <>
      {showWarning && (
        <div className="fixed top-4 right-4 z-50 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg">
          <p className="font-semibold">Rate Limit Warning</p>
          <p className="text-sm">Please slow down your requests</p>
        </div>
      )}
      {children}
    </>
  );
};