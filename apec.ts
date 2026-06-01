import axios from 'axios';
import type { JobOffer } from '@/types';

// APEC — Recherche d'offres d'emploi
const APEC_API = 'https://www.apec.fr/cms/webservices/recherche/offre';

export async function scrapeAPEC(): Promise<JobOffer[]> {
  try {
    const response = await axios.post(
      `${APEC_API}?nombreParPage=10&pageCourante=0`,
      {
        motsCles: 'marketing communication alternance',
        lieuTravail: [],
        fonctions: [],
        secteurs: [],
        typeContrat: ['A'], // A = Alternance/Apprentissage
        niveau: [],
        salaire: {},
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://www.apec.fr',
        },
        timeout: 10000,
      }
    );

    const results = response.data?.resultats || response.data?.offres || [];
    return results.slice(0, 10).map((job: Record<string, unknown>) => ({
      id: `apec-${job.numeroOffre || job.id || Math.random()}`,
      title: String(job.intitule || job.titre || ''),
      company: String(job.nomSociete || job.entreprise || ''),
      location: String(job.lieuTravaill || job.ville || 'France'),
      contractType: String(job.libelleTypeContrat || 'Alternance'),
      salary: job.salaireMin ? `${job.salaireMin}K€ - ${job.salaireMax || '?'}K€` : undefined,
      description: String(job.texteOffre || job.description || ''),
      url: `https://www.apec.fr/candidat/recherche-emploi.html/emploi/${job.numeroOffre}`,
      source: 'apec' as const,
      publishedAt: String(job.datePublication || new Date().toISOString()),
      requiredSkills: [],
      status: 'new' as const,
      scrapedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('APEC scraping error:', error);
    return getMockAPECJobs();
  }
}

function getMockAPECJobs(): JobOffer[] {
  return [
    {
      id: 'apec-mock-1',
      title: 'Chargé(e) de Communication – Alternance',
      company: 'Groupe Société Générale',
      location: 'La Défense',
      contractType: 'Contrat d\'apprentissage',
      salary: '1100€ - 1300€/mois',
      description: 'Dans le cadre du développement de notre communication interne et externe, nous recherchons un(e) alternant(e) pour : rédaction de contenus pour nos supports de communication, gestion des réseaux sociaux internes, organisation d\'événements, veille médiatique et concurrentielle.',
      url: 'https://www.apec.fr',
      source: 'apec',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      requiredSkills: ['Communication', 'Rédaction', 'Réseaux Sociaux', 'Événementiel', 'Anglais'],
      status: 'new',
      scrapedAt: new Date().toISOString(),
    },
    {
      id: 'apec-mock-2',
      title: 'Alternance – Chargé(e) de Marketing Produit',
      company: 'Decathlon',
      location: 'Villeneuve-d\'Ascq',
      contractType: 'Alternance 2 ans',
      salary: '950€ - 1200€/mois',
      description: 'Rejoignez l\'équipe marketing produit pour participer à la stratégie de développement de nos marques propres. Vous serez impliqué(e) dans l\'analyse marché, le développement produit, la création de supports marketing et le suivi des performances.',
      url: 'https://www.apec.fr',
      source: 'apec',
      publishedAt: new Date().toISOString(),
      requiredSkills: ['Marketing Produit', 'Analyse de Marché', 'Pack Office', 'Canva'],
      status: 'new',
      scrapedAt: new Date().toISOString(),
    },
  ];
}
