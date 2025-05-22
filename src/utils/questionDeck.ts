
export interface Question {
  id: string;
  text: string;
  seen: boolean;
}

export interface DeckState {
  questions: Question[];
  history: Question[];
  currentIndex: number;
}

// Parse CSV content into questions
export const parseCSV = (content: string): Question[] => {
  return content
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line, index) => ({
      id: `q-${index}`,
      text: line.trim(),
      seen: false,
    }));
};

// Get a random question, prioritizing unseen questions
export const getRandomQuestion = (questions: Question[]): Question | null => {
  if (questions.length === 0) return null;

  // Try to get an unseen question first
  const unseenQuestions = questions.filter((q) => !q.seen);
  if (unseenQuestions.length > 0) {
    // Return random unseen question
    const randomIndex = Math.floor(Math.random() * unseenQuestions.length);
    return unseenQuestions[randomIndex];
  }

  // If all questions have been seen, return a random question
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

// Check if all questions have been seen
export const allQuestionsSeen = (questions: Question[]): boolean => {
  return questions.every((q) => q.seen);
};

// Reset seen status for all questions
export const resetSeenStatus = (questions: Question[]): Question[] => {
  return questions.map((q) => ({ ...q, seen: false }));
};

// Mark a question as seen
export const markAsSeen = (
  questions: Question[],
  questionId: string
): Question[] => {
  return questions.map((q) =>
    q.id === questionId ? { ...q, seen: true } : q
  );
};
