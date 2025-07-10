import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { NewsService } from "@/services/NewsService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SquareQ from "@/components/SquareQ";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

const LearnMore = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadNews();
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (articles.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % articles.length);
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [articles.length]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const result = await NewsService.fetchConstructionNews();
      if (result.success && result.articles) {
        setArticles(result.articles);
      } else {
        toast({
          title: "Info",
          description: "Showing sample construction industry news. Add your NewsAPI key for live updates.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const getCurrentArticle = () => {
    return articles[currentSlide];
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Reduced top padding by 1/4 */}
      <section className="pt-18 pb-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Main heading */}
            <div>
              <h1 className="font-inter text-5xl lg:text-7xl font-normal text-black leading-tight">
                <SquareQ>Build the Future</SquareQ>
              </h1>
            </div>
            
            {/* Right side - Description */}
            <div>
              <p className="font-inter text-xl lg:text-2xl text-gray-600 leading-relaxed">
                <SquareQ>1iQ delivers mission-critical outcomes for construction's most important projects through AI-driven project intelligence and real-time visibility.</SquareQ>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search Section */}
      <section className="py-16 px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Job content */}
            <div>
              <h2 className="font-inter text-4xl lg:text-5xl font-normal text-black leading-tight mb-8">
                <SquareQ>Launching</SquareQ>
                <br />
                <SquareQ>Build to</SquareQ>
                <br />
                <SquareQ>Apply.</SquareQ>
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <SquareQ>Interested in the Construction Project Intelligence or AI-Driven Operations Engineer positions? Don't just tell us how you'd build the future — show us.</SquareQ>
                </p>
                <p>
                  <SquareQ>Register for a free 1iQ Developer Tier account and send us a demo as your application via the Build to Apply links below (Project Intelligence, AI-Driven Operations Engineer). The highest quality submissions will be selected for an immediate on-site interview. This is not a required step of the application process — you may also choose to apply via the application links below.</SquareQ>
                </p>
              </div>
            </div>
            
            {/* Right side - Placeholder image */}
            <div className="flex justify-center">
              <div className="w-full max-w-md h-64 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-lg mx-auto mb-4"></div>
                  <div className="text-sm"><SquareQ>1iQ Platform Demo</SquareQ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Search Filters */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger className="border-b border-gray-300 rounded-none bg-transparent">
                <SelectValue placeholder="Full-time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software-engineer"><SquareQ>Software Engineer</SquareQ></SelectItem>
                <SelectItem value="project-manager"><SquareQ>Project Manager</SquareQ></SelectItem>
                <SelectItem value="data-scientist"><SquareQ>Data Scientist</SquareQ></SelectItem>
                <SelectItem value="product-manager"><SquareQ>Product Manager</SquareQ></SelectItem>
                <SelectItem value="sales-engineer"><SquareQ>Sales Engineer</SquareQ></SelectItem>
                <SelectItem value="customer-success"><SquareQ>Customer Success Manager</SquareQ></SelectItem>
                <SelectItem value="devops-engineer"><SquareQ>DevOps Engineer</SquareQ></SelectItem>
                <SelectItem value="ui-ux-designer"><SquareQ>UI/UX Designer</SquareQ></SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="border-b border-gray-300 rounded-none bg-transparent">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north-america"><SquareQ>North America</SquareQ></SelectItem>
                <SelectItem value="europe"><SquareQ>Europe</SquareQ></SelectItem>
                <SelectItem value="asia-pacific"><SquareQ>Asia Pacific</SquareQ></SelectItem>
                <SelectItem value="middle-east"><SquareQ>Middle East</SquareQ></SelectItem>
                <SelectItem value="latin-america"><SquareQ>Latin America</SquareQ></SelectItem>
                <SelectItem value="africa"><SquareQ>Africa</SquareQ></SelectItem>
                <SelectItem value="new-york"><SquareQ>New York</SquareQ></SelectItem>
                <SelectItem value="london"><SquareQ>London</SquareQ></SelectItem>
                <SelectItem value="singapore"><SquareQ>Singapore</SquareQ></SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="border-b border-gray-300 rounded-none bg-transparent">
                <SelectValue placeholder="Core Operations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering"><SquareQ>Engineering</SquareQ></SelectItem>
                <SelectItem value="product"><SquareQ>Product</SquareQ></SelectItem>
                <SelectItem value="sales"><SquareQ>Sales</SquareQ></SelectItem>
                <SelectItem value="marketing"><SquareQ>Marketing</SquareQ></SelectItem>
                <SelectItem value="operations"><SquareQ>Operations</SquareQ></SelectItem>
                <SelectItem value="customer-success"><SquareQ>Customer Success Manager</SquareQ></SelectItem>
                <SelectItem value="finance"><SquareQ>Finance</SquareQ></SelectItem>
                <SelectItem value="hr"><SquareQ>Human Resources</SquareQ></SelectItem>
                <SelectItem value="legal"><SquareQ>Legal</SquareQ></SelectItem>
                <SelectItem value="security"><SquareQ>Security</SquareQ></SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-b border-gray-300 rounded-none bg-transparent"
            />
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-12 px-6 bg-white border-t border-black">
        <div className="max-w-7xl mx-auto">
          {/* Single Article Display with Navigation */}
          {articles.length > 0 && (
            <div className="relative">
              <div className="flex items-center justify-center">
                {/* Left Arrow */}
                <Button
                  onClick={prevSlide}
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg border-black hover:bg-gray-50"
                >
                  <ChevronLeft className="w-6 h-6 text-black" />
                </Button>

                {/* Article Display */}
                <div className="max-w-4xl mx-16">
                  <Card className="hover:shadow-lg transition-shadow duration-300 border-black p-8">
                    <CardHeader className="pb-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-base text-black font-medium"><SquareQ>{getCurrentArticle().source}</SquareQ></span>
                        <span className="text-base text-gray-400">{formatDate(getCurrentArticle().publishedAt)}</span>
                      </div>
                      <CardTitle className="text-2xl lg:text-3xl leading-tight text-black hover:text-gray-700 transition-colors font-normal">
                        <SquareQ>{getCurrentArticle().title}</SquareQ>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 leading-relaxed mb-6 text-lg">
                        <SquareQ>{getCurrentArticle().description}</SquareQ>
                      </CardDescription>
                      {getCurrentArticle().url !== '#' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-black text-black hover:bg-gray-50 text-base px-6 py-3"
                          onClick={() => window.open(getCurrentArticle().url, '_blank')}
                        >
                          <SquareQ>Read Full Article</SquareQ>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Arrow */}
                <Button
                  onClick={nextSlide}
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg border-black hover:bg-gray-50"
                >
                  <ChevronRight className="w-6 h-6 text-black" />
                </Button>
              </div>

              {/* Article Counter and Indicators */}
              <div className="flex flex-col items-center mt-8 gap-4">
                <div className="text-black">
                  <SquareQ>{`Article ${currentSlide + 1} of ${articles.length}`}</SquareQ>
                </div>
                
                {/* Slide Indicators */}
                <div className="flex justify-center gap-2">
                  {articles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-black' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {articles.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg"><SquareQ>No articles loaded. Please try again later.</SquareQ></p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-6 bg-gray-50 border-t border-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-inter text-3xl lg:text-4xl font-normal text-black mb-8">
            <SquareQ>Don't Let Your Project Become Tomorrow's Headline</SquareQ>
          </h2>
          <p className="font-inter text-xl text-gray-600 mb-12 leading-relaxed">
            <SquareQ>1iQ's AI-driven platform provides the real-time visibility and control needed to prevent project failures before they happen. Take control of your construction operations today.</SquareQ>
          </p>
          <div className="flex gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-8 py-3"
            >
              <SquareQ>Schedule Demo</SquareQ>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
            >
              <SquareQ>Contact Sales</SquareQ>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearnMore;
