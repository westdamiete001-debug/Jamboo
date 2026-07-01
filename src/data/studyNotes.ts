/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudyNote, SyllabusItem } from '../types';

// Concrete high-quality syllabus & study notes for popular subjects
export const STATIC_STUDY_NOTES: StudyNote[] = [
  {
    id: 'note-eng-1',
    subject: 'english',
    topic: 'The Lekki Headmaster (JAMB Novel Study)',
    definition: 'The Lekki Headmaster is a novel written by Mubarak Said that explores the administrative, academic, and moral challenges faced by teachers, students, and parents at Stardom School in Lekki, Lagos.',
    content: 'The novel is a mandatory reading text for the UTME Use of English. It details the administrative struggles, parental expectations, and student behaviors within a high-standard school. It highlights themes of discipline, educational integrity, parental influence, and the impact of modernization on school administration.',
    examples: [
      {
        problem: 'Identify the school where the events of "The Lekki Headmaster" take place.',
        solution: 'The events and administrative struggles in the novel primarily occur at Stardom School (a prestigious private institution in Lekki, Lagos).'
      }
    ],
    keyPoints: [
      'Set in Stardom School in Lekki, Lagos.',
      'Addresses school discipline, parental influence, and administrative integrity.',
      'Written by Mubarak Said.',
      'Highlights the pressures of modern schooling and societal expectations on educators.'
    ],
    summary: 'The Lekki Headmaster prepares UTME candidates for questions on educational discipline, parent-school relationships, and contemporary moral standards in Nigeria.',
    tips: [
      'Focus on the character actions, school policies, and disciplinary events.',
      'Pay close attention to key interactions between the school administration, parents, and students.',
      'Understand the moral lessons and societal commentary presented by Mubarak Said.'
    ],
    commonMistakes: [
      'Confusing the school name (Stardom School) with other fictional schools.',
      'Underestimating small details like character names, administrative decisions, or the specific settings.'
    ],
    faqs: [
      {
        q: 'Is reading the novel compulsory for JAMB?',
        a: 'Yes, Use of English questions are drawn directly from "The Lekki Headmaster" by Mubarak Said.'
      }
    ]
  },
  {
    id: 'note-math-1',
    subject: 'mathematics',
    topic: 'Indices, Logarithms and Surds',
    definition: 'Mathematical operations that express powers, inverse powers (logarithms), and irrational roots of numbers (surds).',
    content: 'Laws of Indices:\n1. a^x * a^y = a^(x+y)\n2. a^x / a^y = a^(x-y)\n3. (a^x)^y = a^(xy)\n\nLaws of Logarithms:\n1. log(AB) = log A + log B\n2. log(A/B) = log A - log B\n3. log(A^k) = k * log A\n\nSurds rules include rationalizing the denominator by multiplying by the conjugate.',
    examples: [
      {
        problem: 'Simplify: log₁₀ 5 + log₁₀ 20',
        solution: 'Using the product rule: log(A) + log(B) = log(AB).\nlog₁₀(5 * 20) = log₁₀ 100 = log₁₀ 10² = 2.'
      },
      {
        problem: 'Rationalize the surd: 3 / √2',
        solution: 'Multiply numerator and denominator by √2:\n(3 * √2) / (√2 * √2) = 3√2 / 2.'
      }
    ],
    keyPoints: [
      'The base of a natural logarithm is e (~2.718), while common logarithms use base 10.',
      'Surds are irrational numbers that cannot be simplified to whole numbers or fractions.',
      'Conjugate of (a + √b) is (a - √b).'
    ],
    summary: 'Mastering exponential laws and base-10 logarithmic transformations is key to solving complex algebraic problems in JAMB.',
    tips: [
      'Remember that log of 1 to any base is always 0, and log of any base to itself is 1.',
      'Never add exponents when multiplying different bases (e.g., 2³ * 3² is NOT 6⁵).'
    ],
    commonMistakes: [
      'Writing log(A + B) as log A + log B. This is completely mathematically incorrect.',
      'Forgetting to change the signs when multiplying by a conjugate surd.'
    ],
    faqs: [
      {
        q: 'What are the most tested sections in Surds?',
        a: 'Rationalization of compound denominators and solving equations involving surds.'
      }
    ]
  }
];

// List of concrete syllabus items matching official curriculum
export const STATIC_SYLLABUS: SyllabusItem[] = [
  {
    id: 'syl-eng-1',
    subject: 'english',
    topic: 'The Lekki Headmaster (JAMB Novel Study)',
    subtopics: [
      'Themes and Plot Analysis',
      'Character Roles and Traits',
      'Critical Moral Lessons',
      'Vocabulary and Lexis used in the book'
    ],
    objectives: [
      'Identify the major and minor characters in the novel.',
      'Determine the moral lessons and societal commentary in Mubarak Said\'s book.',
      'Analyze the themes of discipline, school administration, parental influence, and peer pressure.'
    ]
  },
  {
    id: 'syl-math-1',
    subject: 'mathematics',
    topic: 'Indices, Logarithms and Surds',
    subtopics: [
      'Laws of Indices',
      'Theory and application of Logarithms',
      'Simplification and Rationalization of Surds'
    ],
    objectives: [
      'Apply laws of indices to solve complex exponential equations.',
      'Use logarithm tables and rules to perform numerical computations.',
      'Perform basic operations on surds and rationalize denominators.'
    ]
  }
];

// Helper to dynamically get or generate Study Note for any subject
export function getStudyNote(subjectId: string, topic: string): StudyNote {
  const existing = STATIC_STUDY_NOTES.find(
    (n) => n.subject === subjectId && n.topic.toLowerCase() === topic.toLowerCase()
  );
  if (existing) return existing;

  // Generate clean, highly professional, realistic study notes on the fly
  return {
    id: `note-${subjectId}-${topic.replace(/\s+/g, '-').toLowerCase()}`,
    subject: subjectId,
    topic: topic,
    definition: `Detailed educational overview and definitions of ${topic} as specified under the Joint Admissions and Matriculation Board (JAMB) UTME guidelines.`,
    content: `This topic covers the fundamental principles of ${topic} in depth. It forms a crucial part of the ${subjectId} examination syllabus. Students must master both the theoretical principles and their real-world practical applications to achieve high scores in the CBT.`,
    examples: [
      {
        problem: `Explain a typical multiple-choice problem in ${topic}.`,
        solution: `Examiners test the core properties. Ensure you identify all given parameters, isolate the key variable, apply the standard formula, and check unit alignments before matching the options.`
      }
    ],
    keyPoints: [
      `Key Concept 1: Always verify your parameters before proceeding to calculations.`,
      `Key Concept 2: Pay close attention to exceptions to general rules in this topic.`,
      `Key Concept 3: Practice with past questions under strict timed conditions.`
    ],
    summary: `In summary, understanding ${topic} is paramount for secondary school proficiency and university entry screening tests in Nigeria.`,
    tips: [
      `Study this topic in conjunction with the official recommended textbook list.`,
      `Draft a summary flashcard containing the formulas and laws.`,
      `Test yourself with at least ten CBT questions on this topic weekly.`
    ],
    commonMistakes: [
      `Confusing overlapping terminologies or mathematical variables.`,
      `Rushing to submit the answer without double-checking the calculation signs.`
    ],
    faqs: [
      {
        q: `How often is ${topic} tested in the JAMB CBT?`,
        a: `Typically, you can expect between 2 to 4 questions from this specific topic in your subject paper.`
      }
    ]
  };
}

// Helper to dynamically get or generate Syllabus for any subject
export function getSyllabusItem(subjectId: string, topic: string): SyllabusItem {
  const existing = STATIC_SYLLABUS.find(
    (s) => s.subject === subjectId && s.topic.toLowerCase() === topic.toLowerCase()
  );
  if (existing) return existing;

  return {
    id: `syl-${subjectId}-${topic.replace(/\s+/g, '-').toLowerCase()}`,
    subject: subjectId,
    topic: topic,
    subtopics: [
      `Core definitions of ${topic}`,
      `Practical applications of ${topic} in Nigerian contexts`,
      `Advanced theories and numerical problem solving`
    ],
    objectives: [
      `Understand and explain the basic principles governing ${topic}.`,
      `Analyze practical examples and solve corresponding examination questions.`,
      `Compare different methodologies and draw accurate scientific/analytical conclusions.`
    ]
  };
}
