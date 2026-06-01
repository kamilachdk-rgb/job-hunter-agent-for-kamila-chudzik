// Profil de Kamila Chudzik extrait de son CV
export const CANDIDATE_PROFILE = {
  name: 'Kamila Chudzik',
  email: 'kamila.chdk@gmail.com',
  phone: '07 82 01 17 42',
  location: 'Villepreux, Yvelines',
  dob: '21/01/2003',
  age: 23,

  objective:
    "Étudiante ambitieuse et motivée en Master International Consumer Marketing, je cherche une alternance de 2 ans pour débuter ma première année de master.",

  targetRoles: [
    'Chargée de Marketing',
    'Assistante Marketing Digital',
    'Chef de Projet Marketing',
    'Chargée de Communication',
    'Chargée d\'Événementiel',
    'Brand Manager',
    'Community Manager',
    'Product Manager',
  ],

  targetContractType: 'alternance',
  targetContractDuration: '2 ans',
  targetLocation: ['Île-de-France', 'Paris', 'Yvelines', 'Remote'],

  education: [
    {
      school: 'ESCE International Business School',
      degree: 'Master International Consumer Marketing',
      period: '2021 – 2026',
      status: 'En cours (3e année)',
      courses: [
        'Management',
        'Corporate Strategy',
        'Comptabilité',
        'Finance International',
        'Pratiques et Techniques du Commerce International',
        'Marketing International',
      ],
    },
    {
      school: 'Tampere University – Finlande',
      degree: 'Semestre international (échange)',
      period: 'Janvier – Mai 2023',
      courses: [
        'Managing Multicultural Organizations',
        'International Brand Management',
        'Research Project in Customer Intelligence',
        'Human Resource Management',
        'Marketing in the Digital World',
      ],
    },
    {
      school: 'Lycée International de Saint Germain-en-Laye',
      degree: 'Baccalauréat International OIB',
      period: '2021',
    },
  ],

  experience: [
    {
      title: 'Assistante Chef de Projet (stage)',
      company: 'LOSAM AGENCY',
      period: 'Juillet – Décembre 2023',
      missions: [
        'Logistique événementielle, relation prestataires, accueil des participants, sécurisation des participants',
        'CRM et Prospection : gestion et enrichissement des bases de données',
        'Marketing : comptes-rendus d\'événements, veille stratégique, sites internet',
      ],
    },
    {
      title: 'Assistante Marketing Digital (stage)',
      company: 'DIGIWEST AGENCY',
      period: 'Juillet – Août 2022',
      missions: [
        'Community management',
        'Création de contenu',
        'Marketing d\'influence',
      ],
    },
    {
      title: 'Évènementiel Mariage (job étudiant)',
      company: 'LE MANOIR DES CYGNES',
      missions: ['Coordination événementielle'],
    },
  ],

  associativeLife: [
    'Bureau Des Élèves : pôle création',
    'Karting ESCE Racing Team : pôle événementiel et création',
  ],

  skills: {
    technical: ['Pack Office', 'Salesforce', 'InDesign', 'Canva'],
    soft: ["Travail d'équipe", "Capacité d'adaptation", 'Organisée', 'Responsable'],
    marketing: [
      'Marketing Digital',
      'Community Management',
      'Création de contenu',
      'Marketing d\'influence',
      'CRM',
      'Veille stratégique',
      'Événementiel',
      'Logistique',
      'Brand Management',
    ],
  },

  languages: [
    { lang: 'Français', level: 'Natif' },
    { lang: 'Polonais', level: 'Bilingue' },
    { lang: 'Anglais', level: 'Courant' },
  ],

  interests: ['Sport', 'Sport Automobile', 'Musique', 'Montage Vidéo', 'Voyages'],

  // Critères de recherche pour le scoring Gemini
  searchKeywords: [
    'alternance marketing',
    'alternance communication',
    'alternance chef de projet',
    'alternance marketing digital',
    'alternance brand manager',
    'alternance événementiel',
    'alternance community manager',
  ],
};

export type CandidateProfile = typeof CANDIDATE_PROFILE;
