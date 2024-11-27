/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

const generateTestParagraph = ({
  wordCount,
  includePunctuation,
  includeNumbers,
}: any) => {
  const words = [
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "I",
    "it",
    "for",
    "not",
    "on",
    "with",
    "he",
    "as",
    "you",
    "do",
    "at",
    "this",
    "but",
    "his",
    "by",
    "from",
    "they",
    "we",
    "say",
    "her",
    "she",
  ];
  const punctuation = [".", ",", "!", "?", ";", ":"];
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let paragraph = [];
  for (let i = 0; i < wordCount; i++) {
    let word = words[Math.floor(Math.random() * words.length)];
    if (includeNumbers && Math.random() < 0.1) {
      word += numbers[Math.floor(Math.random() * numbers.length)];
    }
    if (includePunctuation && Math.random() < 0.2) {
      word += punctuation[Math.floor(Math.random() * punctuation.length)];
    }
    paragraph.push(word);
  }
  return paragraph.join(" ");
};

export default function TypewriterTest({
  settings,
  onTestComplete,
  onRestart,
}: any) {
  const [paragraph, setParagraph] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(settings.timerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setParagraph(
      generateTestParagraph({
        wordCount: settings.wordCount,
        includePunctuation: settings.includePunctuation,
        includeNumbers: settings.includeNumbers,
      })
    );
  }, [settings]);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime: number) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTestEnd();
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  interface Settings {
    wordCount: number;
    includePunctuation: boolean;
    includeNumbers: boolean;
    timerDuration: number;
    timerMode: boolean;
  }

  interface TestCompleteData {
    wpm: number;
    timeElapsed: number;
    accuracy: number;
    wordsTyped: number;
  }

  interface TypewriterTestProps {
    settings: Settings;
    onTestComplete: (data: TestCompleteData) => void;
    onRestart: () => void;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setUserInput(input);
    setWordCount(input.trim().split(/\s+/).length);

    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === paragraph[i]) {
        correct++;
      }
    }
    setCorrectCharacters(correct);

    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
      if (settings.timerMode) {
        setIsTimerRunning(true);
      }
    }

    if (
      input.length === paragraph.length ||
      (settings.timerMode && timeLeft === 0)
    ) {
      handleTestEnd();
    }
  };

  const handleTestEnd = () => {
    setEndTime(Date.now());
    const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : 0; // in seconds
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const wpm = Math.round((wordsTyped / timeElapsed) * 60);
    const accuracy = (correctCharacters / paragraph.length) * 100;
    onTestComplete({ wpm, timeElapsed, accuracy, wordsTyped });
  };

  const handleRestart = useCallback(() => {
    setParagraph(
      generateTestParagraph({
        wordCount: settings.wordCount,
        includePunctuation: settings.includePunctuation,
        includeNumbers: settings.includeNumbers,
      })
    );
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(settings.timerDuration);
    setIsTimerRunning(false);
    setWordCount(0);
    setCorrectCharacters(0);
    onRestart();
    if (inputRef.current) inputRef.current.focus();
  }, [settings, onRestart]);

  useEffect(() => {
    const handleKeyPress = (e: { key: string; preventDefault: () => void }) => {
      if (e.key === "tab") {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleRestart]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm font-medium">Words: {wordCount}</p>
        {settings.timerMode && (
          <p className="text-sm font-medium">Time left: {timeLeft}s</p>
        )}
      </div>
      <div className="mb-4 text-lg font-medium leading-relaxed max-w-4xl mx-auto text-center">
        {paragraph.split("").map((char, index) => {
          let color = "text-muted-foreground";
          if (index < userInput.length) {
            color =
              userInput[index] === char ? "text-green-500" : "text-red-500";
          }
          return (
            <span
              key={index}
              className={`${color} transition-colors duration-200`}
            >
              {char}
            </span>
          );
        })}
      </div>
      <textarea
        ref={inputRef}
        className="w-full max-w-4xl mx-auto p-2 text-lg border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Start typing here..."
        rows={5}
      />
      <div className="mt-4 flex items-center justify-between">
        <Button onClick={handleRestart} variant="outline">
          <ReloadIcon className="mr-2 h-4 w-4" /> Restart
        </Button>
        <p className="text-sm text-muted-foreground">
          Press &apos;tab&apos; to restart the test
        </p>
      </div>
    </div>
  );
}
