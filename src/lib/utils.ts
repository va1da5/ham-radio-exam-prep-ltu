import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const zeroPad = (num: number) => String(num).padStart(2, "0");

export const getHumanTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  return `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
};

export const shuffle = (array: unknown[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const calcPercentage = (correct: number, all: number) => {
  return Math.round((100 * correct) / all);
};

export function getStoredValue<T>(name:string, defaultValue: T): ()=> T{
  return () => {
    const value = localStorage.getItem(name);
    if (value===null) return defaultValue
    try {
      return JSON.parse(value)
    }
    catch(e){
      return value;
    }
  }
}

export function storeValue<T>(name:string, obj: T){
  localStorage.setItem(name, JSON.stringify(obj))
}