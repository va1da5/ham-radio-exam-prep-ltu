import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  current: number;
  length: number;
  onClick: (page: number) => void;
};

export const Pagination = ({ current, length, onClick }: Props) => {
  return (
    <div className="flex w-full justify-center">
      <div aria-label="Pagination">
        <ul className="flex h-10 items-center -space-x-px text-base">
          <li>
            <a
              href="#"
              onClick={() => {
                if (current > 1) onClick(current - 1);
              }}
              className="ml-0 flex h-10 items-center justify-center rounded-l-lg border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Ankstesnis</span>
              <ChevronLeft />
            </a>
          </li>

          {Array.from({ length: current - 1 }, (_, i) => i + 1)
            .slice(-4)
            .map((item) => (
              <li key={item} className="hidden md:block">
                <a
                  href="#"
                  onClick={() => onClick(item)}
                  className="flex h-10 items-center justify-center border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {item}
                </a>
              </li>
            ))}

          <li>
            <a
              href="#"
              aria-current="page"
              className="z-10 flex h-10 items-center justify-center border border-blue-300 bg-blue-50 px-4 leading-tight text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              {current}
            </a>
          </li>

          {Array.from({ length: 5 }, (_, i) => i + 1 + current)
            .filter((item) => item <= length)
            .map((item) => (
              <li key={item} className="hidden md:block">
                <a
                  href="#"
                  onClick={() => onClick(item)}
                  className="flex h-10 items-center justify-center border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
              className="flex h-10 items-center justify-center rounded-r-lg border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Sekantis</span>
              <ChevronRight />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
