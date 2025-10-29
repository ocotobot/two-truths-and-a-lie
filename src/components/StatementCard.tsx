import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import type { Statement } from '@/lib/types';

interface StatementCardProps {
  statement: Statement;
  index: number;
  isRevealed: boolean;
  selectedIndex: number | null;
  onSelect: () => void;
  disabled: boolean;
}

export function StatementCard({
  statement,
  index,
  isRevealed,
  selectedIndex,
  onSelect,
  disabled
}: StatementCardProps) {
  const isSelected = selectedIndex === index;
  const wasCorrectGuess = isRevealed && isSelected && statement.isLie;
  const wasWrongGuess = isRevealed && isSelected && !statement.isLie;
  const isTheLie = isRevealed && statement.isLie;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!disabled && !isRevealed ? { y: -4 } : {}}
      whileTap={!disabled && !isRevealed ? { scale: 0.98 } : {}}
    >
      <Card
        className={`p-8 cursor-pointer transition-all duration-300 relative overflow-hidden ${
          disabled || isRevealed ? 'cursor-default' : 'hover:shadow-xl'
        } ${
          wasCorrectGuess
            ? 'border-secondary border-3 bg-secondary/5'
            : wasWrongGuess
            ? 'border-destructive border-3 bg-destructive/5'
            : isTheLie
            ? 'border-secondary border-3 bg-secondary/5'
            : isRevealed
            ? 'border-muted bg-muted/20'
            : 'border-2 hover:border-primary'
        }`}
        onClick={() => !disabled && !isRevealed && onSelect()}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="text-lg leading-relaxed">{statement.text}</p>
          </div>
        </div>

        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-border"
          >
            <div className="flex items-start gap-3">
              {statement.isLie ? (
                <XCircle size={24} weight="fill" className="text-destructive flex-shrink-0 mt-1" />
              ) : (
                <CheckCircle size={24} weight="fill" className="text-secondary flex-shrink-0 mt-1" />
              )}
              <div>
                <p className="font-semibold mb-1">
                  {statement.isLie ? '❌ This is the LIE!' : '✅ This is TRUE!'}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {statement.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {wasCorrectGuess && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            className="absolute top-4 right-4 text-4xl"
          >
            🎉
          </motion.div>
        )}

        {wasWrongGuess && (
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [-10, 10, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="absolute top-4 right-4 text-4xl"
          >
            😅
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
