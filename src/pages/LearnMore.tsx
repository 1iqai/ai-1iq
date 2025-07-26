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
  const {
    toast
  } = useToast();
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
            duration: 3000
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
          
        </div>
      </section>

      <Footer />
    </div>;
};
export default LearnMore;