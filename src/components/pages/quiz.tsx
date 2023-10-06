import { Toggle } from "@/components/ui/toggle";
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  Timer,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useEffect, useState } from "react";
import { getHumanTime } from "@/lib/utils";
import QuestionStatement from "../ui/questionStatement";

const Pagination = ({ current, length, onClick }) => {
  return (
    <div className="flex w-full justify-center">
      <nav aria-label="Page navigation example">
        <ul className="flex items-center -space-x-px h-10 text-base">
          <li>
            <a
              href="#"
              onClick={() => {
                if (current > 1) onClick(current - 1);
              }}
              className="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Atgal</span>
              <ChevronLeft />
            </a>
          </li>

          {Array.from({ length: current - 1 }, (x, i) => i + 1)
            .slice(-4)
            .map((item) => (
              <li key={item}>
                <a
                  href="#"
                  onClick={() => onClick(item)}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {item}
                </a>
              </li>
            ))}

          <li>
            <a
              href="#"
              aria-current="page"
              className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              {current}
            </a>
          </li>

          {Array.from({ length: 5 }, (x, i) => i + 1 + current)
            .filter((item) => item <= length)
            .map((item) => (
              <li key={item}>
                <a
                  href="#"
                  onClick={() => onClick(item)}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {item}
                </a>
              </li>
            ))}
          <li>
            <a
              href="#"
              onClick={() => {
                if (current < length) onClick(current + 1);
              }}
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <ChevronRight />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export const Result = ({
  wasCorrect,
  explanation,
}: {
  wasCorrect: boolean;
  explanation: string | null;
}) => {
  return (
    <Alert variant={wasCorrect ? "correct" : "incorrect"}>
      {wasCorrect ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}

      <AlertTitle className="font-medium">
        Atsakymas {wasCorrect ? "teisingas" : "neteisingas"}!
      </AlertTitle>
      {explanation && explanation.length > 0 && (
        <AlertDescription>{explanation}</AlertDescription>
      )}
    </Alert>
  );
};

type Props = {
  questions: any;
  title: string;
};

export default function Quiz({
  questions,
  flags,
  title,
  quiz,
  onExit,
  onAnswer,
  onFlag,
  onQuestionChange,
  onTimerTick,
}: Props) {
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      onTimerTick();
    }, 1000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const [status, setStatus] = useState({
    answered: false,
    answerSelected: null,
  });

  const question =
    quiz.currentQuestion < questions.length
      ? questions[quiz.currentQuestion]
      : questions[questions.length - 1];

  if (!question) return;

  const validateAnswer = (answer) => {
    if (status.answered) return;

    onAnswer({
      questionIdx: question.idx,
      anwserIdx: answer,
      correct: answer === question.answer.toString(),
    });

    setStatus((current) => ({
      ...current,
      answerSelected: answer,
      answered: true,
    }));
  };

  return (
    <div className="container lg:w-1/2 lg:mx-auto min-h-2/3 py-10 px-10 bg-white shadow-md rounded-md">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <h3 className="text-2xl font-semibold">
            Klausimas {quiz.currentQuestion + 1} iš {questions.length}
          </h3>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Toggle
                      onPressedChange={() => {
                        onFlag(question.idx);
                      }}
                      pressed={
                        flags && question && flags.includes(question.idx)
                          ? true
                          : false
                      }
                      aria-label="Pažymėti klausimą"
                    >
                      <Flag className="h-6 w-6" />
                    </Toggle>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pažymėti klausimą</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex gap-1 items-center text-lg text-muted-foreground pr-1 w-[105px]">
          <Timer /> {getHumanTime(quiz.time)}
        </div>
      </div>

      <p className="text-muted-foreground">{title}</p>

      <QuestionStatement
        question={question}
        answered={status.answered}
        answerSelected={status.answerSelected}
        onValueChange={validateAnswer}
      />

      <div className="flex w-full justify-center gap-2 my-10">
        <Button
          className="text-lg"
          disabled={
            !status.answered || quiz.currentQuestion === questions.length - 1
          }
          onClick={() => {
            setStatus((current) => ({
              ...current,
              answered: false,
              answerSelected: null,
            }));

            onQuestionChange(quiz.currentQuestion + 1);
          }}
        >
          Sekantis
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" className="text-lg">
              Baigti
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Ar tikrai norite baigti testą?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Patvirtinę baigsite šį testą be galimybės pratęsti jį vėliau.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Atšaukti</AlertDialogCancel>
              <AlertDialogAction onClick={onExit}>Baigti</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Pagination
        current={quiz.currentQuestion + 1}
        length={questions.length}
        onClick={(page: number) => {
          setStatus((current) => ({
            ...current,
            answered: false,
            answerSelected: null,
          }));

          onQuestionChange(page - 1);
        }}
      />
    </div>
  );
}
