export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  contractType: string;
  salary?: string;
  description: string;
  url: string;
  source: 'wttj' | 'apec' | 'linkedin' | 'indeed' | 'hellowork';
  publishedAt: string;
  requiredSkills?: string[];
  score?: JobScore;
  status?: 'new' | 'saved' | 'applied' | 'rejected' | 'interview';
  coverLetter?: string;
  cvSuggestions?: string[];
  scrapedAt: string;
}

export interface JobScore {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  concerns: string[];
  summary: string;
}

export interface SearchStats {
  totalFound: number;
  avgScore: number;
  topMatches: number;
  lastSearchAt: string;
  sources: Record<string, number>;
}
