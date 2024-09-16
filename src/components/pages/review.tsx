import { Button } from "@/components/ui/button";
import QuestionStatement from "@/components/ui/question-statement";
import { calcPercentage, getHumanTime } from "@/lib/utils";
import { Question, QuizTracker } from "@/types";
import { Undo2 } from "lucide-react";

const GoBack = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex w-full justify-end">
      <Button onClick={onClick} variant="ghost" className="text-lg">
        Grįžti į meniu <Undo2 className="ml-2" />
      </Button>
    </div>
  );
};

type Props = {
  questions: Question[];
  quiz: QuizTracker;
  onClose: () => void;
};

export default function Review({ questions, quiz, onClose }: Props) {
  const correct = questions.filter(
    (question) =>
      quiz.answers[(question.idx as number).toString()] ===
      question.answer.toString()
  );

  return (
    <div>
      <div className="rounded-md bg-white px-10 py-10 shadow-md">
        <GoBack onClick={onClose} />

        <div className="relative my-10 flex justify-center">
          <div className="pointer-events-none absolute top-[-90px] text-[180px] font-bold opacity-5">
            {calcPercentage(correct.length, questions.length)}%
          </div>
          <div>
            <h1 className="text-5xl font-bold ">
              Jūsų rezultatas {calcPercentage(correct.length, questions.length)}
              %
            </h1>
            <p className="mt-5 text-xl">
              Atsakėte <strong>{correct.length}</strong> klausimus teisingai iš{" "}
              <strong>{questions.length}</strong> per{" "}
              <strong>{getHumanTime(quiz.time)}</strong>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-md bg-white px-10 py-10 shadow-md">
        <p className="pb-5 text-2xl font-bold uppercase text-red-700">
          Klausimų apžvalga
        </p>
        {questions.map((question, index: number) => (
          <div key={index}>
            <QuestionStatement
              question={question}
              answered={true}
              tight={true}
              answerSelected={
                quiz.answers[(question.idx as number).toString()] &&
                quiz.answers[(question.idx as number).toString()].toString()
              }
            />

            <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>
          </div>
        ))}

        <GoBack onClick={onClose} />
      </div>
    </div>
  );
}
