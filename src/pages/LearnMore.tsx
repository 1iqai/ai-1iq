import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { NewsService } from "@/services/NewsService";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { ChevronLeft, ChevronRight, RefreshCw, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  urlToImage?: string;
}
const LearnMore = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("publishedAt");
  const [pageSize] = useState(6);
  const [newsSource, setNewsSource] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    fetchNews();
  }, [currentPage, searchTerm, sortBy]);
  const fetchNews = async (forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const newsData = await NewsService.fetchConstructionNews(forceRefresh);
      if (newsData.success && newsData.articles) {
        setArticles(newsData.articles);
        setNewsSource(newsData.source || 'unknown');
        
        if (forceRefresh) {
          toast({
            title: "Success",
            description: `News refreshed successfully from ${newsData.source}`,
            duration: 3000,
          });
        }
      } else {
        setArticles([]);
        toast({
          title: "Error",
          description: newsData.error || "Failed to fetch news articles",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setArticles([]);
      toast({
        title: "Error",
        description: "Failed to fetch news articles. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchNews(true);
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews();
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const totalPages = Math.ceil(articles.length / pageSize);
  return <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      {/* Hero Section */}
      <section className="container-custom pt-32 pb-20">
        <div className="text-center space-y-8">
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              <span className="block text-foreground mb-2">
                Learn More About 1iQ
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
              Discover the latest insights, innovations, and opportunities in construction technology and operational intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="container-custom py-20 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Join Our Mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We're always looking for bold thinkers and builders who see the future of operational intelligence differently.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>For Builders & Innovators</CardTitle>
                  <CardDescription>
                    If you're exploring ideas, building tools, or running projects that align with 1iQ's mission—we'd love to hear from you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    We believe in supporting the next generation of builders through resources, mentorship, and funding opportunities.
                  </p>
                  <Button size="lg" className="w-full" onClick={() => navigate('/builders-application')}>
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Career Opportunities</CardTitle>
                  <CardDescription>
                    Join our team of engineers, designers, and construction experts building the future of project intelligence.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Whether you're a seasoned professional or emerging talent, we offer growth opportunities in a cutting-edge environment.
                  </p>
                  <Button variant="outline" size="lg" className="w-full">
                    View Openings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="container-custom py-16">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="news">Latest News</TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                API Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="news" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Latest Construction News
                  </h2>
                  {newsSource && (
                    <Badge variant={newsSource === 'firecrawl' ? 'default' : newsSource === 'newsapi' ? 'secondary' : 'outline'}>
                      Source: {newsSource === 'firecrawl' ? 'Live Scraping' : newsSource === 'newsapi' ? 'News API' : newsSource === 'cache' ? 'Cached' : 'Mock Data'}
                    </Badge>
                  )}
                </div>
                <Button 
                  onClick={handleRefresh} 
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh News'}
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search construction news..."
                    className="w-full"
                  />
                </form>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publishedAt">Latest</SelectItem>
                    <SelectItem value="relevancy">Relevance</SelectItem>
                    <SelectItem value="popularity">Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

          {/* Articles Grid */}
          {loading ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => <Card key={index} className="premium-card animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>)}
            </div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((article, index) => <Card key={index} className="premium-card hover:shadow-premium transition-all duration-300">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit">
                      {article.source}
                    </Badge>
                    <CardTitle className="text-lg line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(article.publishedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {article.description}
                    </p>
                    <Button variant="outline" size="sm" onClick={() => window.open(article.url, '_blank')}>
                      Read More
                    </Button>
                  </CardContent>
                </Card>)}
            </div>}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="max-w-2xl mx-auto">
                <ApiKeyManager />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>;
};
export default LearnMore;