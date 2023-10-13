import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question } from "@/types";
import clsx from "clsx";
import { CheckCircle, XCircle } from "lucide-react";

const Outcome = ({ correct }: { correct: boolean }) => {
  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-2 text-lg ${
          correct ? "text-green-600" : "text-red-600"
        }`}
      >
        {correct ? (
          <CheckCircle className="h-6 w-6" strokeWidth={2} />
        ) : (
          <XCircle className="h-6 w-6" strokeWidth={2} />
        )}
        <p>Atsakymas {!correct ? "ne" : ""}teisingas!</p>
      </div>
    </div>
  );
};

type Props = {
  question: Question;
  answered: boolean;
  answerSelected: string;
  tight?: boolean;
  onValueChange?: (value: string) => void;
};

export default function QuestionStatement({
  question,
  answered,
  answerSelected,
  tight,
  onValueChange,
}: Props) {
  onValueChange = onValueChange || (() => {});
  return (
    <div className="my-5">
      <p className={`mb-${tight ? "3" : "10"} text-xl`}>
        {<strong>{(question.idx as number) + 1}. </strong>}
        {question.text}
      </p>

      {question.image && question.image.length > 0 && (
        <div className="p-3">
          <img
            className="max-h-[350px] object-contain"
            alt={question.image}
            src={question.image}
          />
        </div>
      )}

      <RadioGroup
        className={clsx("text-xl", tight ? "my-3" : "my-4 md:my-8")}
        value={answerSelected}
        onValueChange={onValueChange}
      >
        {question.choice.map((choice: string, index: number) => (
          <div
            key={index}
            className={clsx(
              "flex items-center space-x-2",
              tight ? "my-1" : "my-2 md:my-3"
            )}
          >
            <RadioGroupItem
              value={index.toString()}
              id={`radio-id-${index}`}
              data-answered={answered}
              data-correct={answered && question.answer === index}
              data-selected-correct={
                answered && answerSelected === question.answer.toString()
              }
              className="data-[answered=true]:data-[correct=true]:data-[selected-correct=false]:border-4 data-[answered=true]:data-[correct=true]:border-green-500 data-[answered=true]:data-[correct=false]:text-red-600 data-[answered=true]:data-[correct=true]:text-green-500"
            />
            <Label className="text-lg" htmlFor={`radio-id-${index}`}>
              {choice}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div
        data-visible={answered && parseInt(answerSelected) > -1}
        className="opacity-0 data-[visible=true]:opacity-100"
      >
        <Outcome correct={answerSelected === question.answer.toString()} />
      </div>
    </div>
  );
}
