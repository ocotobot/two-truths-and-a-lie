import { Card } from '@/components/ui/card';
import { Sparkle } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { TOPICS } from '@/lib/game';
import type { Topic } from '@/lib/types';

interface TopicSelectorProps {
  onSelectTopic: (topic: string) => void;
  disabled?: boolean;
}

export function TopicSelector({ onSelectTopic, disabled }: TopicSelectorProps) {
  const handleSurprise = () => {
    const topics: Topic[] = TOPICS;
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    onSelectTopic(randomTopic);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {TOPICS.map((topic, index) => (
          <motion.div
            key={topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'
              }`}
              onClick={() => !disabled && onSelectTopic(topic)}
            >
              <h3 className="text-xl font-semibold text-center">{topic}</h3>
            </Card>
          </motion.div>
        ))}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: TOPICS.length * 0.05 }}
        >
          <Card
            className={`p-6 cursor-pointer transition-all duration-200 bg-accent text-accent-foreground hover:shadow-lg hover:-translate-y-1 border-2 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'
            }`}
            onClick={() => !disabled && handleSurprise()}
          >
            <div className="flex flex-col items-center gap-2">
              <Sparkle size={28} weight="fill" />
              <h3 className="text-xl font-semibold text-center">Surprise Me</h3>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
