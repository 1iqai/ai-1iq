interface BotDetectionResult {
  isBot: boolean;
  confidence: number;
  reasons: string[];
}

export class BotDetector {
  private static suspiciousBehaviorCount = 0;
  private static lastInteractionTime = Date.now();
  private static mouseMovements = 0;
  private static keystrokes = 0;

  // Known bot user agents patterns
  private static botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /requests/i,
    /headless/i,
    /phantom/i,
    /selenium/i,
    /puppeteer/i,
    /playwright/i,
    /SemrushBot/i,
    /AhrefsBot/i,
    /MJ12bot/i,
    /DotBot/i,
  ];

  static detectBot(): BotDetectionResult {
    const reasons: string[] = [];
    let confidence = 0;

    // Check user agent
    const userAgent = navigator.userAgent;
    if (this.botPatterns.some(pattern => pattern.test(userAgent))) {
      reasons.push('Suspicious user agent');
      confidence += 40;
    }

    // Check for webdriver
    if ('webdriver' in navigator || (window as any).webdriver) {
      reasons.push('WebDriver detected');
      confidence += 50;
    }

    // Check for headless browser indicators
    if (!navigator.plugins || navigator.plugins.length === 0) {
      reasons.push('No browser plugins');
      confidence += 20;
    }

    // Check for automation indicators
    if ((window as any).chrome && (window as any).chrome.runtime && (window as any).chrome.runtime.onConnect) {
      reasons.push('Chrome automation detected');
      confidence += 30;
    }

    // Check mouse and keyboard activity
    if (this.mouseMovements === 0 && this.keystrokes === 0 && Date.now() - this.lastInteractionTime > 5000) {
      reasons.push('No human interaction detected');
      confidence += 25;
    }

    // Check for rapid navigation
    if (this.suspiciousBehaviorCount > 3) {
      reasons.push('Suspicious navigation patterns');
      confidence += 20;
    }

    return {
      isBot: confidence >= 60,
      confidence: Math.min(confidence, 100),
      reasons
    };
  }

  static initializeTracking() {
    // Track mouse movements
    document.addEventListener('mousemove', () => {
      this.mouseMovements++;
      this.lastInteractionTime = Date.now();
    });

    // Track keystrokes
    document.addEventListener('keydown', () => {
      this.keystrokes++;
      this.lastInteractionTime = Date.now();
    });

    // Track rapid clicks
    let clickCount = 0;
    document.addEventListener('click', () => {
      clickCount++;
      if (clickCount > 10) {
        this.suspiciousBehaviorCount++;
        clickCount = 0;
      }
      this.lastInteractionTime = Date.now();
    });
  }

  static addSuspiciousBehavior() {
    this.suspiciousBehaviorCount++;
  }
}

// Rate limiting utility
export class RateLimiter {
  private static requestCounts = new Map<string, { count: number; timestamp: number }>();
  private static readonly WINDOW_SIZE = 60000; // 1 minute
  private static readonly MAX_REQUESTS = 20; // Max requests per minute

  static isRateLimited(): boolean {
    const now = Date.now();
    const identifier = this.getIdentifier();
    
    const existing = this.requestCounts.get(identifier);
    
    if (!existing || now - existing.timestamp > this.WINDOW_SIZE) {
      this.requestCounts.set(identifier, { count: 1, timestamp: now });
      return false;
    }
    
    if (existing.count >= this.MAX_REQUESTS) {
      return true;
    }
    
    existing.count++;
    return false;
  }

  private static getIdentifier(): string {
    // Simple fingerprinting based on available data
    return `${navigator.userAgent}-${screen.width}x${screen.height}-${navigator.language}`;
  }
}