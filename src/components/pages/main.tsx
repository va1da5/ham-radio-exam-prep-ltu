import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { QuizForm } from "@/components/ui/quiz-form";
import { Quizzes, Tracker } from "@/types";
import { GITHUB_ISSUES, GITHUB_QUESTIONS, HAM_EXAM_GUIDE } from "@/constants";
import { useEffect, useState } from "react";
import { getStoredValue, storeValue } from "@/lib/utils";

const LOCAL_STORAGE_TAB_NAME = "__menu_tab"

// function getCurrentTab(){
//   const value = localStorage.getItem(LOCAL_STORAGE_TAB_NAME);
//   if (!value) return "a"
//   return value;
// }

type Props = {
  questions: Quizzes;
  tracker: Tracker;
  onTestStart: (value: { level: string; questions: number[] }) => void;
};

export default function Main({ questions, tracker, onTestStart }: Props) {
  const [tab, setTab] = useState(getStoredValue(LOCAL_STORAGE_TAB_NAME, "a"));

  useEffect(()=> {
    storeValue(LOCAL_STORAGE_TAB_NAME, tab)
  }, [tab])

  if (!questions || !tracker) return;

  return (
    <div className="bg-white px-10 py-10 md:rounded-md md:shadow-md">
      <h1 className="text-3xl font-semibold uppercase ">
        Radijo mėgėjų egzaminų pasiruošimo testai
      </h1>
      <p className="mt-10 text-lg">
        Sveiki atvykę į internetinį puslapį, skirtą praktikuotis ir pasiruošti
        radijo mėgėjų{" "}
        <a
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          href={HAM_EXAM_GUIDE}
        >
          kvalifikaciniams egzaminams
        </a>{" "}
        ! Jei jūs norite tapti radijo mėgėju arba jau esate mėgėjas, bet norite
        tobulinti savo žinias ir įgūdžius, tai vieta jums!
      </p>
      <p className="mt-12 text-lg">
        Žemiau pasirinkite kvalifikacijos lygį, kurį planuojate studijuoti, ir
        pradėkite mokytis sprendžiant testus.
      </p>

      <div className="mt-5">
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

      <p className=" text-md mt-5 text-muted-foreground">
        Atsakymai į klausimus nėra oficialūs, todėl pastebėjus klaidą,{" "}
        <a
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          href={GITHUB_ISSUES}
        >
          praneškite
        </a>{" "}
        arba{" "}
        <a
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          href={GITHUB_QUESTIONS}
        >
          ištaisykite savarankiškai
        </a>
        .
      </p>
    </div>
  );
}
