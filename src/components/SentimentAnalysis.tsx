import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { analyzeSentiment, getConfidenceLevel, getAnalysisExplanation } from "@/utils/sentimentAnalysis";
import { toast } from "sonner";
import { SentimentCharts } from "./SentimentCharts";
import { SentimentStats } from "./SentimentStats";

interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timestamp: Date;
  scores: { positive: number; negative: number; neutral: number };
  wordCount: number;
  explanation: string;
}

export const SentimentAnalysis = () => {
  const [tweetText, setTweetText] = useState("");
  const [results, setResults] = useState<SentimentResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!tweetText.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const analysis = analyzeSentiment(tweetText);
    const explanation = getAnalysisExplanation(tweetText);
    
    const newResult: SentimentResult = {
      text: tweetText,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      timestamp: new Date(),
      scores: analysis.scores,
      wordCount: analysis.wordCount,
      explanation
    };
    
    setResults(prev => [newResult, ...prev].slice(0, 20)); // Keep last 20 results
    setTweetText("");
    setIsAnalyzing(false);
    
    const confidenceLevel = getConfidenceLevel(analysis.confidence);
    toast.success(`Analysis complete: ${analysis.sentiment} sentiment (${confidenceLevel} confidence)!`);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-positive text-positive-foreground';
      case 'negative': return 'bg-negative text-negative-foreground';
      case 'neutral': return 'bg-neutral text-neutral-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10 shadow-lg">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Twitter Sentiment Analysis
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze the emotional tone of tweets and social media content with AI-powered sentiment classification
          </p>
        </div>

        {/* Input Section */}
        <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Analyze Tweet Sentiment
            </CardTitle>
            <CardDescription>
              Enter a tweet or social media post to analyze its emotional sentiment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter tweet text here... (e.g., 'I love this new AI technology! It's absolutely amazing and game-changing.')"
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={280}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {tweetText.length}/280 characters
              </span>
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !tweetText.trim()}
                className="bg-primary hover:bg-primary/90 transition-all duration-300"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Sentiment"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {results.length > 0 && <SentimentStats results={results} />}

        {/* Charts */}
        {results.length > 0 && <SentimentCharts results={results} />}

        {/* Recent Results */}
        {results.length > 0 && (
          <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Recent Analysis Results
              </CardTitle>
              <CardDescription>
                Your latest sentiment analysis results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-muted/50 space-y-3 animate-fade-in">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm flex-1 line-clamp-3">{result.text}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={getSentimentColor(result.sentiment)}>
                          {getSentimentIcon(result.sentiment)} {result.sentiment}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">
                          {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{result.explanation}</span>
                      <div className="flex items-center gap-4">
                        <span>{result.wordCount} words</span>
                        <span>{getConfidenceLevel(result.confidence)} confidence</span>
                        <span>{result.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sample Tweets */}
        {results.length === 0 && (
          <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Try These Sample Tweets
              </CardTitle>
              <CardDescription>
                Click any sample to analyze its sentiment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    text: "I absolutely love this new AI technology! It's revolutionary and will change everything for the better. Amazing breakthrough!", 
                    sentiment: "positive" 
                  },
                  { 
                    text: "This update is terrible and disappointing. Nothing works anymore and I'm really frustrated with the whole experience. Worst update ever!", 
                    sentiment: "negative" 
                  },
                  { 
                    text: "The weather today is okay. Nothing special happening, just a regular day at the office. Standard procedures.", 
                    sentiment: "neutral" 
                  },
                  { 
                    text: "Not bad, but could be better. The interface is somewhat confusing and needs improvement.", 
                    sentiment: "negative" 
                  },
                  { 
                    text: "Extremely disappointed with the customer service. Waited 2 hours and still no resolution to my critical problem.", 
                    sentiment: "negative" 
                  },
                  { 
                    text: "Just finished reading an article about quantum computing. Interesting technical details about qubits and superposition.", 
                    sentiment: "neutral" 
                  }
                ].map((sample, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50"
                    onClick={() => setTweetText(sample.text)}
                  >
                    <CardContent className="p-4">
                      <p className="text-sm mb-3">{sample.text}</p>
                      <Badge className={getSentimentColor(sample.sentiment)} variant="outline">
                        Expected: {sample.sentiment}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};