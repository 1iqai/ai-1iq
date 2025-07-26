import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { NewsService } from "@/services/NewsService";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("publishedAt");
  const [pageSize] = useState(6);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, [currentPage, searchTerm, sortBy]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const newsData = await NewsService.fetchConstructionNews();
      if (newsData.success && newsData.articles) {
        setArticles(newsData.articles);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setArticles([]);
      toast({
        title: "Error",
        description: "Failed to fetch news articles. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      {/* Hero Section */}
      <section className="container-custom pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Heading */}
          <div className="space-y-8">
            <div className="space-y-6">
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                <span className="block text-foreground mb-2">
                  Build the Future
                </span>
              </h1>
            </div>
            
            {/* Right side - Description */}
            <div>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
                1iQ delivers mission-critical outcomes for construction's most important projects through AI-driven project intelligence and real-time visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search Section */}
      <section className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Launching
                </h2>
                <h2 className="text-2xl font-bold text-foreground">
                  Build to
                </h2>
                <h2 className="text-2xl font-bold text-foreground">
                  Apply.
                </h2>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <p className="text-muted-foreground leading-relaxed">
                  We're always looking for bold thinkers and builders who see the future of operational intelligence differently. If you're exploring ideas, building tools, or running projects that align with 1iQ's mission—we'd love to hear from you.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We believe in supporting the next generation of builders. Whether you're launching a startup, developing breakthrough technology, or leading innovative projects, we provide resources, mentorship, and funding opportunities.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" className="premium-button">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="container-custom py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Latest News
            </h2>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <Input
                type="text"
                placeholder="Search construction news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="premium-card animate-pulse">
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
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((article, index) => (
                <Card key={index} className="premium-card hover:shadow-premium transition-all duration-300">
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearnMore;