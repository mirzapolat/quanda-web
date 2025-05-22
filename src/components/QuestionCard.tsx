
import { Card, CardContent } from "@/components/ui/card";
import { Question } from "@/utils/questionDeck";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  animationClass?: string;
  onCardClick: () => void; // Add onClick handler prop
}

export function QuestionCard({ question, animationClass, onCardClick }: QuestionCardProps) {
  return (
    <Card 
      className={cn(
        "w-full max-w-xl h-96 flex items-center justify-center shadow-lg", 
        "border-2 border-accent cursor-pointer hover:border-primary transition-colors",
        animationClass
      )}
      onClick={onCardClick} // Add the click handler
    >
      <CardContent className="flex items-center justify-center p-6 h-full w-full">
        <p className="text-2xl font-medium text-center">{question.text}</p>
      </CardContent>
    </Card>
  );
}
