
import { Card, CardContent } from "@/components/ui/card";
import { Question } from "@/utils/questionDeck";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  animationClass?: string;
  onCardClick: () => void;
}

export function QuestionCard({ question, animationClass, onCardClick }: QuestionCardProps) {
  return (
    <Card 
      className={cn(
        "w-full max-w-xl h-96 flex items-center justify-center", 
        "border-0 rounded-3xl hover:shadow-2xl transition-shadow shadow-[0_0_20px_rgba(0,0,0,0.1)] bg-white dark:bg-gray-800",
        animationClass
      )}
      onClick={onCardClick}
    >
      <CardContent className="flex items-center justify-center p-6 h-full w-full">
        <p className="text-2xl font-medium text-center">{question.text}</p>
      </CardContent>
    </Card>
  );
}
