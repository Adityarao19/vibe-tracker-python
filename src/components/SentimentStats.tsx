import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react";

interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timestamp: Date;
}

interface SentimentStatsProps {
  results: SentimentResult[];
}

export const SentimentStats = ({ results }: SentimentStatsProps) => {
  const totalAnalyses = results.length;
  const positiveCount = results.filter(r => r.sentiment === 'positive').length;
  const negativeCount = results.filter(r => r.sentiment === 'negative').length;
  const neutralCount = results.filter(r => r.sentiment === 'neutral').length;
  
  const positivePercentage = ((positiveCount / totalAnalyses) * 100).toFixed(1);
  const negativePercentage = ((negativeCount / totalAnalyses) * 100).toFixed(1);
  const neutralPercentage = ((neutralCount / totalAnalyses) * 100).toFixed(1);
  
  const averageConfidence = (results.reduce((sum, r) => sum + r.confidence, 0) / totalAnalyses * 100).toFixed(1);

  const stats = [
    {
      title: "Positive Sentiment",
      value: `${positiveCount}`,
      percentage: `${positivePercentage}%`,
      icon: TrendingUp,
      color: "text-positive",
      bgColor: "bg-positive/10",
      borderColor: "border-positive/20"
    },
    {
      title: "Negative Sentiment", 
      value: `${negativeCount}`,
      percentage: `${negativePercentage}%`,
      icon: TrendingDown,
      color: "text-negative",
      bgColor: "bg-negative/10",
      borderColor: "border-negative/20"
    },
    {
      title: "Neutral Sentiment",
      value: `${neutralCount}`,
      percentage: `${neutralPercentage}%`,
      icon: Minus,
      color: "text-neutral",
      bgColor: "bg-neutral/10", 
      borderColor: "border-neutral/20"
    },
    {
      title: "Average Confidence",
      value: `${averageConfidence}%`,
      percentage: "accuracy",
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={`backdrop-blur-sm bg-card/95 border-border/50 shadow-xl ${stat.borderColor} transition-all duration-300 hover:shadow-2xl hover:scale-105`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.percentage === "accuracy" ? "Model accuracy" : `${stat.percentage} of total`}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};