import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { NewsService } from '@/services/NewsService';
import { Clock, Play, Pause, CheckCircle } from 'lucide-react';

export const NewsScheduler = () => {
  const { toast } = useToast();
  const [isScheduled, setIsScheduled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [nextUpdate, setNextUpdate] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Check if scheduled updates are enabled
    const scheduled = localStorage.getItem('news_auto_update') === 'true';
    setIsScheduled(scheduled);
    
    // Get last update time
    const lastUpdateTime = localStorage.getItem('last_news_update');
    if (lastUpdateTime) {
      setLastUpdate(new Date(parseInt(lastUpdateTime)).toLocaleString());
    }

    // Calculate next update time (weekly)
    if (scheduled && lastUpdateTime) {
      const nextUpdateTime = new Date(parseInt(lastUpdateTime) + 7 * 24 * 60 * 60 * 1000);
      setNextUpdate(nextUpdateTime.toLocaleString());
    }

    // Set up interval to check for updates
    if (scheduled) {
      const interval = setInterval(checkForScheduledUpdate, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [isScheduled]);

  const checkForScheduledUpdate = async () => {
    const lastUpdateTime = localStorage.getItem('last_news_update');
    if (!lastUpdateTime) return;

    const now = Date.now();
    const lastUpdate = parseInt(lastUpdateTime);
    const weekInMs = 7 * 24 * 60 * 60 * 1000;

    // If it's been more than a week since last update
    if (now - lastUpdate >= weekInMs) {
      await performScheduledUpdate();
    }
  };

  const performScheduledUpdate = async () => {
    setIsUpdating(true);
    try {
      console.log('Performing scheduled news update...');
      const result = await NewsService.fetchConstructionNews(true);
      
      if (result.success) {
        localStorage.setItem('last_news_update', Date.now().toString());
        setLastUpdate(new Date().toLocaleString());
        
        // Calculate next update
        const nextUpdateTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        setNextUpdate(nextUpdateTime.toLocaleString());
        
        toast({
          title: "News Updated",
          description: `Automatically fetched latest news from ${result.source}`,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Scheduled update failed:', error);
      toast({
        title: "Update Failed",
        description: "Automatic news update failed. Will retry next week.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleScheduled = (enabled: boolean) => {
    setIsScheduled(enabled);
    localStorage.setItem('news_auto_update', enabled.toString());
    
    if (enabled) {
      // Set initial update time if not exists
      if (!localStorage.getItem('last_news_update')) {
        localStorage.setItem('last_news_update', Date.now().toString());
        setLastUpdate(new Date().toLocaleString());
      }
      
      // Calculate next update
      const lastUpdateTime = localStorage.getItem('last_news_update');
      if (lastUpdateTime) {
        const nextUpdateTime = new Date(parseInt(lastUpdateTime) + 7 * 24 * 60 * 60 * 1000);
        setNextUpdate(nextUpdateTime.toLocaleString());
      }
      
      toast({
        title: "Auto-Update Enabled",
        description: "News will be automatically updated weekly",
        duration: 3000,
      });
    } else {
      setNextUpdate(null);
      toast({
        title: "Auto-Update Disabled",
        description: "Automatic news updates have been turned off",
        duration: 3000,
      });
    }
  };

  const handleManualUpdate = async () => {
    setIsUpdating(true);
    try {
      const result = await NewsService.fetchConstructionNews(true);
      
      if (result.success) {
        localStorage.setItem('last_news_update', Date.now().toString());
        setLastUpdate(new Date().toLocaleString());
        
        if (isScheduled) {
          const nextUpdateTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          setNextUpdate(nextUpdateTime.toLocaleString());
        }
        
        toast({
          title: "News Updated",
          description: `Successfully fetched latest news from ${result.source}`,
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update news. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          News Update Scheduler
        </CardTitle>
        <CardDescription>
          Automatically fetch the latest construction news weekly using web scraping and API integration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Weekly Auto-Updates</p>
            <p className="text-xs text-muted-foreground">
              Automatically refresh news every week
            </p>
          </div>
          <Switch
            checked={isScheduled}
            onCheckedChange={handleToggleScheduled}
          />
        </div>
        
        {lastUpdate && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Last Update</span>
            </div>
            <p className="text-sm text-muted-foreground ml-6">{lastUpdate}</p>
          </div>
        )}
        
        {nextUpdate && isScheduled && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Next Scheduled Update</span>
            </div>
            <p className="text-sm text-muted-foreground ml-6">{nextUpdate}</p>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleManualUpdate}
            disabled={isUpdating}
            size="sm"
          >
            {isUpdating ? (
              <>
                <Pause className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Update Now
              </>
            )}
          </Button>
          
          <Badge variant={isScheduled ? "default" : "secondary"}>
            {isScheduled ? "Auto-Updates On" : "Manual Only"}
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• News is cached for 24 hours to improve performance</p>
          <p>• Firecrawl API provides live web scraping when available</p>
          <p>• Falls back to News API and mock data as needed</p>
        </div>
      </CardContent>
    </Card>
  );
};