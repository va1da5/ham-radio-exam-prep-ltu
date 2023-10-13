import { Toggle } from "@/components/ui/toggle";
import { Flag, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

import { Pagination } from "@/components/ui/pagination";
import QuestionStatement from "@/components/ui/question-statement";
import { getHumanTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Question, QuizTracker } from "@/types";

type Props = {
  questions: Question[];
  flags: number[];
  title: string;
  quiz: QuizTracker;
  onExit: () => void;
  onAnswer: ({
    questionIdx,
    answerIdx,
    correct,
  }: {
    questionIdx: number;
    answerIdx: string;
    correct: boolean;
  }) => void;
  onFlag: (questionIdx: number) => void;
  onQuestionChange: (next: number) => void;
  onTimerTick: () => void;
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
    answerSelected: "",
  });

  const question =
    quiz.currentQuestion < questions.length
      ? questions[quiz.currentQuestion]
      : questions[questions.length - 1];

  if (!question) return;

  const validateAnswer = (answer: string) => {
    if (status.answered) return;

    onAnswer({
      questionIdx: question.idx as number,
      answerIdx: answer,
      correct: answer === question.answer.toString(),
    });

    setStatus((current) => ({
      ...current,
      answerSelected: answer,
      answered: true,
    }));
  };

  return (
    <div className="rounded-md bg-white px-7 py-3 md:px-10 md:py-10 md:shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
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
                        onFlag(question.idx as number);
                      }}
                      pressed={
                        flags &&
                        question &&
                        flags.includes(question.idx as number)
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

        <div className="mb-2 flex items-center gap-1 pr-1 text-lg text-muted-foreground md:mb-0 md:w-[105px]">
          <Timer /> {getHumanTime(quiz.time)}
        </div>
      </div>

      <p className="hidden text-muted-foreground md:block">{title}</p>

      <QuestionStatement
        question={question}
        answered={status.answered}
        answerSelected={status.answerSelected as string}
        onValueChange={validateAnswer}
      />

      <div className="my-10 flex w-full justify-between gap-2 md:justify-center">
        <Button
          className="text-lg"
          disabled={
            !status.answered || quiz.currentQuestion === questions.length - 1
          }
          onClick={() => {
            setStatus((current) => ({
              ...current,
              answered: false,
              answerSelected: "",
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
            answerSelected: "",
          }));

          onQuestionChange(page - 1);
        }}
      />
    </div>
  );
}
