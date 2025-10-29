import { generateStatements } from './lib/game.ts';

async function test() {
  try {
    const statements = await generateStatements('Space');
    console.log(JSON.stringify(statements, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();