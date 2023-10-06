import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import useLocalStorage from "beautiful-react-hooks/useLocalStorage";

type Props = {};

const QuizForm = ({ questions, tracked, onQuizCreation, tab }) => {
  const [quizForm, setQuizForm] = useLocalStorage("__menu_options", {
    questions: "all",
    numberOfQuestions: "20",
    order: "sequential",
  });

  const unanswered = () => {
    return questions.question
      .map((question, idx: number) => ({ ...question, idx }))
      .filter((question: any) => !tracked.answered.includes(question.idx))
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
    const mapping = {
      all: () => questions.question.map((_: any, idx: number) => idx),
      unanswered,
      answered,
      incorrect: answeredIncorrect,
      flagged,
    };

    let questionsSet = [...mapping[quizForm.questions]()].sort((a, b) => a > b);

    if (quizForm.order === "random") {
      questionsSet = shuffle(questionsSet);
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
          Make changes to your account here. Click save when you're done.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid w-full grid-cols-3 gap-5">
        <div>
          <Select
            value={quizForm.questions}
            onValueChange={(value) => {
              setQuizForm((current) => ({
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
              setQuizForm((current) => ({
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
              setQuizForm((current) => ({
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

export default function Main({ questions, tracker, onTestStart }: Props) {
  if (!questions || !tracker) return;

  const [tab, setTab] = useLocalStorage("__menu_tab", "a");

  return (
    <div className="container w-1/2 mx-auto  py-10 px-10 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-semibold uppercase">
        Radijo mėgėjų kvalifikacinių egzaminų klausimai
      </h1>
      <p className="mt-5 text-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia aliquid
        esse maxime explicabo beatae, debitis eius delectus nulla quae est,
        culpa consectetur, consequuntur perspiciatis. Nulla in voluptate nihil
        accusantium ducimus!
      </p>
      <div className="mt-10">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="a">A lygio</TabsTrigger>
            <TabsTrigger value="b">B lygio</TabsTrigger>
          </TabsList>

          {["a", "b"].map((value) => (
            <TabsContent value={value} key={value}>
              <QuizForm
                questions={questions[value]}
                tracked={tracker.questionSet[value]}
                onQuizCreation={onTestStart}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
