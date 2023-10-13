import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shuffle } from "@/lib/utils";

import { QuestionSetTracker, Quiz } from "@/types";

// @ts-expect-error does not properly import types
import useLocalStorage from "beautiful-react-hooks/useLocalStorage";
import { EXAM_QUESTIONS } from "@/constants";

type Props = {
  questions: Quiz;
  tracked: QuestionSetTracker;
  onQuizCreation: (props: { level: string; questions: number[] }) => void;
};

type QuizFormTypes = {
  questions: string;
  numberOfQuestions: string;
  order: string;
};

export const QuizForm = ({ questions, tracked, onQuizCreation }: Props) => {
  const [quizForm, setQuizForm] = useLocalStorage<QuizFormTypes>(
    "__menu_options",
    {
      questions: "all",
      numberOfQuestions: "20",
      order: "sequential",
    }
  );

  const unanswered = () => {
    return questions.question
      .map((question, idx: number) => ({ ...question, idx }))
      .filter((question) => !tracked.answered.includes(question.idx))
      .map((question) => question.idx);
  };

  const answered = () => {
    return tracked.answered;
  };

  const answeredIncorrect = () => {
    return tracked.answeredIncorrect;
  };

  const flagged = () => {
    return tracked.flagged;
  };

  const generateQuestionSet = () => {
    const mapping: { [key: string]: () => number[] } = {
      all: () => questions.question.map((_, idx: number) => idx),
      unanswered,
      answered,
      incorrect: answeredIncorrect,
      flagged,
    };

    let questionsSet = [...mapping[quizForm.questions]()].sort((a, b) => a - b);

    if (quizForm.order === "random") {
      questionsSet = shuffle(questionsSet) as number[];
    }

    onQuizCreation({
      level: questions.level,
      questions: questionsSet.slice(0, parseInt(quizForm.numberOfQuestions)),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{questions.title}</CardTitle>
        <CardDescription>
          <a
            target="_blank"
            rel="noopener"
            className="hover:underline"
            href={EXAM_QUESTIONS}
          >
            Praktikos klausimai paruošti pagal 2020-02-11 patvirtintus egzaminų
            klausimus
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid w-full gap-5 md:grid-cols-3">
        <div>
          <Select
            value={quizForm.questions}
            onValueChange={(value) => {
              setQuizForm((current: QuizFormTypes) => ({
                ...current,
                questions: value,
              }));
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Pasirinkti klausimus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Klausimai</SelectLabel>
                <SelectItem value="all">
                  Visi klausimai ({questions.question.length})
                </SelectItem>
                <SelectItem value="unanswered">
                  Neatsakyti ({unanswered().length})
                </SelectItem>
                <SelectItem value="answered">
                  Atsakyti ({answered().length})
                </SelectItem>
                <SelectItem value="incorrect">
                  Klaidingai atsakyti ({answeredIncorrect().length})
                </SelectItem>
                <SelectItem value="flagged">
                  Pažymėti ({flagged().length})
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={quizForm.numberOfQuestions}
            onValueChange={(value) => {
              setQuizForm((current: QuizFormTypes) => ({
                ...current,
                numberOfQuestions: value,
              }));
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Klausimų skaičius" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Klausimų skaičius</SelectLabel>
                {[10, 20, 30, 40, 50, 60, 80, 100, 200, 300].map((item) => (
                  <SelectItem key={item} value={item.toString()}>
                    {item.toString()}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={quizForm.order}
            onValueChange={(value) => {
              setQuizForm((current: QuizFormTypes) => ({
                ...current,
                order: value,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Klausimų eiliškumas" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Klausimų eiliškumas</SelectLabel>
                <SelectItem value="sequential">Nuoseklus</SelectItem>
                <SelectItem value="random">Atsitiktinis</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="text-lg" onClick={generateQuestionSet}>
          Pradėti
        </Button>
      </CardFooter>
    </Card>
  );
};
