import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import type { Score } from '@/lib/types';

interface ScoreDisplayProps {
  score: Score;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const total = score.correct + score.incorrect;
  const percentage = total > 0 ? Math.round((score.correct / total) * 100) : 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Score:</span>
        <motion.div
          key={score.correct}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        >
          <Badge variant="secondary" className="px-3 py-1 text-base">
            ✅ {score.correct}
          </Badge>
        </motion.div>
        <motion.div
          key={score.incorrect}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        >
          <Badge variant="destructive" className="px-3 py-1 text-base">
            ❌ {score.incorrect}
          </Badge>
        </motion.div>
      </div>
      {total > 0 && (
        <Badge variant="outline" className="px-3 py-1 text-base">
          {percentage}% correct
        </Badge>
      )}
    </div>
  );
}
