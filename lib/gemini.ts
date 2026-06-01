import { GoogleGenerativeAI } from '@google/generative-ai';
import { CANDIDATE_PROFILE } from './candidate-profile';
import type { JobOffer, JobScore } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// ─── Score a job offer against Kamila's profile ──────────────────────────────
export async function scoreJobOffer(job: JobOffer): Promise<JobScore> {
  const prompt = `
Tu es un expert RH spécialisé dans le recrutement marketing/communication en France.

PROFIL CANDIDAT:
Nom: ${CANDIDATE_PROFILE.name}
Objectif: ${CANDIDATE_PROFILE.objective}
Formation: ${CANDIDATE_PROFILE.education.map(e => `${e.school} - ${e.degree}`).join(', ')}
Expériences: ${CANDIDATE_PROFILE.experience.map(e => `${e.title} chez ${e.company}: ${e.missions.join(', ')}`).join(' | ')}
Compétences techniques: ${CANDIDATE_PROFILE.skills.technical.join(', ')}
Compétences marketing: ${CANDIDATE_PROFILE.skills.marketing.join(', ')}
Soft skills: ${CANDIDATE_PROFILE.skills.soft.join(', ')}
Langues: ${CANDIDATE_PROFILE.languages.map(l => `${l.lang} (${l.level})`).join(', ')}
Type de contrat recherché: ${CANDIDATE_PROFILE.targetContractType} ${CANDIDATE_PROFILE.targetContractDuration}

OFFRE D'EMPLOI:
Titre: ${job.title}
Entreprise: ${job.company}
Localisation: ${job.location}
Type de contrat: ${job.contractType}
Description: ${job.description}
Compétences requises: ${job.requiredSkills?.join(', ') || 'Non précisé'}

TÂCHE:
Évalue la compatibilité entre le profil et l'offre. Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "score": <entier de 1 à 10>,
  "matchingSkills": [<liste des compétences qui correspondent>],
  "missingSkills": [<liste des compétences manquantes>],
  "strengths": [<2-3 points forts du profil pour ce poste>],
  "concerns": [<1-2 points d'attention ou manques>],
  "summary": "<résumé en 2 phrases de la compatibilité>"
}

Critères de notation:
- 9-10: Correspondance excellente, profil idéal
- 7-8: Bonne correspondance, quelques écarts mineurs
- 5-6: Correspondance moyenne, des lacunes notables
- 3-4: Correspondance faible, trop de manques
- 1-2: Profil inadapté à l'offre
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in Gemini response');

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      score: Math.min(10, Math.max(1, parsed.score)),
      matchingSkills: parsed.matchingSkills || [],
      missingSkills: parsed.missingSkills || [],
      strengths: parsed.strengths || [],
      concerns: parsed.concerns || [],
      summary: parsed.summary || '',
    };
  } catch (error) {
    console.error('Gemini scoring error:', error);
    return {
      score: 0,
      matchingSkills: [],
      missingSkills: [],
      strengths: [],
      concerns: ['Erreur lors de l\'évaluation'],
      summary: 'Évaluation impossible',
    };
  }
}

// ─── Generate cover letter ────────────────────────────────────────────────────
export async function generateCoverLetter(job: JobOffer, score: JobScore): Promise<string> {
  const prompt = `
Tu es un expert en rédaction de lettres de motivation en France.

PROFIL:
${CANDIDATE_PROFILE.name}, ${CANDIDATE_PROFILE.age} ans
${CANDIDATE_PROFILE.objective}
Formation: ${CANDIDATE_PROFILE.education[0].school} - ${CANDIDATE_PROFILE.education[0].degree}
Expérience clé: ${CANDIDATE_PROFILE.experience[0].title} chez ${CANDIDATE_PROFILE.experience[0].company}
Compétences fortes: ${score.matchingSkills.slice(0, 5).join(', ')}
Langues: Français natif, Polonais bilingue, Anglais courant

OFFRE VISÉE:
Poste: ${job.title}
Entreprise: ${job.company}
Description courte: ${job.description.substring(0, 300)}

INSTRUCTIONS:
- Rédige une lettre de motivation professionnelle et personnalisée
- Ton chaleureux, dynamique et motivé
- Mets en avant les expériences en marketing digital et événementiel
- 3 paragraphes: accroche + valeur ajoutée + motivation entreprise
- Termine par une formule de politesse appropriée
- Longueur: 250-300 mots
- Format: Lettre complète avec en-tête
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Cover letter generation error:', error);
    return 'Erreur lors de la génération de la lettre de motivation.';
  }
}

// ─── Generate CV suggestions ──────────────────────────────────────────────────
export async function generateCVSuggestions(job: JobOffer, score: JobScore): Promise<string[]> {
  const prompt = `
Pour optimiser le CV de ${CANDIDATE_PROFILE.name} pour le poste "${job.title}" chez ${job.company},
donne 3-4 suggestions concrètes d'améliorations.
Compétences manquantes identifiées: ${score.missingSkills.join(', ')}

Réponds en JSON: { "suggestions": ["suggestion1", "suggestion2", "suggestion3"] }
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.suggestions || [];
  } catch {
    return [];
  }
}
