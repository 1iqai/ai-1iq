
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NewsService } from "@/services/NewsService";
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
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNews();
  }, []);

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

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      NewsService.saveApiKey(apiKey.trim());
      setShowApiInput(false);
      setApiKey('');
      toast({
        title: "Success",
        description: "API key saved. Refreshing news...",
        duration: 3000,
      });
      loadNews();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            
            <div className="flex gap-4">
              <Button 
                onClick={loadNews} 
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                {loading ? 'Loading...' : 'Refresh News'}
              </Button>
              
              <Button 
                onClick={() => setShowApiInput(!showApiInput)}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Add API Key
              </Button>
            </div>
          </div>

          {/* API Key Input */}
          {showApiInput && (
            <Card className="mb-8 bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">NewsAPI Configuration</CardTitle>
                <CardDescription>
                  Add your NewsAPI key to get live construction industry news. 
                  Get a free key at <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">newsapi.org</a>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    type="password"
                    placeholder="Enter your NewsAPI key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveApiKey} className="bg-slate-900 hover:bg-slate-800 text-white">
                    Save Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* News Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {articles.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-slate-500 font-medium">{article.source}</span>
                    <span className="text-sm text-slate-400">{formatDate(article.publishedAt)}</span>
                  </div>
                  <CardTitle className="text-xl leading-tight text-slate-900 hover:text-slate-700 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed mb-4">
                    {article.description}
                  </CardDescription>
                  {article.url !== '#' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      Read Full Article
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

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
