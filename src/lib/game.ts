import { Topic, Statement } from './types';

// Local fallback facts used when the `spark` runtime / LLM isn't available (e.g. local dev).
const LOCAL_FACTS: Record<string, { truths: { text: string; explanation: string }[]; lie: { text: string; explanation: string } }> = {
  Animals: {
    truths: [
      { text: 'Octopuses have three hearts and blue blood.', explanation: 'They have two branchial hearts and one systemic heart; their blood uses copper-based hemocyanin, which appears blue.' },
      { text: 'Elephants can recognize themselves in a mirror.', explanation: 'Self-recognition has been shown in mirror tests for elephants, indicating high cognitive ability.' },
      { text: 'A hummingbird\'s heart can beat over 1,000 times per minute.', explanation: 'During flight, their hearts can reach 1,260 beats per minute to support their high metabolism.' },
      { text: 'Sloths can hold their breath for up to 40 minutes underwater.', explanation: 'Their slow metabolism allows them to stay submerged far longer than most mammals.' },
    ],
    lie: { text: 'Bats are blind and navigate only by touch.', explanation: 'This is false - most bats can see quite well, and they use echolocation (sound) rather than touch to navigate in the dark.' },
  },
  History: {
    truths: [
      { text: 'The Great Wall of China was built over many centuries by different dynasties.', explanation: 'Construction began as early as the 7th century BC and continued through multiple dynasties.' },
      { text: 'The Rosetta Stone helped scholars read ancient Egyptian hieroglyphs.', explanation: 'Its multilingual inscriptions enabled Champollion to decode hieroglyphs by comparison.' },
      { text: 'Ancient Romans used urine as mouthwash.', explanation: 'They used urine\'s ammonia content to help whiten teeth and fight oral bacteria.' },
      { text: 'Cleopatra lived closer in time to the first Pizza Hut than to the building of the Great Pyramids.', explanation: 'Cleopatra lived around 30 BC, while the pyramids were built around 2500 BC. Pizza Hut was founded in 1958.' },
    ],
    lie: { text: 'Vikings wore horned helmets into battle.', explanation: 'This is false - horned helmets are a 19th-century artistic invention. No authentic Viking helmet has ever been found with horns.' },
  },
  Space: {
    truths: [
      { text: 'Venus rotates in the opposite direction to most planets.', explanation: 'Venus has a retrograde rotation, making it the only planet where the Sun rises in the west.' },
      { text: 'There are more stars visible in the universe than grains of sand on Earth.', explanation: 'Estimates suggest over 70 sextillion observable stars, far outnumbering Earth\'s sand grains.' },
      { text: 'A day on Venus is longer than its year.', explanation: 'Venus takes 243 Earth days to rotate once on its axis but only 225 Earth days to orbit the Sun.' },
      { text: 'Saturn\'s moon Titan has liquid methane lakes and seas.', explanation: 'Titan is the only world besides Earth known to have stable bodies of surface liquid.' },
    ],
    lie: { text: 'The Moon is larger than the planet Mercury.', explanation: 'This is false - Mercury has a diameter of 3,032 miles, while the Moon\'s diameter is only 2,159 miles.' },
  },
  Food: {
    truths: [
      { text: 'Honey can remain edible for thousands of years under the right conditions.', explanation: 'Honey\'s low moisture content and high acidity prevent bacterial growth; edible honey has been found in ancient Egyptian tombs.' },
      { text: 'Tomatoes are botanically fruits but often treated as vegetables in cooking.', explanation: 'Tomatoes develop from a flower and contain seeds, making them fruits botanically.' },
      { text: 'White chocolate contains no cocoa solids.', explanation: 'It\'s made from cocoa butter, sugar, and milk solids, but lacks the cocoa solids found in milk and dark chocolate.' },
      { text: 'The most expensive spice in the world is saffron.', explanation: 'It takes about 150-170 flowers to yield just one gram of saffron threads.' },
    ],
    lie: { text: 'Sushi must always contain raw fish to be considered authentic.', explanation: 'This is false - sushi refers to vinegared rice; it can include raw fish, cooked ingredients, or be completely vegetarian.' },
  },
  Sports: {
    truths: [
      { text: 'The modern Olympic Games were revived in the late 19th century.', explanation: 'Baron Pierre de Coubertin organized the first modern Olympics in Athens, 1896.' },
      { text: 'Basketball was invented by James Naismith in a gymnasium.', explanation: 'Naismith created the sport in 1891 using peach baskets and a soccer ball.' },
      { text: 'The first World Cup was won by Uruguay in 1930.', explanation: 'Uruguay hosted and won the inaugural FIFA World Cup, defeating Argentina in the final.' },
      { text: 'Golf is the only sport to have been played on the Moon.', explanation: 'Astronaut Alan Shepard hit two golf balls on the Moon during the Apollo 14 mission in 1971.' },
    ],
    lie: { text: 'American football was invented before soccer/association football.', explanation: 'This is false - modern soccer rules were codified in England in 1863, while American football evolved from rugby in the 1880s.' },
  },
  Movies: {
    truths: [
      { text: 'Silent films often had live musical accompaniment in theaters.', explanation: 'Musicians played live to enhance the emotional impact and cover projector noise.' },
      { text: 'The first feature-length animated film was made in Argentina.', explanation: 'El Apostol, released in 1917, was the world\'s first animated feature film.' },
      { text: 'The famous MGM lion roar was recorded in 1929.', explanation: 'The roar of Leo the Lion has been used by MGM since the beginning of sound films.' },
      { text: 'Alfred Hitchcock made a cameo appearance in almost all his films.', explanation: 'He appeared briefly in 39 of his 52 surviving major films.' },
    ],
    lie: { text: 'Color movies were invented after sound was added to films.', explanation: 'This is false - hand-colored films existed in the 1890s, while synchronized sound wasn\'t widely used until the late 1920s.' },
  },
  Science: {
    truths: [
      { text: 'Water expands when it freezes, unlike most substances.', explanation: 'The crystalline structure of ice makes it less dense than liquid water, causing it to float.' },
      { text: 'Light behaves as both a wave and a particle.', explanation: 'This quantum mechanical principle is known as wave-particle duality.' },
      { text: 'Honey never spoils if properly sealed.', explanation: 'Its low moisture content and high acidity create an environment where bacteria cannot survive.' },
      { text: 'A teaspoon of neutron star material would weigh billions of tons.', explanation: 'Neutron stars are so dense that a teaspoon would weigh about 10 billion tons.' },
    ],
    lie: { text: 'Lightning never strikes the same place twice.', explanation: 'This is false - tall buildings like the Empire State Building are struck by lightning around 25 times per year.' },
  },
  Geography: {
    truths: [
      { text: 'Russia spans 11 time zones.', explanation: 'It\'s the only country that covers such a large longitudinal distance.' },
      { text: 'The entire world\'s population could fit inside Los Angeles if standing shoulder to shoulder.', explanation: 'The city\'s 503 square miles could theoretically hold over 7 billion people.' },
      { text: 'Alaska is simultaneously the westernmost and easternmost U.S. state.', explanation: 'The Aleutian Islands cross the 180° meridian, making Alaska both the westernmost and easternmost state.' },
      { text: 'Point Nemo is so remote that the nearest humans are often astronauts.', explanation: 'This Pacific Ocean location is farther from land than any other point, often making ISS astronauts the closest humans.' },
    ],
    lie: { text: 'The Great Wall of China is visible from space with the naked eye.', explanation: 'This is false - while many human structures are visible from low Earth orbit, the Great Wall is too narrow and often blends with the surrounding terrain.' },
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

// Generate statements for a given topic using predefined local facts for reliability
export async function generateStatements(topic: string): Promise<Statement[]> {
  try {
    return await generateLocalStatements(topic);
  } catch (err) {
    console.error('Failed to generate statements:', { topic, error: err });
    // Return generic statements as a last resort
    const genericTruths = [
      { text: `There are many interesting facts about ${topic}.`, explanation: `General true statement about ${topic}.` },
      { text: `People often learn surprising things when studying ${topic}.`, explanation: `Generic true statement.` },
    ];
    const genericLie = { 
      text: `Everything commonly said about ${topic} is a myth.`, 
      explanation: `This is false — some claims are myths, but not everything.` 
    };

    const items = [
      { text: genericTruths[0].text, isLie: false, explanation: genericTruths[0].explanation },
      { text: genericTruths[1].text, isLie: false, explanation: genericTruths[1].explanation },
      { text: genericLie.text, isLie: true, explanation: genericLie.explanation },
    ];
    
    return shuffle(items);
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
] as const;

export function getRandomTopic(): Topic {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}
