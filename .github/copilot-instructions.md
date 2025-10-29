# AI Coding Agent Instructions

## Project Overview
This is a "Two Truths and a Lie" game built with React and TypeScript. The game generates 3 statements about a chosen topic - 2 true facts and 1 plausible lie. Players try to identify which statement is false.

## Core Concepts

### 1. Statement Generation
- All topics and statements are defined in `src/lib/game.ts`
- Each statement must have:
  ```typescript
  interface Statement {
    text: string;     // The statement text
    isLie: boolean;   // True if this is the false statement
    explanation: string; // Why it's true/false
  }
  ```
- Topics are strictly typed using the `Topic` type in `src/lib/types.ts`
- Local statement generation is preferred over LLM calls (see `generateLocalStatements`)

### 2. Game Flow
1. Player selects topic from `TopicSelector` component
2. `App.tsx` calls `generateStatements(topic)`
3. Three statements are displayed via `StatementCard` components
4. Player selects one statement
5. Game reveals correct answer and explanation
6. Score is updated and persisted via `useKV` hook

### 3. State Management
- Game state is managed in `App.tsx` using React hooks
- Possible states: `'topic-selection' | 'playing' | 'revealed'`
- Score persists between sessions using Spark's `useKV` hook

## Development Guidelines

### Statement Quality
- True statements must be factually accurate with verifiable sources
- False statements should be plausible and related to the topic
- All statements should be similar in style/length to avoid giving away the lie
- Include clear, educational explanations

### UI/UX Patterns
- Use motion.div for animations (see existing card transitions)
- Follow established color scheme for states:
  - Default: card bg-background
  - Correct: text-secondary
  - Incorrect: text-destructive
- Toast messages for feedback
- Responsive grid layout (2 columns mobile, 3 columns desktop)

### Error Handling
- Always provide fallback content if statement generation fails
- Use local statement data when LLM is unavailable
- Show friendly error messages via toast notifications
- Add error boundaries for component failures

## Common Tasks

### Adding New Topics
1. Add topic to `Topic` type in `types.ts`
2. Add topic to `TOPICS` array in `game.ts`
3. Add topic data to `LOCAL_FACTS` in `game.ts`:
   ```typescript
   {
     truths: [
       { text: "Fact 1...", explanation: "Because..." },
       { text: "Fact 2...", explanation: "Because..." }
     ],
     lie: { 
       text: "Plausible lie...", 
       explanation: "This is false because..." 
     }
   }
   ```

### Modifying Game Logic
- Game flow is controlled by `gameState` in `App.tsx`
- Statement generation and topic management in `game.ts`
- UI components in `components/` directory
- Styling uses Tailwind - see `tailwind.config.js`

### Testing Changes
1. Run `npm run dev` for local development
2. Test topic selection and statement generation
3. Verify animations and transitions
4. Check mobile responsiveness
5. Ensure score persistence works
6. Validate error handling

## Project Structure
- `src/`
  - `components/` - React components
  - `lib/` - Core game logic and types
  - `styles/` - Global styles and theme
  - `App.tsx` - Main game flow
  - `main.tsx` - App entry point