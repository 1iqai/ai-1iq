import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NewsService } from '@/services/NewsService';
import { FirecrawlService } from '@/services/FirecrawlService';
import { NewsScheduler } from './NewsScheduler';
import { Eye, EyeOff, Key, TestTube, Save } from 'lucide-react';

export const ApiKeyManager = () => {
  const { toast } = useToast();
  const [newsApiKey, setNewsApiKey] = useState(NewsService.getApiKey() || '');
  const [firecrawlApiKey, setFirecrawlApiKey] = useState(FirecrawlService.getApiKey() || '');
  const [showNewsKey, setShowNewsKey] = useState(false);
  const [showFirecrawlKey, setShowFirecrawlKey] = useState(false);
  const [testingNews, setTestingNews] = useState(false);
  const [testingFirecrawl, setTestingFirecrawl] = useState(false);

  const handleSaveNewsApiKey = () => {
    if (newsApiKey.trim()) {
      NewsService.saveApiKey(newsApiKey.trim());
      toast({
        title: "Success",
        description: "News API key saved successfully",
        duration: 3000,
      });
    }
  };

  const handleSaveFirecrawlApiKey = () => {
    if (firecrawlApiKey.trim()) {
      FirecrawlService.saveApiKey(firecrawlApiKey.trim());
      toast({
        title: "Success", 
        description: "Firecrawl API key saved successfully",
        duration: 3000,
      });
    }
  };

  const handleTestNewsApiKey = async () => {
    if (!newsApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a News API key first",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setTestingNews(true);
    try {
      // Simple test by making a request to NewsAPI
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=test&pageSize=1&apiKey=${newsApiKey.trim()}`
      );
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "News API key is valid!",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid News API key",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test News API key",
        variant: "destructive",
        duration: 3000,
      });
    }
    setTestingNews(false);
  };

  const handleTestFirecrawlApiKey = async () => {
    if (!firecrawlApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Firecrawl API key first",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setTestingFirecrawl(true);
    const isValid = await FirecrawlService.testApiKey(firecrawlApiKey.trim());
    
    if (isValid) {
      toast({
        title: "Success",
        description: "Firecrawl API key is valid!",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid Firecrawl API key",
        variant: "destructive",
        duration: 3000,
      });
    }
    setTestingFirecrawl(false);
  };

  return (
    <div className="space-y-6">
      <NewsScheduler />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            News API Configuration
          </CardTitle>
          <CardDescription>
            Enter your News API key to fetch real-time construction news. Get your free key at{' '}
            <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              newsapi.org
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showNewsKey ? "text" : "password"}
                value={newsApiKey}
                onChange={(e) => setNewsApiKey(e.target.value)}
                placeholder="Enter your News API key"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewsKey(!showNewsKey)}
              >
                {showNewsKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveNewsApiKey} disabled={!newsApiKey.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestNewsApiKey} 
              disabled={!newsApiKey.trim() || testingNews}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {testingNews ? "Testing..." : "Test"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Firecrawl API Configuration
          </CardTitle>
          <CardDescription>
            Enter your Firecrawl API key to enable web scraping for live news updates. Get your key at{' '}
            <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              firecrawl.dev
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showFirecrawlKey ? "text" : "password"}
                value={firecrawlApiKey}
                onChange={(e) => setFirecrawlApiKey(e.target.value)}
                placeholder="Enter your Firecrawl API key"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowFirecrawlKey(!showFirecrawlKey)}
              >
                {showFirecrawlKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveFirecrawlApiKey} disabled={!firecrawlApiKey.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestFirecrawlApiKey} 
              disabled={!firecrawlApiKey.trim() || testingFirecrawl}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {testingFirecrawl ? "Testing..." : "Test"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};