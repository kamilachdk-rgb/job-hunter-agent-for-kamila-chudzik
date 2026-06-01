import axios from 'axios';
import * as cheerio from 'cheerio';
import type { JobOffer } from '@/types';

export async function scrapeHellowork(): Promise<JobOffer[]> {
  try {
    const response = await axios.get('https://www.hellowork.com/fr-fr/emploi/recherche.html', {
      params: {
        k: 'alternance marketing',
        l: 'Île-de-France',
        c: 'alternance',
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const jobs: JobOffer[] = [];

    $('[data-id-offer], .job-offer-list-item').each((_, el) => {
      const $el = $(el);
      const jobId = $el.attr('data-id-offer') || `hw-${Math.random()}`;
      const title = $el.find('.job-title, h2 a').first().text().trim();
      const company = $el.find('.company-name, .job-company').first().text().trim();
      const location = $el.find('.job-location').first().text().trim();

      if (title) {
        jobs.push({
          id: `hellowork-${jobId}`,
          title,
          company,
          location,
          contractType: 'Alternance',
          description: 'Voir la description complète sur HelloWork.',
          url: `https://www.hellowork.com/fr-fr/emploi/offre-${jobId}.html`,
          source: 'hellowork',
          publishedAt: new Date().toISOString(),
          requiredSkills: [],
          status: 'new',
          scrapedAt: new Date().toISOString(),
        });
      }
    });

    return jobs.length > 0 ? jobs.slice(0, 10) : getMockHelloworkJobs();
  } catch (error) {
    console.error('Hellowork scraping error:', error);
    return getMockHelloworkJobs();
  }
}

function getMockHelloworkJobs(): JobOffer[] {
  return [
    {
      id: 'hellowork-mock-1',
      title: 'Alternance – Chargé(e) de Marketing & CRM',
      company: 'Fnac Darty',
      location: 'Ivry-sur-Seine',
      contractType: 'Alternance 2 ans',
      salary: '1000€ - 1250€/mois',
      description: 'Dans le cadre du développement de notre stratégie CRM, vous participez à l\'animation de notre base clients : segmentation, campagnes d\'emailing, personnalisation des offres, analyse des performances. Outils: Salesforce Marketing Cloud, Excel avancé.',
      url: 'https://www.hellowork.com',
      source: 'hellowork',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      requiredSkills: ['CRM', 'Salesforce', 'Emailing', 'Analyse de données', 'Pack Office'],
      status: 'new',
      scrapedAt: new Date().toISOString(),
    },
    {
      id: 'hellowork-mock-2',
      title: 'Alternant(e) Communication & Marketing International',
      company: 'Air France',
      location: 'Roissy CDG',
      contractType: 'Contrat d\'apprentissage',
      salary: '1150€ - 1400€/mois',
      description: 'Intégrez notre direction de la communication pour travailler sur des projets à dimension internationale. Création de supports multilingues, coordination avec nos bureaux étrangers, gestion de nos réseaux sociaux internationaux. Anglais courant requis.',
      url: 'https://www.hellowork.com',
      source: 'hellowork',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      requiredSkills: ['Communication Internationale', 'Anglais', 'Polonais (atout)', 'Réseaux Sociaux', 'InDesign'],
      status: 'new',
      scrapedAt: new Date().toISOString(),
    },
  ];
}
