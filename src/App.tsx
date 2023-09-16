import Main from "@/components/pages/main";

import useLocalStorage from "beautiful-react-hooks/useLocalStorage";

import questions from "./assets/questions.json";
import Review from "@/components/pages/review";
import Quiz from "@/components/pages/quiz";

export default function App() {
  const [tracker, setTracker] = useLocalStorage("__tracker", {
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

  const startTest = ({ level, questions }) => {
    setTracker((current) => ({
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
    setTracker((current) => {
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

  const trackAnswers = (questionIdx, anwserIdx) => {
    setTracker((current) => {
      const entry = {};
      entry[questionIdx] = anwserIdx;

      console.log(entry);

      return {
        ...current,
        quiz: {
          ...current.quiz,
          answers: { ...current.quiz.answers, ...entry },
        },
      };
    });
  };

  const registerAnswer = ({ questionIdx, anwserIdx, correct }) => {
    trackAnswers(questionIdx, anwserIdx);

    const values = {
      ...tracker.questionSet[tracker.quiz.level],
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

    const tmp = {};
    tmp[tracker.quiz.level] = values;

    setTracker((current) => ({
      ...current,
      questionSet: {
        ...current.questionSet,
        ...tmp,
      },
    }));
  };

  const registerFlag = (questionId) => {
    const values = {
      ...tracker.questionSet[tracker.quiz.level],
    };

    if (!values.flagged.includes(questionId)) values.flagged.push(questionId);
    else values.flagged = values.flagged.filter((item) => item !== questionId);

    const tmp = {};
    tmp[tracker.quiz.level] = values;

    setTracker((current) => ({
      ...current,
      questionSet: {
        ...current.questionSet,
        ...tmp,
      },
    }));
  };

  const changeCurrentQuizQuestion = (questionId) => {
    setTracker((current) => ({
      ...current,
      quiz: {
        ...current.quiz,
        currentQuestion: questionId,
      },
    }));
  };

  return (
    <div className="h-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-10">
      {!tracker.quiz.active && !tracker.quiz.review && (
        <Main questions={questions} tracker={tracker} onTestStart={startTest} />
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
            setTracker((current) => ({
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
            setTracker((current) => ({
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
  );
}
