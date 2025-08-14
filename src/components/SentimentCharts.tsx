import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timestamp: Date;
  scores: { positive: number; negative: number; neutral: number };
  wordCount: number;
  explanation: string;
}

interface SentimentChartsProps {
  results: SentimentResult[];
}

export const SentimentCharts = ({ results }: SentimentChartsProps) => {
  // Calculate sentiment distribution
  const sentimentCounts = results.reduce((acc, result) => {
    acc[result.sentiment] = (acc[result.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'Positive', value: sentimentCounts.positive || 0, color: 'hsl(var(--positive))' },
    { name: 'Negative', value: sentimentCounts.negative || 0, color: 'hsl(var(--negative))' },
    { name: 'Neutral', value: sentimentCounts.neutral || 0, color: 'hsl(var(--neutral))' }
  ].filter(item => item.value > 0);

  const barData = [
    { sentiment: 'Positive', count: sentimentCounts.positive || 0, fill: 'hsl(var(--positive))' },
    { sentiment: 'Negative', count: sentimentCounts.negative || 0, fill: 'hsl(var(--negative))' },
    { sentiment: 'Neutral', count: sentimentCounts.neutral || 0, fill: 'hsl(var(--neutral))' }
  ];

  // Prepare timeline data (last 10 results chronologically)
  const timelineData = results
    .slice()
    .reverse()
    .map((result, index) => ({
      index: index + 1,
      sentiment: result.sentiment,
      confidence: result.confidence,
      sentimentValue: result.sentiment === 'positive' ? 1 : result.sentiment === 'negative' ? -1 : 0
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Analysis #${label}`}</p>
          <p className="text-sm">
            <span className="font-medium">Sentiment:</span> {payload[0].payload.sentiment}
          </p>
          <p className="text-sm">
            <span className="font-medium">Confidence:</span> {Math.round(payload[0].payload.confidence * 100)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Pie Chart */}
      <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" />
            Sentiment Distribution
          </CardTitle>
          <CardDescription>
            Overall breakdown of sentiment categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{payload[0].payload.name}</p>
                          <p className="text-sm">Count: {payload[0].value}</p>
                          <p className="text-sm">
                            Percentage: {((Number(payload[0].value) / results.length) * 100).toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Sentiment Counts
          </CardTitle>
          <CardDescription>
            Total count by sentiment category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="sentiment" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{payload[0].payload.sentiment}</p>
                          <p className="text-sm">Count: {payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Chart */}
      <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-xl lg:col-span-2 xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Sentiment Timeline
          </CardTitle>
          <CardDescription>
            Sentiment trend over recent analyses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="index" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  domain={[-1.2, 1.2]}
                  tickFormatter={(value) => {
                    if (value > 0.5) return 'Positive';
                    if (value < -0.5) return 'Negative';
                    return 'Neutral';
                  }}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={CustomTooltip} />
                <Line 
                  type="monotone" 
                  dataKey="sentimentValue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-positive" />
              <span>Positive (+1)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral" />
              <span>Neutral (0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-negative" />
              <span>Negative (-1)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};