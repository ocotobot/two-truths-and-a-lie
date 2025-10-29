# Planning Guide

A playful and educational guessing game where players identify the false statement among three AI-generated facts about various topics, challenging their knowledge while learning new information.

**Experience Qualities**:
1. **Playful** - The game should feel lighthearted and fun with celebratory animations and emoji reactions that make learning enjoyable
2. **Engaging** - Each round should be intriguing with compelling statements that make players think critically and want to play again
3. **Educational** - Players should learn something new whether they guess correctly or not, with clear explanations that add value

**Complexity Level**: Light Application (multiple features with basic state)
  - This is a game with topic selection, AI-generated content, score tracking, and interactive feedback requiring state management but no authentication

## Essential Features

**Topic Selection**
- Functionality: Display 9 topic options (Animals, History, Space, Food, Sports, Movies, Science, Geography, Surprise Me) as selectable cards
- Purpose: Allows players to choose areas of interest or get random topics for variety
- Trigger: On game start or after clicking "New Round"
- Progression: Game start → Topic grid appears → Player clicks topic → Loading state → Statements appear
- Success criteria: Selected topic generates relevant statements within 2-3 seconds

**AI Statement Generation**
- Functionality: Generate three compelling statements (two truths, one lie) about the selected topic using the Spark LLM API
- Purpose: Creates unique, educational content for each round that tests player knowledge
- Trigger: When player selects a topic
- Progression: Topic selected → API call with prompt → Receive 3 statements + explanations → Display as cards
- Success criteria: Statements are factually accurate for truths, plausibly false for the lie, and interesting enough to engage players

**Statement Selection & Reveal**
- Functionality: Display three clickable statement cards; when clicked, reveal if the guess was correct with animation and explanation
- Purpose: Core game mechanic that provides immediate feedback and learning
- Trigger: Player clicks any statement card
- Progression: Statement clicked → Card locks → Animated reveal (correct/wrong) → Show which was the lie → Display explanation → Show New Round button
- Success criteria: Clear visual feedback, smooth animations, and informative explanations appear immediately

**Score Tracking**
- Functionality: Maintain persistent count of correct and incorrect guesses across sessions
- Purpose: Adds progression and encourages replay to improve accuracy
- Trigger: Updates when player makes a guess
- Progression: Guess made → Score increments → Display updates → Persist to storage
- Success criteria: Score persists between sessions and updates in real-time

**How to Play Instructions**
- Functionality: Collapsible section explaining game rules and objectives
- Purpose: Helps new players understand the game quickly
- Trigger: Always visible in collapsed state, expands on click
- Progression: Player clicks "How to Play" → Section expands → Shows rules → Player can collapse
- Success criteria: Rules are clear, concise, and easy to understand

## Edge Case Handling

- **API Failures**: Show friendly error message with retry button if LLM call fails
- **Slow Network**: Display loading spinner with "Generating statements..." message during API calls
- **Invalid Responses**: Validate LLM output has exactly 3 statements; regenerate if malformed
- **Rapid Clicking**: Disable statement cards after first selection to prevent multiple guesses
- **Empty Topic**: "Surprise Me" randomly selects from available topics

## Design Direction

The design should feel playful yet sophisticated with a vibrant color palette that evokes curiosity and fun. It should strike a balance between educational credibility and game-like excitement, with smooth animations that celebrate success without being overwhelming. The interface should be minimal with plenty of breathing room, allowing the content (statements) to be the hero while UI elements provide clear wayfinding.

## Color Selection

Triadic color scheme to create vibrant, energetic feeling while maintaining clear visual hierarchy and excellent readability

- **Primary Color**: Vibrant Purple (oklch(0.55 0.22 290)) - Represents curiosity and intelligence, used for main CTAs and headers
- **Secondary Colors**: Teal (oklch(0.65 0.15 200)) for correct answers and supporting elements; Coral (oklch(0.70 0.18 30)) for incorrect feedback and accents
- **Accent Color**: Bright Yellow-Orange (oklch(0.80 0.18 70)) for hover states, "Surprise Me" option, and celebratory moments
- **Foreground/Background Pairings**: 
  - Background (Soft Cream oklch(0.98 0.01 90)): Dark Purple text (oklch(0.25 0.15 290)) - Ratio 11.2:1 ✓
  - Primary (Vibrant Purple oklch(0.55 0.22 290)): White text (oklch(1 0 0)) - Ratio 6.8:1 ✓
  - Secondary (Teal oklch(0.65 0.15 200)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Accent (Yellow-Orange oklch(0.80 0.18 70)): Dark Purple text (oklch(0.25 0.15 290)) - Ratio 6.2:1 ✓
  - Card (White oklch(1 0 0)): Dark text (oklch(0.25 0.15 290)) - Ratio 13.5:1 ✓
  - Muted (Light Purple oklch(0.95 0.05 290)): Medium Purple text (oklch(0.45 0.12 290)) - Ratio 5.1:1 ✓

## Font Selection

Typography should feel friendly and approachable while maintaining clarity, using rounded sans-serif fonts that communicate playfulness without sacrificing legibility

- **Typographic Hierarchy**:
  - H1 (Game Title): Fredoka Bold/36px/tight letter-spacing (-0.5px) - Playful rounded sans-serif for main heading
  - H2 (Topic Names): Fredoka Medium/20px/normal letter-spacing - Consistent with title but smaller
  - Body (Statements): Inter Regular/17px/relaxed line-height (1.6) - Clean, readable for longer text
  - Small (Score, Labels): Inter Medium/14px/normal letter-spacing - Clear hierarchy from body text
  - Button Text: Inter SemiBold/16px/wide letter-spacing (0.5px) - Strong, actionable appearance

## Animations

Animations should punctuate moments of discovery and success, creating micro-celebrations when players guess correctly while providing gentle feedback for incorrect guesses, all while maintaining snappy performance

- **Purposeful Meaning**: Card flips reveal answers with playful bounce, confetti or emoji reactions burst on correct guesses, and gentle shake on wrong answers communicates feedback personality
- **Hierarchy of Movement**: Statement cards have subtle hover lift (priority 1), reveal animations are prominent but quick (priority 2), score updates with gentle pulse (priority 3), and background reactions are subtle and non-blocking (priority 4)

## Component Selection

- **Components**: 
  - Card: For topic selection grid and statement display with hover effects
  - Button: For "New Round" and "Surprise Me" actions with variant styling (primary/secondary)
  - Badge: For score display with colored variants for correct/incorrect counts
  - Collapsible: For "How to Play" section with smooth accordion animation
  - Alert: For showing explanations after reveal with appropriate coloring (success/destructive)
  - Separator: To divide sections cleanly
  
- **Customizations**: 
  - Topic cards with gradient backgrounds using Tailwind
  - Statement cards with flip animation using framer-motion
  - Emoji reactions (🎉 ✨ 🎯 for correct, 😅 💭 🤔 for incorrect) positioned absolutely
  - Score badges with pulsing animation on update
  
- **States**: 
  - Topic cards: Default (elevated shadow), Hover (lift + border glow), Active (scale down), Disabled during loading (opacity 50%)
  - Statement cards: Default (clean white), Hover (subtle shadow + lift when active), Selected (border highlight), Revealed Correct (green border + confetti), Revealed Wrong (red border + shake), Disabled (cursor not-allowed)
  - Buttons: Primary (purple background), Secondary (outline), Loading (spinner + disabled), Success (green background)
  
- **Icon Selection**: 
  - SparklesIcon for "Surprise Me" 
  - QuestionMarkCircledIcon for "How to Play"
  - CheckCircleIcon for correct guesses
  - XCircleIcon for incorrect guesses
  - ArrowPathIcon for "New Round"
  
- **Spacing**: 
  - Container padding: p-6 on mobile, p-8 on desktop
  - Card gaps: gap-4 for topic grid, gap-6 for statement cards
  - Section spacing: space-y-6 for main layout sections
  - Internal card padding: p-6 for topics, p-8 for statements
  
- **Mobile**: 
  - Topic grid: 2 columns on mobile (grid-cols-2), 3 columns on tablet (md:grid-cols-3)
  - Statement cards: Stack vertically on mobile, remain vertical on all sizes for readability
  - Font sizes reduce slightly: H1 28px mobile / 36px desktop, Body 16px mobile / 17px desktop
  - Touch targets minimum 44px with generous padding
  - Score display moves to top on mobile as sticky header
