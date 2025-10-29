import { Topic, Statement } from './types';

// Local fallback facts used when the `spark` runtime / LLM isn't available (e.g. local dev).
const LOCAL_FACTS: Record<string, { truths: { text: string; explanation: string }[]; lie: { text: string; explanation: string } }> = {
  Animals: {
    truths: [
      { text: 'Octopuses have three hearts and blue blood.', explanation: 'They have two branchial hearts and one systemic heart; their blood uses copper-based hemocyanin, which appears blue.' },
      { text: 'Elephants can recognize themselves in a mirror.', explanation: 'Self-recognition has been shown in mirror tests for elephants, indicating high cognitive ability.' },
    ],
    lie: { text: 'Bats are blind and navigate only by touch.', explanation: "This is false — most bats can see, and they use echolocation (sound) rather than touch to navigate in the dark." },
  },
  History: {
    truths: [
      { text: 'The Great Wall of China was built over many centuries by different dynasties.', explanation: 'Construction began as early as the 7th century BC and continued through multiple dynasties.' },
      { text: 'The Rosetta Stone helped scholars read ancient Egyptian hieroglyphs.', explanation: 'Its multilingual inscriptions enabled Champollion to decode hieroglyphs by comparison.' },
    ],
    lie: { text: 'Vikings wore horned helmets into battle.', explanation: 'This is false — horned helmets are a later romanticized myth and not supported by archaeological evidence.' },
  },
  Space: {
    truths: [
      { text: 'Venus rotates in the opposite direction to most planets.', explanation: 'Venus has a retrograde rotation, so the Sun rises in the west there.' },
      { text: 'There are more stars visible in the universe than grains of sand on Earth.', explanation: 'Estimates of stars outnumber Earth’s sand grains by many orders of magnitude.' },
    ],
    lie: { text: 'The Moon is larger than the planet Mercury.', explanation: 'This is false — Mercury is larger than the Moon in diameter and mass.' },
  },
  Food: {
    truths: [
      { text: 'Honey can remain edible for thousands of years under the right conditions.', explanation: 'Honey’s low moisture and acidity resist spoilage; archaeologists found edible honey in ancient tombs.' },
      { text: 'Tomatoes are botanically fruits but often treated as vegetables in cooking.', explanation: 'Tomatoes develop from a flower and contain seeds, classifying them botanically as fruits.' },
    ],
    lie: { text: 'Sushi always contains raw fish.', explanation: 'This is false — sushi is a rice dish that can include cooked or pickled ingredients; sashimi is the raw-fish dish.' },
  },
  Sports: {
    truths: [
      { text: 'The modern Olympic Games were revived in the late 19th century.', explanation: 'Baron Pierre de Coubertin organized the first modern Olympics in 1896.' },
      { text: 'Basketball was invented by James Naismith in a gymnasium.', explanation: 'Naismith created the sport in 1891 to keep athletes fit indoors during winter.' },
    ],
    lie: { text: 'Soccer (football) was invented in the United States.', explanation: 'This is false — modern soccer rules originated in England in the 19th century.' },
  },
  Movies: {
    truths: [
      { text: 'Silent films often had live musical accompaniment in theaters.', explanation: 'Musicians commonly played live music to accompany the emotion and pacing of silent films.' },
      { text: 'Early filmmakers experimented with many camera tricks to tell stories.', explanation: 'Techniques like cross-cutting, dissolves, and tracking shots emerged early to expand cinematic language.' },
    ],
    lie: { text: 'All early films were colored using digital techniques.', explanation: 'This is false — early films, when colored, used hand-painting, tinting, or optical processes, not digital methods.' },
  },
  Science: {
    truths: [
      { text: 'Water expands when it freezes, which is why ice floats on liquid water.', explanation: 'The crystalline structure of ice makes it less dense than liquid water.' },
      { text: 'Light behaves both as a wave and a particle.', explanation: 'Quantum mechanics shows light exhibits wave–particle duality.' },
    ],
    lie: { text: 'Humans use only 10% of their brains.', explanation: 'This is false — neuroimaging shows activity across most of the brain, even during simple tasks.' },
  },
  Geography: {
    truths: [
      { text: 'Russia spans more than one continent, Europe and Asia.', explanation: 'A significant portion of Russia’s landmass lies in Asia and Europe.' },
      { text: 'Mount Everest is the tallest mountain above sea level.', explanation: 'Measured from sea level, Everest has the greatest elevation on Earth.' },
    ],
    lie: { text: 'The Sahara is the largest desert in the world by area.', explanation: 'This is misleading — Antarctica is technically the largest desert by area; Sahara is the largest hot desert.' },
  },
};

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function generateLocalStatements(topic: string): Promise<Statement[]> {
  const bucket = LOCAL_FACTS[topic] || null;

  if (!bucket) {
    // Generic fallback if topic not in our local map
    const genericTruths = [
      { text: `There are many interesting facts about ${topic}.`, explanation: `General true statement about ${topic}.` },
      { text: `People often learn surprising things when studying ${topic}.`, explanation: `Generic true statement.` },
    ];
    const genericLie = { text: `Everything commonly said about ${topic} is a myth.`, explanation: `This is false — some claims are myths, but not everything.` };

    const items = [
      { text: genericTruths[0].text, isLie: false, explanation: genericTruths[0].explanation },
      { text: genericTruths[1].text, isLie: false, explanation: genericTruths[1].explanation },
      { text: genericLie.text, isLie: true, explanation: genericLie.explanation },
    ];

    return shuffle(items);
  }

  const truths = bucket.truths.slice();
  // pick two random truths (or the available ones)
  shuffle(truths);
  const chosenTruths = truths.slice(0, 2);
  const lie = bucket.lie;

  const items = [
    { text: chosenTruths[0].text, isLie: false, explanation: chosenTruths[0].explanation },
    { text: chosenTruths[1].text, isLie: false, explanation: chosenTruths[1].explanation },
    { text: lie.text, isLie: true, explanation: lie.explanation },
  ];

  return shuffle(items);
}

export async function generateStatements(topic: string): Promise<Statement[]> {
  // If the spark runtime (LLM) is available, prefer the LLM path. Otherwise return a deterministic local fallback.
  const globalAny: any = globalThis as any;
  if (!globalAny.spark || typeof globalAny.spark.llm !== 'function') {
    try {
      return await generateLocalStatements(topic);
    } catch (err) {
      console.error('Local fallback failed:', err);
      throw err;
    }
  }

    const prompt = globalAny.spark.llmPrompt`You are creating a "Two Truths and a Lie" game. Generate exactly 3 interesting statements about "${topic}":

Return a JSON object with a single property "statements" containing an array of exactly 3 objects, each with:

Randomize which position (1st, 2nd, or 3rd) the lie appears in.

Example format:
{
  "statements": [
    {"text": "Statement here", "isLie": false, "explanation": "This is true because..."},
    {"text": "Statement here", "isLie": true, "explanation": "This is false because..."},
    {"text": "Statement here", "isLie": false, "explanation": "This is true because..."}
  ]
}`;

  try {
      const response = await globalAny.spark.llm(prompt, 'gpt-4o', true);
    const data = JSON.parse(response);

    if (!data.statements || !Array.isArray(data.statements) || data.statements.length !== 3) {
      throw new Error('Invalid response format');
    }

    const lieCount = data.statements.filter((s: Statement) => s.isLie).length;
    if (lieCount !== 1) {
      throw new Error('Must have exactly one lie');
    }

    return data.statements;
  } catch (error) {
    console.error('Error generating statements:', error);
    throw error;
  }
}

export const TOPICS: Topic[] = [
  'Animals',
  'History', 
  'Space',
  'Food',
  'Sports',
  'Movies',
  'Science',
  'Geography'
];

export function getRandomTopic(): Topic {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}
