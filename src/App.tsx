import Main from "@/components/pages/main";

// @ts-expect-error does not properly import types
import useLocalStorage from "beautiful-react-hooks/useLocalStorage";

import { QuestionSetTracker, Quizzes, Tracker } from "@/types";
import Quiz from "@/components/pages/quiz";
import Review from "@/components/pages/review";
import questionsObject from "./assets/questions.json";

import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { GITHUB_REPO } from "@/constants";

const questions = questionsObject as Quizzes;

export default function App() {
  const { toast } = useToast();
  const [tracker, setTracker] = useLocalStorage<Tracker>("__tracker", {
    quiz: {
      active: false,
      review: false,
      level: null,
      questions: [],
      answers: {},
      currentQuestion: 0,
      time: 0,
    },
    questionSet: {
      a: {
        answered: [],
        answeredCorrect: [],
        answeredIncorrect: [],
        flagged: [],
      },
      b: {
        answered: [],
        answeredCorrect: [],
        answeredIncorrect: [],
        flagged: [],
      },
    },
  });

  const startTest = ({
    level,
    questions,
  }: {
    level: string;
    questions: number[];
  }) => {
    if (!questions.length) {
      toast({
        title: "Klaida",
        description: "Nepavyko sugeneruoti testo. Patikrintite pasirinkimus.",
        duration: 3000,
      });

      return;
    }

    setTracker((current: Tracker) => ({
      ...current,
      quiz: {
        ...current.quiz,
        active: true,
        level,
        questions,
        answers: {},
        currentQuestion: 0,
        time: 0,
      },
    }));
  };

  const goToReview = () => {
    setTracker((current: Tracker) => {
      return {
        ...current,
        quiz: {
          ...current.quiz,
          active: false,
          review: true,
        },
      };
    });
  };

  const trackAnswers = (questionIdx: number, answerIdx: string) => {
    setTracker((current: Tracker) => {
      const entry: { [questionIdx: string]: string } = {};
      entry[questionIdx] = answerIdx;

      return {
        ...current,
        quiz: {
          ...current.quiz,
          answers: { ...current.quiz.answers, ...entry },
        },
      };
    });
  };

  const registerAnswer = ({
    questionIdx,
    answerIdx,
    correct,
  }: {
    questionIdx: number;
    answerIdx: string;
    correct: boolean;
  }) => {
    trackAnswers(questionIdx, answerIdx);

    const values = {
      ...(tracker as Tracker).questionSet[tracker.quiz.level],
    };

    if (!values.answered.includes(questionIdx))
      values.answered.push(questionIdx);

    if (correct) {
      if (!values.answeredCorrect.includes(questionIdx))
        values.answeredCorrect.push(questionIdx);

      values.answeredIncorrect = values.answeredIncorrect.filter(
        (item) => item !== questionIdx
      );
    }

    if (!correct) {
      if (!values.answeredIncorrect.includes(questionIdx))
        values.answeredIncorrect.push(questionIdx);

      values.answeredCorrect = values.answeredCorrect.filter(
        (item) => item !== questionIdx
      );
    }

    const tmp: { [level: string]: QuestionSetTracker } = {};
    tmp[tracker.quiz.level] = values;

    setTracker((current: Tracker) => ({
      ...current,
      questionSet: {
        ...current.questionSet,
        ...tmp,
      },
    }));
  };

  const registerFlag = (questionId: number) => {
    const values = {
      ...tracker.questionSet[tracker.quiz.level],
    };

    if (!values.flagged.includes(questionId)) values.flagged.push(questionId);
    else
      values.flagged = values.flagged.filter(
        (item: number) => item !== questionId
      );

    const tmp: { [level: string]: QuestionSetTracker } = {};
    tmp[tracker.quiz.level] = values;

    setTracker((current: Tracker) => ({
      ...current,
      questionSet: {
        ...current.questionSet,
        ...tmp,
      },
    }));
  };

  const changeCurrentQuizQuestion = (questionId: number) => {
    setTracker((current: Tracker) => ({
      ...current,
      quiz: {
        ...current.quiz,
        currentQuestion: questionId,
      },
    }));
  };

  return (
    <div className="grid h-full min-h-screen content-between from-gray-50 to-gray-200 md:bg-gradient-to-b lg:py-5">
      <div className="md:container md:mx-auto md:mt-5 md:w-4/6 lg:w-3/4 xl:w-2/3 2xl:w-1/2">
        {!tracker.quiz.active && !tracker.quiz.review && (
          <Main
            questions={questions}
            tracker={tracker}
            onTestStart={startTest}
          />
        )}

        {tracker.quiz.active && (
          <Quiz
            questions={tracker.quiz.questions.map(
              (id: number) =>
                questions[tracker.quiz.level].question.map((question, idx) => ({
                  ...question,
                  idx,
                }))[id]
            )}
            quiz={tracker.quiz}
            flags={tracker.questionSet[tracker.quiz.level].flagged}
            title={questions[tracker.quiz.level].title}
            onExit={goToReview}
            onAnswer={registerAnswer}
            onFlag={registerFlag}
            onQuestionChange={changeCurrentQuizQuestion}
            onTimerTick={() => {
              setTracker((current: Tracker) => ({
                ...current,
                quiz: {
                  ...current.quiz,
                  time: current.quiz.time + 1,
                },
              }));
            }}
          />
        )}

        {!tracker.quiz.active && tracker.quiz.review && (
          <Review
            questions={tracker.quiz.questions.map(
              (id: number) =>
                questions[tracker.quiz.level].question.map((question, idx) => ({
                  ...question,
                  idx,
                }))[id]
            )}
            quiz={tracker.quiz}
            onClose={() => {
              setTracker((current: Tracker) => ({
                ...current,
                quiz: {
                  ...current.quiz,
                  review: false,
                },
              }));
            }}
          />
        )}
      </div>
      <footer className="mx-auto my-5  flex w-full max-w-screen-xl justify-center p-1">
        <ul className="mt-3 flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-4 hover:underline md:mr-6 "
            >
              Github
            </a>
          </li>
        </ul>
      </footer>
      <Toaster />
    </div>
  );
}
