/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubjectInfo } from '../types';

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'english',
    name: 'Use of English',
    category: 'General',
    description: 'Compulsory subject covering comprehension, lexicography, oral English, and grammatical structures.',
    topics: [
      'Comprehension & Passages',
      'Lexis and Structure (Synonyms & Antonyms)',
      'Sentence Interpretation',
      'Grammatical Figures of Speech',
      'Oral English (Vowels & Consonants)',
      'Stress and Intonation',
      'The Lekki Headmaster (JAMB Novel Study)'
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    category: 'Science',
    description: 'Algebra, Trigonometry, Geometry, Calculus, and Statistics for scientific calculations.',
    topics: [
      'Number Bases & Fractions',
      'Indices, Logarithms and Surds',
      'Sets, Relations and Binary Operations',
      'Algebraic Equations & Inequalities',
      'Sequence and Series (AP & GP)',
      'Matrices and Determinants',
      'Coordinate Geometry & Trigonometry',
      'Calculus (Differentiation & Integration)',
      'Statistics and Probability'
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    category: 'Science',
    description: 'Study of living organisms, plant anatomy, human physiology, ecology, and evolutionary genetics.',
    topics: [
      'Living Organisms & Cell Structure',
      'Nutrition and Respiration',
      'Transport and Excretion systems',
      'Support, Movement and Nervous system',
      'Plant Growth and Reproduction',
      'Genetics and Heredity',
      'Ecology and Environmental Conservation'
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    category: 'Science',
    description: 'Chemical laws, atomic structures, periodic properties, organic chemistry, and stoichiometry.',
    topics: [
      'Separation of Mixtures & Chemical Laws',
      'Kinetic Theory of Matter & Gas Laws',
      'Atomic Structure and Bonding',
      'Nuclear Chemistry & Periodic Table',
      'Stoichiometry & Chemical Equations',
      'Acid, Base and Salt',
      'Electrochemical Systems',
      'Organic Chemistry (Hydrocarbons & Polymers)'
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    category: 'Science',
    description: 'Mechanics, Heat, Waves, Optics, Electricity, Magnetism, and modern Atomic Physics.',
    topics: [
      'Measurements, Units and Vectors',
      'Motion, Force and Momentum',
      'Work, Energy and Power',
      'Machines and Mechanical Advantage',
      'Thermal Properties & Gas Expansion',
      'Waves and Sound Propagation',
      'Light, Reflection and Refraction',
      'Electrostatics and Current Electricity',
      'Electromagnetism & Atomic Physics'
    ]
  },
  {
    id: 'economics',
    name: 'Economics',
    category: 'Commercial',
    description: 'Microeconomics, Macroeconomics, money and banking, production, and national income.',
    topics: [
      'Basic Concepts of Economics',
      'Theory of Demand and Supply',
      'Consumer Behavior & Utility',
      'Theory of Production & Cost',
      'Market Structures (Competition)',
      'National Income & Inflation',
      'Money, Banking and Public Finance',
      'International Trade & Economic Growth'
    ]
  },
  {
    id: 'government',
    name: 'Government',
    category: 'Social Science',
    description: 'Constitutions, state structures, political theories, citizenship, and international organizations.',
    topics: [
      'Basic Concepts of Government',
      'Political Ideologies & Sovereignty',
      'Constitutions and Constitutionalism',
      'Organs of Government (Executive, Legislature, Judiciary)',
      'Citizenship and Electoral Processes',
      'Pre-colonial & Colonial Administration in Nigeria',
      'Nigerian Nationalist Movements',
      'Nigeria Foreign Policy & International Orgs'
    ]
  },
  {
    id: 'literature',
    name: 'Literature in English',
    category: 'Art',
    description: 'Drama, Prose, Poetry, literary terms, and JAMB recommended literary texts.',
    topics: [
      'Literary Devices and Terms',
      'African Prose & Non-African Prose',
      'African Drama & Non-African Drama',
      'African Poetry & Non-African Poetry'
    ]
  },
  {
    id: 'crs',
    name: 'Christian Religious Studies',
    category: 'Art',
    description: 'Biblical history from the creation, prophets, life of Jesus, and early church teachings.',
    topics: [
      'Sovereignty of God & Creation',
      'Covenant and Leadership (Moses, Joshua)',
      'The Kingship & Prophets of Israel',
      'The Birth, Ministry and Death of Jesus',
      'The Resurrection & the Early Church',
      'Pauline Epistles and Christian Living'
    ]
  },
  {
    id: 'irs',
    name: 'Islamic Religious Studies',
    category: 'Art',
    description: 'History of Islam, Quranic revelations, Hadiths, Sharia, and Islamic etiquette.',
    topics: [
      'History of the Quran and Hadith',
      'The Life of Prophet Muhammad (PBUH)',
      'Articles of Faith (Tawhid)',
      'Pillars of Islam (Salah, Zakah, Sawm, Hajj)',
      'Sharia Law and Jurisprudence',
      'Islamic Civilization & Morals'
    ]
  },
  {
    id: 'commerce',
    name: 'Commerce',
    category: 'Commercial',
    description: 'Trade, home and foreign trade, business organization, communication, and advertising.',
    topics: [
      'Introduction to Commerce',
      'Occupations & Business Setup',
      'Home Trade and Wholesale/Retail',
      'Foreign Trade and Exporting',
      'Advertising and Sales Promotion',
      'Banking and Commercial Services',
      'Insurance and Transportation'
    ]
  },
  {
    id: 'accounting',
    name: 'Financial Accounting',
    category: 'Commercial',
    description: 'Double entry book keeping, trial balance, ledgers, and final company accounts.',
    topics: [
      'Principles of Double Entry Bookkeeping',
      'The Cash Book & Ledger Accounts',
      'The Trial Balance & Bank Reconciliation',
      'Final Accounts of a Sole Trader',
      'Partnership Accounts',
      'Company Accounts & Financial Statements'
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    category: 'Social Science',
    description: 'Physical, human, regional geography, map reading, and weather climatology.',
    topics: [
      'The Earth as a Planet',
      'Rocks, Weathering and Landforms',
      'Weather, Climate and Vegetation',
      'Map Reading and Interpretation',
      'Human Geography (Population & Resources)',
      'Regional Geography of Nigeria'
    ]
  },
  {
    id: 'agriculture',
    name: 'Agricultural Science',
    category: 'Science',
    description: 'Crop production, soil science, animal husbandry, agricultural economics, and extension.',
    topics: [
      'Introduction to Agriculture',
      'Soil Science & Soil Properties',
      'Crop Production and Management',
      'Animal Husbandry & Nutrition',
      'Agricultural Economics & Extension'
    ]
  },
  {
    id: 'history',
    name: 'History',
    category: 'Art',
    description: 'Pre-historic kingdoms, West African history, and colonial administrative systems.',
    topics: [
      'Pre-colonial Nigerian Kingdoms',
      'The Trans-Atlantic Slave Trade',
      'Colonialism and British Rule',
      'Post-independence Political Evolution'
    ]
  },
  {
    id: 'computer',
    name: 'Computer Studies',
    category: 'Science',
    description: 'Introduction to hardware, software, networking, databases, programming, and cybersecurity.',
    topics: [
      'Evolution of Computing & History',
      'Computer Hardware & System Software',
      'Application Software & Word Processing',
      'Basic Programming Concepts',
      'Networking and the Internet',
      'Information Security and Ethics'
    ]
  },
  {
    id: 'fine_arts',
    name: 'Fine Arts',
    category: 'Art',
    description: 'History of art, design principles, drawing, painting, and Nigerian art history.',
    topics: [
      'Elements and Principles of Art',
      'Art History and Appreciation',
      'Drawing, Painting and Sculpture',
      'Traditional and Modern Nigerian Art'
    ]
  },
  {
    id: 'french',
    name: 'French',
    category: 'Art',
    description: 'French grammar, comprehension, vocabulary, and literary analyses.',
    topics: [
      'Grammar & Verbs Conjugation',
      'Comprehension & Vocabulary',
      'Oral French & Pronunciation',
      'Culture and Civilization'
    ]
  },
  {
    id: 'hausa',
    name: 'Hausa',
    category: 'Art',
    description: 'Hausa language orthography, comprehension, literature, and northern culture.',
    topics: [
      'Tsarin Sauti da Rubutu (Phonology & Orthography)',
      'Nahawun Hausa (Grammar)',
      'Adabin Hausa (Literature)',
      'Al\'adun Hausa (Culture & Customs)'
    ]
  },
  {
    id: 'igbo',
    name: 'Igbo',
    category: 'Art',
    description: 'Igbo spelling, sentence structures, literature, and cultural heritage.',
    topics: [
      'Udaasumi na Mkpoputa (Phonology)',
      'Utasusu Igbo (Grammar)',
      'Agumagu Igbo (Literature)',
      'Omenala na Ezi na Ulo (Culture & Custom)'
    ]
  },
  {
    id: 'yoruba',
    name: 'Yoruba',
    category: 'Art',
    description: 'Yoruba orthography, grammar rules, literature, and Yoruba history.',
    topics: [
      'Silebu ati Foneeti (Syllable & Phonetics)',
      'Aba-Ilu ati Giramu (Grammar)',
      'Litireso Yoruba (Literature)',
      'Asa ati Isese Yoruba (Culture & Traditions)'
    ]
  },
  {
    id: 'arabic',
    name: 'Arabic',
    category: 'Art',
    description: 'Arabic comprehension, vocabulary, grammar rules, and Islamic scriptures.',
    topics: [
      'Arabic Grammar (Al-Nahw & Al-Sarf)',
      'Comprehension & Translation',
      'Islamic Arabic Literature'
    ]
  },
  {
    id: 'music',
    name: 'Music',
    category: 'Art',
    description: 'Theory of music, ear training, composers, African and Western music history.',
    topics: [
      'Theory and Notation of Music',
      'African Traditional Music',
      'Western Art Music History',
      'Practical Performance & Harmony'
    ]
  },
  {
    id: 'home_economics',
    name: 'Home Economics',
    category: 'General',
    description: 'Home management, clothing, textiles, food, nutrition, and family health.',
    topics: [
      'Food, Nutrition and Health',
      'Home Management & Family Life',
      'Clothing and Textile Sciences'
    ]
  },
  {
    id: 'physical_health',
    name: 'Physical and Health Education',
    category: 'General',
    description: 'Athletics, indoor and outdoor games, anatomy, physiology, and community health.',
    topics: [
      'Foundations of Physical Education',
      'Athletics, Games and Sports',
      'Human Anatomy and Exercise Physiology',
      'First Aid, Safety and Community Health'
    ]
  }
];
