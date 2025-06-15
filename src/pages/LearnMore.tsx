
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NewsService } from "@/services/NewsService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  const { toast } = useToast();

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
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-inter text-4xl lg:text-6xl font-normal text-slate-900 mb-8 leading-tight">
            Why <span className="text-slate-400">1iQ</span> Matters
          </h1>
          <p className="font-inter text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Every day, construction projects fail due to poor management, inadequate oversight, and lack of real-time visibility. 
            1iQ exists to prevent these tragedies through AI-driven project intelligence.
          </p>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-inter text-3xl lg:text-4xl font-normal text-slate-900 mb-4">
                Construction Industry News
              </h2>
              <p className="text-slate-600 text-lg">
                Daily updates on project management challenges and industry incidents
              </p>
            </div>
            
            <Button 
              onClick={loadNews} 
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              {loading ? 'Loading...' : 'Refresh News'}
            </Button>
          </div>

          {/* Single Article Display with Navigation */}
          {articles.length > 0 && (
            <div className="relative">
              <div className="flex items-center justify-center">
                {/* Left Arrow */}
                <Button
                  onClick={prevSlide}
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg border-slate-300 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                {/* Article Display */}
                <div className="max-w-4xl mx-16">
                  <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200 p-8">
                    <CardHeader className="pb-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-base text-slate-500 font-medium">{getCurrentArticle().source}</span>
                        <span className="text-base text-slate-400">{formatDate(getCurrentArticle().publishedAt)}</span>
                      </div>
                      <CardTitle className="text-2xl lg:text-3xl leading-tight text-slate-900 hover:text-slate-700 transition-colors font-normal">
                        {getCurrentArticle().title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-slate-600 leading-relaxed mb-6 text-lg">
                        {getCurrentArticle().description}
                      </CardDescription>
                      {getCurrentArticle().url !== '#' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-slate-300 text-slate-700 hover:bg-slate-50 text-base px-6 py-3"
                          onClick={() => window.open(getCurrentArticle().url, '_blank')}
                        >
                          Read Full Article
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
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg border-slate-300 hover:bg-slate-50"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>

              {/* Article Counter and Indicators */}
              <div className="flex flex-col items-center mt-8 gap-4">
                <div className="text-slate-600">
                  Article {currentSlide + 1} of {articles.length}
                </div>
                
                {/* Slide Indicators */}
                <div className="flex justify-center gap-2">
                  {articles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-slate-900' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {articles.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No articles loaded. Click "Refresh News" to try again.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-inter text-3xl lg:text-4xl font-normal text-slate-900 mb-8">
            Don't Let Your Project Become Tomorrow's Headline
          </h2>
          <p className="font-inter text-xl text-slate-600 mb-12 leading-relaxed">
            1iQ's AI-driven platform provides the real-time visibility and control needed to prevent 
            project failures before they happen. Take control of your construction operations today.
          </p>
          <div className="flex gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3"
            >
              Schedule Demo
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearnMore;
