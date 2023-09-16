import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";

const Outcome = ({ correct }) => {
  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-2 text-lg ${
          correct ? "text-green-600" : "text-red-600"
        }`}
      >
        {correct ? (
          <CheckCircle className="w-6 h-6" strokeWidth={2} />
        ) : (
          <XCircle className="w-6 h-6" strokeWidth={2} />
        )}
        <p>Atsakymas {!correct ? "ne" : ""}teisingas!</p>
      </div>
    </div>
  );
};

type Props = {};

export default function QuestionStatement({
  index,
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
        {<strong>{question.idx + 1}. </strong>}
        {question.text}
      </p>

      {question.image && question.image.length > 0 && (
        <div className="p-3">
          <img
            className="object-contain max-h-[350px]"
            alt={question.image}
            src={question.image}
          />
        </div>
      )}

      <RadioGroup
        className={`my-${tight ? "3" : "8"} text-xl`}
        value={answerSelected}
        onValueChange={onValueChange}
      >
        {question.choice.map((choice: string, index: number) => (
          <div
            key={index}
            className={clsx(
              "flex items-center space-x-2",
              tight ? "my-1" : "my-3"
            )}
          >
            <RadioGroupItem
              value={index.toString()}
              id={`radio-id-${index}`}
              className={clsx(
                answered && [
                  answerSelected === question.answer.toString()
                    ? "text-green-600"
                    : "text-red-600",
                ],
                answered && [
                  question.answer === index ? "border-green-500" : "",
                ],
                answered && [
                  answerSelected !== question.answer.toString() &&
                  question.answer == index
                    ? "border-4"
                    : "",
                ]
              )}
            />
            <Label className="text-lg" htmlFor={`radio-id-${index}`}>
              {choice}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <div
        className={clsx(
          "mt-5",
          answered && parseInt(answerSelected) > -1
            ? "opacity-100"
            : "opacity-0"
        )}
      >
        <Outcome correct={answerSelected === question.answer.toString()} />
      </div>
    </div>
  );
}
