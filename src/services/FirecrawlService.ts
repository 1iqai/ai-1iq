import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlSuccessResponse {
  success: true;
  data: any[];
  creditsUsed?: number;
}

type CrawlResponse = CrawlSuccessResponse | ErrorResponse;

interface ScrapedArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  publishedAt: string;
  source: string;
}

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('Firecrawl API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing Firecrawl API key');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      // Simple test scrape to verify the API key
      const testResponse = await this.firecrawlApp.scrapeUrl('https://example.com');
      return testResponse.success;
    } catch (error) {
      console.error('Error testing Firecrawl API key:', error);
      return false;
    }
  }

  static async scrapeNewsWebsites(): Promise<{ success: boolean; articles?: ScrapedArticle[]; error?: string }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'Firecrawl API key not found' };
    }

    try {
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      // News websites to scrape for construction industry content
      const newsUrls = [
        'https://www.constructionnews.co.uk/',
        'https://www.constructiondive.com/',
        'https://www.enr.com/news',
        'https://www.bdcnetwork.com/news',
        'https://www.constructionequipment.com/news'
      ];

      const allArticles: ScrapedArticle[] = [];

      for (const url of newsUrls) {
        try {
          console.log(`Scraping ${url}...`);
          const response = await this.firecrawlApp.scrapeUrl(url, {
            formats: ['markdown'],
            onlyMainContent: true,
            includeTags: ['title', 'description', 'article'],
            excludeTags: ['nav', 'footer', 'sidebar', 'advertisement']
          });

          if (response.success && response.metadata) {
            // Extract articles from the scraped content
            const articles = this.extractArticlesFromContent(response, url);
            allArticles.push(...articles);
          }
        } catch (error) {
          console.error(`Error scraping ${url}:`, error);
          // Continue with other URLs even if one fails
        }
      }

      // Filter and sort articles
      const filteredArticles = this.filterConstructionNews(allArticles)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 20); // Limit to 20 most recent articles

      return { success: true, articles: filteredArticles };
    } catch (error) {
      console.error('Error during news scraping:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to scrape news websites' 
      };
    }
  }

  private static extractArticlesFromContent(response: any, sourceUrl: string): ScrapedArticle[] {
    const articles: ScrapedArticle[] = [];
    const content = response.markdown || response.content || '';
    const sourceDomain = new URL(sourceUrl).hostname;

    // Simple extraction based on markdown structure
    // This is a basic implementation - can be enhanced based on specific site structures
    const lines = content.split('\n');
    let currentArticle: Partial<ScrapedArticle> = {};

    for (const line of lines) {
      // Look for headings that might be article titles
      if (line.startsWith('# ') || line.startsWith('## ')) {
        if (currentArticle.title && currentArticle.description) {
          articles.push({
            title: currentArticle.title,
            description: currentArticle.description,
            content: currentArticle.content || '',
            url: currentArticle.url || sourceUrl,
            publishedAt: currentArticle.publishedAt || new Date().toISOString(),
            source: sourceDomain
          });
        }
        currentArticle = {
          title: line.replace(/^#+\s/, ''),
          source: sourceDomain
        };
      } else if (line.trim() && !currentArticle.description && currentArticle.title) {
        // First non-empty line after title could be description
        currentArticle.description = line.trim();
      } else if (line.trim() && currentArticle.title) {
        // Add to content
        currentArticle.content = (currentArticle.content || '') + line + '\n';
      }
    }

    // Add the last article if valid
    if (currentArticle.title && currentArticle.description) {
      articles.push({
        title: currentArticle.title,
        description: currentArticle.description,
        content: currentArticle.content || '',
        url: currentArticle.url || sourceUrl,
        publishedAt: currentArticle.publishedAt || new Date().toISOString(),
        source: sourceDomain
      });
    }

    return articles;
  }

  private static filterConstructionNews(articles: ScrapedArticle[]): ScrapedArticle[] {
    const constructionKeywords = [
      'construction', 'building', 'project', 'infrastructure', 'contractor',
      'engineer', 'architecture', 'safety', 'management', 'site', 'development',
      'renovation', 'demolition', 'crane', 'equipment', 'concrete', 'steel'
    ];

    return articles.filter(article => {
      const text = (article.title + ' ' + article.description + ' ' + article.content).toLowerCase();
      return constructionKeywords.some(keyword => text.includes(keyword));
    });
  }
}