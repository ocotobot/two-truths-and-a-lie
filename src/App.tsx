import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import { TopicSelector } from '@/components/TopicSelector';
import { StatementCard } from '@/components/StatementCard';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { HowToPlay } from '@/components/HowToPlay';
import { DifficultySelector } from '@/components/DifficultySelector';
import { generateStatements } from '@/lib/game';
import { ArrowClockwise } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Statement, Score, GameState, Difficulty } from '@/lib/types';

function App() {
  const [score, setScore] = useKV<Score>('game-score', { correct: 0, incorrect: 0 });
  const [difficulty, setDifficulty] = useKV<Difficulty>('game-difficulty', 'medium');
  const [gameState, setGameState] = useState<GameState>('topic-selection');
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [statements, setStatements] = useState<Statement[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTopicSelect = async (topic: string) => {
    setCurrentTopic(topic);
    setIsLoading(true);
    setSelectedIndex(null);

    try {
      toast.loading('Generating statements...', { id: 'loading' });
      console.log('Generating statements for topic:', topic, 'difficulty:', difficulty);
      const newStatements = await generateStatements(topic, difficulty || 'medium');
      console.log('Generated statements:', newStatements);
      
      if (!newStatements || !Array.isArray(newStatements) || newStatements.length !== 3) {
        throw new Error(`Invalid statements generated: ${JSON.stringify(newStatements)}`);
      }
      
      setStatements(newStatements);
      setGameState('playing');
      toast.dismiss('loading');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Statement generation error:', errorMessage);
      toast.error(`Failed to generate statements: ${errorMessage}`, { id: 'loading' });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatementSelect = (index: number) => {
    if (gameState !== 'playing') return;

    setSelectedIndex(index);
    setGameState('revealed');

    const selectedStatement = statements[index];
    const isCorrect = selectedStatement.isLie;

    setScore((currentScore) => {
      if (!currentScore) return { correct: isCorrect ? 1 : 0, incorrect: isCorrect ? 0 : 1 };
      return {
        correct: currentScore.correct + (isCorrect ? 1 : 0),
        incorrect: currentScore.incorrect + (isCorrect ? 0 : 1),
      };
    });

    if (isCorrect) {
      toast.success('Correct! You found the lie! 🎉');
    } else {
      toast.error('Wrong guess! That was actually true. 😅');
    }
  };

  const handleNewRound = () => {
    setGameState('topic-selection');
    setCurrentTopic('');
    setStatements([]);
    setSelectedIndex(null);
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
            Two Truths and a Lie
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Can you spot the false statement? Test your knowledge and learn something new!
          </p>
        </motion.div>

        <div className="flex justify-center">
          <ScoreDisplay score={score || { correct: 0, incorrect: 0 }} />
        </div>

        <div className="flex justify-center">
          <HowToPlay />
        </div>

        <Separator />

        <AnimatePresence mode="wait">
          {gameState === 'topic-selection' && (
            <motion.div
              key="topic-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <DifficultySelector
                selectedDifficulty={difficulty || 'medium'}
                onSelectDifficulty={setDifficulty}
                disabled={isLoading}
              />
              <h2 className="text-2xl font-semibold text-center">Choose a Topic</h2>
              <TopicSelector onSelectTopic={handleTopicSelect} disabled={isLoading} />
            </motion.div>
          )}

          {(gameState === 'playing' || gameState === 'revealed') && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className="text-2xl font-semibold">Topic: {currentTopic}</h2>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary capitalize">
                    {difficulty || 'medium'}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {gameState === 'playing'
                    ? 'Which statement is the lie?'
                    : 'Here are the answers!'}
                </p>
              </div>

              <div className="space-y-4 max-w-4xl mx-auto">
                {statements.map((statement, index) => (
                  <StatementCard
                    key={index}
                    statement={statement}
                    index={index}
                    isRevealed={gameState === 'revealed'}
                    selectedIndex={selectedIndex}
                    onSelect={() => handleStatementSelect(index)}
                    disabled={isLoading || gameState === 'revealed'}
                  />
                ))}
              </div>

              {gameState === 'revealed' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center pt-4"
                >
                  <Button
                    size="lg"
                    onClick={handleNewRound}
                    className="gap-2 text-base px-8"
                  >
                    <ArrowClockwise size={20} weight="bold" />
                    New Round
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
}

export default App;
