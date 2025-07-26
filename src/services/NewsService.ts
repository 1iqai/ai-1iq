
import { FirecrawlService } from './FirecrawlService';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

export class NewsService {
  private static API_KEY_STORAGE_KEY = 'news_api_key';
  private static CACHE_KEY = 'cached_news_articles';
  private static CACHE_TIMESTAMP_KEY = 'cache_timestamp';
  private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('News API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static getCachedArticles(): NewsArticle[] | null {
    const cached = localStorage.getItem(this.CACHE_KEY);
    const timestamp = localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
    
    if (cached && timestamp) {
      const cacheAge = Date.now() - parseInt(timestamp);
      if (cacheAge < this.CACHE_DURATION) {
        return JSON.parse(cached);
      }
    }
    return null;
  }

  static setCachedArticles(articles: NewsArticle[]): void {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(articles));
    localStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
  }

  static async fetchConstructionNews(forceRefresh: boolean = false): Promise<{ success: boolean; articles?: NewsArticle[]; error?: string; source?: string }> {
    // Check cache first unless force refresh is requested
    if (!forceRefresh) {
      const cachedArticles = this.getCachedArticles();
      if (cachedArticles) {
        return { success: true, articles: cachedArticles, source: 'cache' };
      }
    }

    // Try Firecrawl scraping first for live updates
    const firecrawlApiKey = FirecrawlService.getApiKey();
    if (firecrawlApiKey) {
      try {
        console.log('Attempting to scrape news with Firecrawl...');
        const scrapedResult = await FirecrawlService.scrapeNewsWebsites();
        
        if (scrapedResult.success && scrapedResult.articles && scrapedResult.articles.length > 0) {
          const articles = scrapedResult.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source
          }));
          
          // Cache the scraped articles
          this.setCachedArticles(articles);
          return { success: true, articles, source: 'firecrawl' };
        }
      } catch (error) {
        console.error('Firecrawl scraping failed:', error);
      }
    }

    // Try NewsAPI as fallback (if API key is provided)
    const newsApiKey = this.getApiKey();
    if (newsApiKey) {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=construction+project+management+failure+accident+safety&sortBy=publishedAt&language=en&apiKey=${newsApiKey}`
        );
        
        if (response.ok) {
          const data = await response.json();
          const articles = data.articles.map((article: any) => ({
            title: article.title,
            description: article.description || '',
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source.name
          }));
          
          // Cache the NewsAPI articles
          const limitedArticles = articles.slice(0, 10);
          this.setCachedArticles(limitedArticles);
          return { success: true, articles: limitedArticles, source: 'newsapi' };
        }
      } catch (error) {
        console.error('NewsAPI error:', error);
      }
    }

    // Fallback to RSS feeds (free alternative)
    try {
      const rssFeeds = [
        'https://www.constructionnews.co.uk/rss',
        'https://www.constructiondive.com/feeds/',
        'https://www.enr.com/rss/all'
      ];

      // For demo purposes, return mock construction industry news
      const mockArticles: NewsArticle[] = [
        {
          title: "Major Infrastructure Project Delayed Due to Poor Planning - $50M Over Budget",
          description: "A critical analysis of how inadequate project management led to significant delays and cost overruns in a major infrastructure development.",
          url: "#",
          publishedAt: new Date().toISOString(),
          source: "Construction News"
        },
        {
          title: "Construction Site Accident Highlights Safety Management Failures",
          description: "Investigation reveals systematic project management failures that compromised worker safety protocols.",
          url: "#",
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          source: "Safety Weekly"
        },
        {
          title: "Building Collapse Traced to Project Oversight Deficiencies",
          description: "Experts point to inadequate project management and quality control as key factors in recent structural failure.",
          url: "#",
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          source: "Engineering Today"
        },
        {
          title: "Contractor Faces Lawsuit Over Project Management Negligence",
          description: "Legal action highlights the critical importance of proper project management in construction operations.",
          url: "#",
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
          source: "Legal Construction"
        },
        {
          title: "Airport Expansion Project Cancelled After Management Failures",
          description: "Multi-billion dollar project terminated due to systematic project management and coordination failures.",
          url: "#",
          publishedAt: new Date(Date.now() - 345600000).toISOString(),
          source: "Aviation Weekly"
        }
      ];

      // Cache the mock articles as well
      this.setCachedArticles(mockArticles);
      return { success: true, articles: mockArticles, source: 'mock' };
    } catch (error) {
      console.error('Error fetching news:', error);
      return { success: false, error: 'Failed to fetch construction news' };
    }
  }
}
