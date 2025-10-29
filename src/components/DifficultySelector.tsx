import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { Difficulty } from '@/lib/types';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const DIFFICULTY_INFO = {
  easy: {
    label: 'Easy',
    description: 'Obvious lies and exaggerated claims',
    emoji: '😊',
  },
  medium: {
    label: 'Medium',
    description: 'Plausible but detectably wrong',
    emoji: '🤔',
  },
  hard: {
    label: 'Hard',
    description: 'Highly convincing and subtle',
    emoji: '🧠',
  },
} as const;

export function DifficultySelector({
  selectedDifficulty,
  onSelectDifficulty,
  disabled,
}: DifficultySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-1">Choose Difficulty</h3>
            <p className="text-sm text-muted-foreground">
              How challenging do you want the lies to be?
            </p>
          </div>

          <ToggleGroup
            type="single"
            value={selectedDifficulty}
            onValueChange={(value) => {
              if (value && !disabled) {
                onSelectDifficulty(value as Difficulty);
              }
            }}
            className="grid grid-cols-3 gap-2 w-full"
          >
            {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((difficulty) => {
              const info = DIFFICULTY_INFO[difficulty];
              const isSelected = selectedDifficulty === difficulty;

              return (
                <ToggleGroupItem
                  key={difficulty}
                  value={difficulty}
                  disabled={disabled}
                  className={`flex flex-col items-center justify-center h-auto py-4 px-2 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                      : ''
                  }`}
                >
                  <span className="text-2xl mb-1">{info.emoji}</span>
                  <span className="font-semibold text-sm mb-1">{info.label}</span>
                  <span className="text-xs text-center leading-tight opacity-80">
                    {info.description}
                  </span>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      </Card>
    </motion.div>
  );
}
