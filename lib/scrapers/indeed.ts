import axios from 'axios';
import * as cheerio from 'cheerio';
import type { JobOffer } from '@/types';

export async function scrapeIndeed(): Promise<JobOffer[]> {
  try {
    const response = await axios.get('https://fr.indeed.com/jobs', {
      params: {
        q: 'alternance marketing communication',
        l: 'Île-de-France',
        jt: 'internship',
        fromage: '7',
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const jobs: JobOffer[] = [];

    $('[data-jk]').each((_, el) => {
      const $el = $(el);
      const jobId = $el.attr('data-jk') || `indeed-${Math.random()}`;
      const title = $el.find('[data-testid="job-title"] span, .jobTitle span').first().text().trim();
      const company = $el.find('[data-testid="company-name"], .companyName').first().text().trim();
      const location = $el.find('[data-testid="text-location"], .companyLocation').first().text().trim();
      const salary = $el.find('[data-testid="attribute_snippet_testid"]').first().text().trim();

      if (title) {
        jobs.push({
          id: `indeed-${jobId}`,
          title,
          company,
          location,
          contractType: 'Alternance',
          salary: salary || undefined,
          description: 'Voir la description complète sur Indeed.',
          url: `https://fr.indeed.com/viewjob?jk=${jobId}`,
          source: 'indeed',
          publishedAt: new Date().toISOString(),
          requiredSkills: [],
          status: 'new',
          scrapedAt: new Date().toISOString(),
        });
      }
    });

    return jobs.slice(0, 10);
  } catch (error) {
    console.error('Indeed scraping error:', error);
    return getMockIndeedJobs();
  }
}

function getMockIndeedJobs(): JobOffer[] {
  return [
    {
      id: 'indeed-mock-1',
      title: 'Alternance Marketing Produit & Communication',
      company: 'Sephora',
      location: 'Neuilly-sur-Seine',
      contractType: 'Alternance',
      salary: '1100€ - 1350€/mois',
      description: 'Intégrez notre équipe marketing pour contribuer au développement de la stratégie de communication de nos marques propres. Missions : création de contenu, coordination avec les équipes store, suivi des performances digitales, organisation d\'opérations spéciales.',
      url: 'https://fr.indeed.com',
      source: 'indeed',
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      requiredSkills: ['Marketing', 'Communication', 'Canva', 'Pack Office', 'Organisé(e)'],
      status: 'new',
      scrapedAt: new Date().toISOString(),
    },
    {
      id: 'indeed-mock-2',
      title: 'Alternant(e) – Assistante Chef de Projet Digital',
      company: 'Havas Group',
      location: 'Puteaux',
      contractType: 'Contrat d\'apprentissage – 2 ans',
      salary: '1000€ - 1300€/mois',
      description: 'Au sein de notre agence, vous assisterez les chefs de projet dans la gestion de campagnes digitales pour nos clients grands comptes. Suivi des plannings, relation client, brief créatifs, reporting analytics.',
      url: 'https://fr.indeed.com',
      source: 'indeed',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      requiredSkills: ['Gestion de Projet', 'Marketing Digital', 'Relation Client', 'Analytics'],
      status: 'new',
      scrapedAt: new Date().toISOString(),
    },
  ];
}
