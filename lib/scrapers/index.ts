import { scrapeWTTJ } from './wttj';
import { scrapeAPEC } from './apec';
import { scrapeLinkedIn } from './linkedin';
import { scrapeIndeed } from './indeed';
import { scrapeHellowork } from './hellowork';
import { scoreJobOffer } from '../gemini';
import type { JobOffer } from '@/types';

export async function runAllScrapers(): Promise<JobOffer[]> {
  console.log('🔍 Starting job search across 5 platforms...');

  const [wttj, apec, linkedin, indeed, hellowork] = await Promise.allSettled([
    scrapeWTTJ(),
    scrapeAPEC(),
    scrapeLinkedIn(),
    scrapeIndeed(),
    scrapeHellowork(),
  ]);

  const allJobs: JobOffer[] = [
    ...(wttj.status === 'fulfilled' ? wttj.value : []),
    ...(apec.status === 'fulfilled' ? apec.value : []),
    ...(linkedin.status === 'fulfilled' ? linkedin.value : []),
    ...(indeed.status === 'fulfilled' ? indeed.value : []),
    ...(hellowork.status === 'fulfilled' ? hellowork.value : []),
  ];

  console.log(`✅ Found ${allJobs.length} jobs. Scoring with Gemini AI...`);

  // Score all jobs with Gemini (in batches to avoid rate limits)
  const scoredJobs: JobOffer[] = [];
  for (const job of allJobs) {
    try {
      const score = await scoreJobOffer(job);
      scoredJobs.push({ ...job, score });
      // Small delay to respect Gemini rate limits
      await new Promise(r => setTimeout(r, 300));
    } catch {
      scoredJobs.push(job);
    }
  }

  // Sort by score descending
  return scoredJobs.sort((a, b) => (b.score?.score || 0) - (a.score?.score || 0));
}
