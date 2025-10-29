import { Topic, Statement } from './types';

export async function generateStatements(topic: string): Promise<Statement[]> {
  const prompt = spark.llmPrompt`You are creating a "Two Truths and a Lie" game. Generate exactly 3 interesting statements about "${topic}":
- 2 statements should be TRUE and fascinating facts
- 1 statement should be FALSE but plausible and convincing
- Make all statements similar in style and length
- The lie should be subtle and not obviously false
- Each statement should be interesting enough to make players think

Return a JSON object with a single property "statements" containing an array of exactly 3 objects, each with:
- "text": the statement (string)
- "isLie": boolean (true if this is the false statement)
- "explanation": a brief explanation of why it's true or false (string)

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
    const response = await spark.llm(prompt, 'gpt-4o', true);
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
