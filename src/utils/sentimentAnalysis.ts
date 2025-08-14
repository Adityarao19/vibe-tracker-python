// Enhanced sentiment analysis utility with improved accuracy

interface SentimentLexicon {
  positive: Record<string, number>;
  negative: Record<string, number>;
  intensifiers: Record<string, number>;
  negations: string[];
}

// Comprehensive sentiment lexicon with weighted scores
const sentimentLexicon: SentimentLexicon = {
  positive: {
    // Strong positive (2.0)
    'amazing': 2.0, 'awesome': 2.0, 'excellent': 2.0, 'outstanding': 2.0, 'fantastic': 2.0,
    'brilliant': 2.0, 'incredible': 2.0, 'wonderful': 2.0, 'magnificent': 2.0, 'superb': 2.0,
    'exceptional': 2.0, 'extraordinary': 2.0, 'phenomenal': 2.0, 'spectacular': 2.0,
    
    // Moderate positive (1.5)
    'great': 1.5, 'good': 1.5, 'nice': 1.5, 'beautiful': 1.5, 'lovely': 1.5,
    'impressive': 1.5, 'perfect': 1.5, 'pleased': 1.5, 'satisfied': 1.5, 'delighted': 1.5,
    'thrilled': 1.5, 'excited': 1.5, 'happy': 1.5, 'joyful': 1.5, 'grateful': 1.5,
    
    // Mild positive (1.0)
    'like': 1.0, 'enjoy': 1.0, 'appreciate': 1.0, 'useful': 1.0, 'helpful': 1.0,
    'better': 1.0, 'improved': 1.0, 'positive': 1.0, 'optimistic': 1.0, 'glad': 1.0,
    'thanks': 1.0, 'thank': 1.0, 'cool': 1.0, 'fun': 1.0, 'interesting': 1.0,
    
    // Emotion-based positive
    'love': 2.0, 'adore': 1.8, 'cherish': 1.6, 'admire': 1.4, 'respect': 1.2,
    'celebrate': 1.6, 'recommend': 1.4, 'endorse': 1.3, 'support': 1.2
  },
  
  negative: {
    // Strong negative (-2.0)
    'terrible': -2.0, 'awful': -2.0, 'horrible': -2.0, 'disgusting': -2.0, 'pathetic': -2.0,
    'catastrophic': -2.0, 'disastrous': -2.0, 'abysmal': -2.0, 'appalling': -2.0, 'atrocious': -2.0,
    'devastating': -2.0, 'deplorable': -2.0, 'despicable': -2.0, 'dreadful': -2.0,
    
    // Moderate negative (-1.5)
    'bad': -1.5, 'poor': -1.5, 'disappointing': -1.5, 'frustrating': -1.5, 'annoying': -1.5,
    'unacceptable': -1.5, 'inadequate': -1.5, 'unsatisfactory': -1.5, 'problematic': -1.5,
    'concerning': -1.5, 'troubling': -1.5, 'disturbing': -1.5, 'upset': -1.5, 'angry': -1.5,
    
    // Mild negative (-1.0)
    'dislike': -1.0, 'disagree': -1.0, 'unfortunate': -1.0, 'issues': -1.0, 'problems': -1.0,
    'concerned': -1.0, 'worried': -1.0, 'confused': -1.0, 'unclear': -1.0, 'difficult': -1.0,
    'wrong': -1.0, 'error': -1.0, 'failed': -1.0, 'broken': -1.0, 'slow': -1.0,
    
    // Emotion-based negative
    'hate': -2.0, 'detest': -1.8, 'loathe': -1.8, 'despise': -1.6, 'regret': -1.4,
    'disappointed': -1.6, 'frustrated': -1.5, 'irritated': -1.3, 'annoyed': -1.2, 'bothered': -1.1
  },
  
  intensifiers: {
    'very': 1.5, 'extremely': 2.0, 'incredibly': 2.0, 'absolutely': 1.8, 'totally': 1.6,
    'completely': 1.7, 'utterly': 1.9, 'highly': 1.4, 'really': 1.3, 'quite': 1.2,
    'so': 1.3, 'too': 1.2, 'super': 1.5, 'ultra': 1.6, 'mega': 1.5,
    'somewhat': 0.8, 'slightly': 0.7, 'a bit': 0.6, 'kinda': 0.8, 'sort of': 0.7
  },
  
  negations: [
    'not', 'no', 'never', 'nothing', 'nobody', 'nowhere', 'neither', 'nor',
    'cannot', 'can\'t', 'couldn\'t', 'wouldn\'t', 'shouldn\'t', 'don\'t', 'doesn\'t',
    'didn\'t', 'won\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'haven\'t', 'hasn\'t'
  ]
};

// Text preprocessing function
function preprocessText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ') // Keep apostrophes for contractions
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(word => word.length > 0);
}

// Check if a word is a negation
function isNegation(word: string): boolean {
  return sentimentLexicon.negations.includes(word);
}

// Get sentiment score for a word
function getWordScore(word: string): number {
  return sentimentLexicon.positive[word] || sentimentLexicon.negative[word] || 0;
}

// Check if word is an intensifier
function getIntensifierScore(word: string): number {
  return sentimentLexicon.intensifiers[word] || 1.0;
}

// Advanced sentiment analysis with context awareness
export function analyzeSentiment(text: string): { 
  sentiment: 'positive' | 'negative' | 'neutral'; 
  confidence: number;
  scores: { positive: number; negative: number; neutral: number };
  wordCount: number;
} {
  const words = preprocessText(text);
  
  if (words.length === 0) {
    return { 
      sentiment: 'neutral', 
      confidence: 0.5, 
      scores: { positive: 0, negative: 0, neutral: 1 },
      wordCount: 0
    };
  }

  let totalScore = 0;
  let sentimentWords = 0;
  let intensifierMultiplier = 1.0;
  let negationActive = false;
  let negationDistance = 0;
  
  // Analyze each word with context
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    // Handle negations (effective for next 3 words)
    if (isNegation(word)) {
      negationActive = true;
      negationDistance = 0;
      continue;
    }
    
    // Update negation state
    if (negationActive) {
      negationDistance++;
      if (negationDistance > 3) {
        negationActive = false;
      }
    }
    
    // Handle intensifiers
    const intensifier = getIntensifierScore(word);
    if (intensifier !== 1.0) {
      intensifierMultiplier = intensifier;
      continue;
    }
    
    // Get sentiment score
    const baseScore = getWordScore(word);
    if (baseScore !== 0) {
      let adjustedScore = baseScore * intensifierMultiplier;
      
      // Apply negation
      if (negationActive) {
        adjustedScore *= -0.8; // Negation reduces and flips sentiment
      }
      
      totalScore += adjustedScore;
      sentimentWords++;
      
      // Reset intensifier after applying it
      intensifierMultiplier = 1.0;
    }
  }
  
  // Calculate normalized score
  const normalizedScore = sentimentWords > 0 ? totalScore / sentimentWords : 0;
  
  // Determine sentiment and confidence
  let sentiment: 'positive' | 'negative' | 'neutral';
  let confidence: number;
  
  const absScore = Math.abs(normalizedScore);
  
  // Enhanced thresholds based on score magnitude
  if (normalizedScore > 0.3) {
    sentiment = 'positive';
    confidence = Math.min(0.95, 0.6 + absScore * 0.3);
  } else if (normalizedScore < -0.3) {
    sentiment = 'negative';
    confidence = Math.min(0.95, 0.6 + absScore * 0.3);
  } else {
    sentiment = 'neutral';
    confidence = Math.max(0.5, 0.8 - absScore * 0.5);
  }
  
  // Adjust confidence based on text length and sentiment word density
  const sentimentDensity = sentimentWords / words.length;
  const lengthFactor = Math.min(1.0, words.length / 10); // More confident with longer texts
  confidence = confidence * (0.7 + sentimentDensity * 0.2 + lengthFactor * 0.1);
  
  // Calculate individual sentiment scores for visualization
  const positiveScore = Math.max(0, normalizedScore);
  const negativeScore = Math.max(0, -normalizedScore);
  const neutralScore = 1 - Math.abs(normalizedScore);
  
  // Normalize scores
  const total = positiveScore + negativeScore + neutralScore;
  const scores = {
    positive: positiveScore / total,
    negative: negativeScore / total,
    neutral: neutralScore / total
  };
  
  return {
    sentiment,
    confidence: Math.max(0.5, Math.min(0.98, confidence)),
    scores,
    wordCount: words.length
  };
}

// Additional utility for batch analysis
export function analyzeBatchSentiments(texts: string[]): Array<ReturnType<typeof analyzeSentiment>> {
  return texts.map(text => analyzeSentiment(text));
}

// Confidence level interpretation
export function getConfidenceLevel(confidence: number): string {
  if (confidence >= 0.9) return 'Very High';
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.7) return 'Medium';
  if (confidence >= 0.6) return 'Low';
  return 'Very Low';
}

// Get detailed analysis explanation
export function getAnalysisExplanation(text: string): string {
  const words = preprocessText(text);
  const sentimentWords = words.filter(word => getWordScore(word) !== 0);
  const intensifiers = words.filter(word => getIntensifierScore(word) !== 1.0);
  const negations = words.filter(word => isNegation(word));
  
  let explanation = `Analyzed ${words.length} words. `;
  
  if (sentimentWords.length > 0) {
    explanation += `Found ${sentimentWords.length} sentiment words: ${sentimentWords.slice(0, 5).join(', ')}${sentimentWords.length > 5 ? '...' : ''}. `;
  }
  
  if (intensifiers.length > 0) {
    explanation += `Detected ${intensifiers.length} intensifiers. `;
  }
  
  if (negations.length > 0) {
    explanation += `Found ${negations.length} negations affecting sentiment. `;
  }
  
  return explanation;
}