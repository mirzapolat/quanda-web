import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/QuestionCard";
import { FileUploader } from "@/components/FileUploader";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { 
  Question, 
  getRandomQuestion, 
  markAsSeen, 
  resetSeenStatus,
  allQuestionsSeen
} from "@/utils/questionDeck";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [history, setHistory] = useState<Question[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showUploader, setShowUploader] = useState<boolean>(true);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  // Effect to handle initial card loading
  useEffect(() => {
    if (questions.length > 0 && currentQuestion === null) {
      nextQuestion();
    }
  }, [questions]);

  // Handle loading a deck
  const handleDeckLoaded = (loadedQuestions: Question[]) => {
    // Reset everything first before loading the new deck
    resetDeck();
    
    // Then set the new questions
    setQuestions(loadedQuestions);
    setShowUploader(false);
  };

  // Reset the deck - mark all questions as unseen
  const resetDeck = () => {
    if (questions.length === 0) {
      toast.error("No deck is currently loaded");
      return;
    }
    
    const resetQuestions = resetSeenStatus([...questions]);
    setQuestions(resetQuestions);
    
    setHistory([]);
    setHistoryIndex(-1);
    setCurrentQuestion(null);
    setDirection(null);
    
    // Get a new random question immediately
    const question = getRandomQuestion(resetQuestions);
    if (question) {
      const updatedQuestions = markAsSeen(resetQuestions, question.id);
      setQuestions(updatedQuestions);
      setHistory([question]);
      setHistoryIndex(0);
      setCurrentQuestion(question);
    }
    
    toast.success("Deck has been reset");
  };

  // Import a new deck
  const importNewDeck = () => {
    setShowUploader(true);
    resetDeck();
    setQuestions([]);
  };

  // Go to next question
  const nextQuestion = () => {
    if (questions.length === 0) return;
    
    // Check if all questions have been seen, if so reset seen status
    let questionsToUse = [...questions];
    if (allQuestionsSeen(questionsToUse)) {
      questionsToUse = resetSeenStatus(questionsToUse);
      toast.info("All questions have been seen, starting from the beginning");
      setQuestions(questionsToUse);
    }
    
    // Get a random question
    const question = getRandomQuestion(questionsToUse);
    if (!question) return;
    
    // Mark as seen and update state
    const updatedQuestions = markAsSeen(questionsToUse, question.id);
    setQuestions(updatedQuestions);
    
    // Add to history if moving forward
    if (historyIndex === history.length - 1) {
      setHistory([...history, question]);
      setHistoryIndex(history.length);
    } else {
      // Replace future history with this new branch
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(question);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }

    setDirection('right');
    // Set after animation starts
    setTimeout(() => {
      setCurrentQuestion(question);
      // Reset direction after animation completes
      setTimeout(() => setDirection(null), 300);
    }, 10);
  };

  // Go to previous question
  const previousQuestion = () => {
    if (historyIndex <= 0) {
      toast.info("You're at the beginning of your history");
      return;
    }
    
    setDirection('left');
    // Set after animation starts
    setTimeout(() => {
      setHistoryIndex(historyIndex - 1);
      setCurrentQuestion(history[historyIndex - 1]);
      // Reset direction after animation completes
      setTimeout(() => setDirection(null), 300);
    }, 10);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        previousQuestion();
      } else if (e.key === 'ArrowRight') {
        nextQuestion();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, questions]);

  // Animation classes based on direction
  const getAnimationClass = () => {
    if (direction === 'right') {
      return 'animate-slide-in-right';
    } else if (direction === 'left') {
      return 'animate-slide-in-left';
    }
    return '';
  };

  // Check if we have history to go back to
  const hasHistory = history.length > 1 && historyIndex > 0;

  // Check if a deck is loaded
  const isDeckLoaded = questions.length > 0;

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header 
          onReset={resetDeck} 
          onImportNew={importNewDeck} 
          isDeckLoaded={isDeckLoaded}
        />
        
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          {showUploader ? (
            <div className="w-full max-w-xl">
              <h2 className="text-2xl font-bold text-center mb-6">
                Import Question Deck
              </h2>
              <FileUploader onDeckLoaded={handleDeckLoaded} />
            </div>
          ) : currentQuestion ? (
            <div className="flex flex-col items-center w-full space-y-8">
              <div className="question-card w-full max-w-xl relative">
                <QuestionCard 
                  question={currentQuestion} 
                  animationClass={getAnimationClass()} 
                />
              </div>
              
              <div className="flex items-center justify-center space-x-6">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-16 w-16 rounded-full"
                  onClick={previousQuestion}
                  disabled={!hasHistory}
                >
                  <ArrowLeft className="h-6 w-6" />
                  <span className="sr-only">Previous question</span>
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  {historyIndex + 1} / {history.length}
                </div>
                
                <Button 
                  size="lg" 
                  className="h-16 w-16 rounded-full" 
                  onClick={nextQuestion}
                >
                  <ArrowRight className="h-6 w-6" />
                  <span className="sr-only">Next question</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl">No questions loaded yet</p>
            </div>
          )}
        </main>
        
        <footer className="py-4 text-center text-sm text-muted-foreground">
          Quanda Web created by Mirza Polat
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;
