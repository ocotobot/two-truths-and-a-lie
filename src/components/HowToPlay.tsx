import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Question } from '@phosphor-icons/react';
import { useState } from 'react';

export function HowToPlay() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Question size={20} weight="fill" />
          How to Play
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">🎯 Objective</h3>
            <p className="text-muted-foreground leading-relaxed">
              Identify the false statement among three AI-generated facts. Two statements are true, one is a cleverly disguised lie!
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">📚 How to Play</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Choose a topic that interests you (or select "Surprise Me" for a random topic)</li>
              <li>Read all three statements carefully</li>
              <li>Click on the statement you believe is the lie</li>
              <li>See if you guessed correctly and learn the explanation</li>
              <li>Click "New Round" to play again with a different topic</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">💡 Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>The lie is designed to be plausible - think critically!</li>
              <li>All three statements are written in a similar style</li>
              <li>Your score is saved between sessions</li>
            </ul>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
