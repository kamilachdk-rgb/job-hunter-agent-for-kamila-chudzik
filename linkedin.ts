import axios from 'axios';
import * as cheerio from 'cheerio';
import type { JobOffer } from '@/types';

// LinkedIn Jobs — Public search (no auth required for listing)
export async function scrapeLinkedIn(): Promise<JobOffer[]> {
  const queries = [
    'alternance+marketing+digital',
    'alternance+communication',
  ];

  const jobs: JobOffer[] = [];

  for (const query of queries) {
    try {
      const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${query}&location=France&f_JT=I&start=0`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      $('li').each((_, el) => {
        const $el = $(el);
        const title = $el.find('.base-search-card__title').text().trim();
        const company = $el.find('.base-search-card__subtitle').text().trim();
        const location = $el.find('.job-search-card__location').text().trim();
        const url = $el.find('a.base-card__full-link').attr('href') || '';
        const jobId = $el.attr('data-entity-urn')?.split(':').pop() || `li-${Math.random()}`;

        if (title) {
          jobs.push({
            id: `linkedin-${jobId}`,
            title,
            company,
            location,
            contractType: 'Alternance',
            description: 'Cliquez pour voir la description complète sur LinkedIn.',
            url,
            source: 'linkedin',
            publishedAt: new Date().toISOString(),
            requiredSkills: [],
            status: 'new',
            scrapedAt: new Date().toISOString(),
          });
        }
      });
    } catch (error) {
      console.error('LinkedIn scraping error:', error);
      jobs.push(...getMockLinkedInJobs());
    }
  }

  return jobs.slice(0, 10);
}

function getMockLinkedInJobs(): JobOffer[] {
  return [
    {
      id: 'linkedin-mock-1',
      title: 'Alternance – Brand Content Manager',
      company: 'LVMH',
      location: 'Paris',
      contractType: 'Apprentissage',
      salary: '1200€ - 1500€/mois',
      description: 'Au sein de la direction de la communication de la maison, vous participerez à la création et à la diffusion de contenus de marque sur l\'ensemble des plateformes digitales. Collaboration avec les équipes créatives, agences partenaires et influenceurs.',
      url: 'https://www.linkedin.com/jobs',
      source: 'linkedin',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      requiredSkills: ['Brand Content', 'Réseaux Sociaux', 'Canva', 'Anglais', 'Créativité'],
      status: 'new',
      scrapedAt: new Date().toISOString(),
    },
    {
      id: 'linkedin-mock-2',
      title: 'Alternant(e) Marketing & Événementiel',
      company: 'Evian (Danone)',
      location: 'Évian-les-Bains / Paris',
      contractType: 'Alternance 2 ans',
      salary: '1050€ - 1300€/mois',
      description: 'Intégrez notre équipe événementiel & expérience de marque pour concevoir et déployer des activations innovantes. Vous coordonnerez des événements B2C et B2B, gérerez les partenariats et piloterez les KPIs.',
      url: 'https://www.linkedin.com/jobs',
      source: 'linkedin',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      requiredSkills: ['Événementiel', 'Marketing', 'Logistique', 'Communication', 'Pack Office'],
      status: 'new',
      scrapedAt: new Date().toISOString(),
    },
  ];
}
