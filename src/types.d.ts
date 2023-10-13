export type Question = {
  text: string;
  choice: string[];
  answer: number;
  idx?: number;
  image?: string;
};

export type Quiz = {
  level: string;
  title: string;
  description: string;
  question: Question[];
};

export type Quizzes = {
  [level: string]: Quiz;
};

export type QuestionSetTracker = {
  answered: number[];
  answeredCorrect: number[];
  answeredIncorrect: number[];
  flagged: number[];
};

export type QuizTracker = {
  active: boolean;
  review: boolean;
  level: string;
  questions: number[];
  answers: { [key: string]: string };
  currentQuestion: number;
  time: number;
};

export type Tracker = {
  quiz: QuizTracker;
  questionSet: {
    [level: string]: QuestionSetTracker;
  };
};
