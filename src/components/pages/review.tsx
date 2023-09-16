import { Button } from "@/components/ui/button";
import { calcPercentage, getHumanTime } from "@/lib/utils";
import QuestionStatement from "../ui/questionStatement";

type Props = {};

export default function Review({ questions, quiz, onClose }: Props) {
  const correct = questions.filter(
    (question) =>
      quiz.answers[question.idx.toString()] === question.answer.toString()
  );

  return (
    <div>
      <div className="container w-1/2 mx-auto min-h-2/3 py-10 px-10 bg-white shadow-md rounded-md">
        <div className="flex w-full justify-end">
          <Button onClick={onClose} variant="ghost" className="text-lg">
            Grįti į meniu
          </Button>
        </div>
        <div className="flex justify-center my-10 relative">
          <div className="absolute text-[180px] top-[-90px] font-bold opacity-5 pointer-events-none">
            {calcPercentage(correct.length, questions.length)}%
          </div>
          <div>
            <h1 className="text-5xl font-bold ">
              Jūsų rezultatas {calcPercentage(correct.length, questions.length)}
              %
            </h1>
            <p className="text-xl mt-5">
              Atsakėte <strong>{correct.length}</strong> klausimus teisingai iš{" "}
              <strong>{questions.length}</strong> per{" "}
              <strong>{getHumanTime(quiz.time)}</strong>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 container w-1/2 mx-auto min-h-2/3 py-10 px-10 bg-white shadow-md rounded-md">
        <p className="text-2xl pb-5 font-bold text-red-700 uppercase">
          Klausimų apžvalga
        </p>
        {questions.map((question, index) => (
          <div key={index}>
            <QuestionStatement
              index={index}
              question={question}
              answered={true}
              tight={true}
              answerSelected={
                quiz.answers[question.idx.toString()] &&
                quiz.answers[question.idx.toString()].toString()
              }
            />

            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          </div>
        ))}
        <div className="flex w-full justify-end">
          <Button onClick={onClose} variant="ghost" className="text-lg">
            Grįti į meniu
          </Button>
        </div>
      </div>
    </div>
  );
}
