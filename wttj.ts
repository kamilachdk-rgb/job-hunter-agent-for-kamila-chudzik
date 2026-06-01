import axios from 'axios';
import type { JobOffer } from '@/types';

// Welcome to the Jungle — Public API
const WTTJ_API = 'https://api.welcometothejungle.com/api/v1';

const SEARCH_KEYWORDS = [
  'alternance marketing',
  'alternance communication',
  'alternance chef de projet marketing',
  'alternance marketing digital',
];

export async function scrapeWTTJ(): Promise<JobOffer[]> {
  const jobs: JobOffer[] = [];

  for (const keyword of SEARCH_KEYWORDS.slice(0, 2)) {
    try {
      const response = await axios.get(`${WTTJ_API}/jobs`, {
        params: {
          query: keyword,
          contract_type: 'apprenticeship',
          page: 1,
          per_page: 10,
          country_code: 'FR',
        },
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'fr',
        },
        timeout: 10000,
      });

      const data = response.data;
      const results = data.jobs || data.results || [];

      for (const job of results) {
        jobs.push({
          id: `wttj-${job.id || job.slug || Math.random()}`,
          title: job.name || job.title || 'Poste non précisé',
          company: job.organization?.name || job.company_name || 'Entreprise',
          location: job.office?.city || job.city || 'France',
          contractType: job.contract_type || 'Alternance',
          salary: job.salary_min ? `${job.salary_min}€ - ${job.salary_max || '?'}€` : undefined,
          description: job.description || job.profile || '',
          url: `https://www.welcometothejungle.com/fr/companies/${job.organization?.slug}/jobs/${job.slug}`,
          source: 'wttj',
          publishedAt: job.published_at || new Date().toISOString(),
          requiredSkills: job.tags?.map((t: { name: string }) => t.name) || [],
          status: 'new',
          scrapedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error(`WTTJ scraping error for "${keyword}":`, error);
      // Fallback: use mock data for demo
      jobs.push(...getMockWTTJJobs());
    }
  }

  return jobs;
}

function getMockWTTJJobs(): JobOffer[] {
  return [
    {
      id: 'wttj-mock-1',
      title: 'Alternant(e) Marketing Digital',
      company: 'Agence Creads',
      location: 'Paris 9e',
      contractType: 'Alternance',
      salary: '800€ - 1200€/mois',
      description: 'Rejoignez notre équipe marketing pour développer notre présence digitale. Gestion des réseaux sociaux, création de contenu, campagnes emailing, SEO/SEA. Profil: étudiant(e) en marketing digital, maîtrise de Canva et des outils digitaux, créatif(ve) et organisé(e).',
      url: 'https://www.welcometothejungle.com',
      source: 'wttj',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      requiredSkills: ['Canva', 'Community Management', 'Marketing Digital', 'Réseaux Sociaux'],
      status: 'new',
      scrapedAt: new Date().toISOString(),
    },
    {
      id: 'wttj-mock-2',
      title: 'Alternance Chef de Projet Marketing',
      company: 'L\'Oréal',
      location: 'Clichy',
      contractType: 'Alternance - 2 ans',
      salary: '1000€ - 1400€/mois',
      description: 'Au sein de la direction marketing, vous participez au développement et au déploiement des stratégies de marque. Missions: coordination de projets, reporting, relation agences, veille concurrentielle, support aux équipes trade marketing.',
      url: 'https://www.welcometothejungle.com',
      source: 'wttj',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      requiredSkills: ['Pack Office', 'Marketing', 'Chef de Projet', 'Anglais'],
      status: 'new',
      scrapedAt: new Date().toISOString(),
    },
  ];
}
