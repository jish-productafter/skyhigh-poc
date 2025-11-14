"use client";

import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { SectionProps, ReadingQuestion } from "@/types";
import { GermanQuestion } from "@/components/ui/GermanQuestion";
import { QuestionContainer } from "@/components/ui/QuestionContainer";
import { AnswerFeedback } from "@/components/ui/AnswerFeedback";

export const ReadingSection: React.FC<SectionProps> = ({
  questions,
  level,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});

  const handleAnswer = (qId: number, selectedOption: string) => {
    setAnswers({ ...answers, [qId]: selectedOption });
    setShowFeedback({ ...showFeedback, [qId]: false });
  };

  const checkAnswer = (qId: number, correctAnswer: string) => {
    setShowFeedback({ ...showFeedback, [qId]: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center text-3xl font-extrabold text-green-700 border-b pb-2">
        <BookOpen className="w-7 h-7 mr-3" />
        <div>
          <p>2. Lesen</p>
          <p className="text-sm font-medium text-gray-400 mt-1 italic leading-tight">
            (2. Reading)
          </p>
        </div>
      </div>
      <p className="text-gray-600 italic">
        Lesen Sie die kurzen Texte und wählen Sie die beste Antwort.{" "}
        <span className="text-xs font-normal opacity-80">
          (Read the short texts and choose the best answer.)
        </span>
      </p>

      {questions.map((q: ReadingQuestion) => (
        <QuestionContainer key={q.id} id={q.id} level={level}>
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="shrink-0 p-4 border rounded-lg bg-gray-50 w-full md:w-1/3">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Originaltext / Situation:
              </p>
              <p className="text-xs font-medium text-gray-500 mb-2">
                (Original Text / Situation:)
              </p>
              <GermanQuestion
                germanText={q.text}
                englishTranslation={q.textTranslation}
                size="sm"
                className="mb-0"
              />
            </div>
            <div className="grow w-full md:w-2/3">
              <GermanQuestion
                germanText={q.question}
                englishTranslation={q.translation}
                className="mb-3"
              />

              <div className="grid grid-cols-1 gap-3">
                {q.options.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(q.id, option)}
                    className={`p-3 text-left rounded-lg transition-all border-2
                      ${
                        answers[q.id] === option
                          ? "bg-green-100 border-green-500 text-green-700 font-bold"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                      }
                    `}
                  >
                    <span className="font-mono text-xs mr-2">
                      {index === 0 ? "A" : index === 1 ? "B" : "C"}
                    </span>{" "}
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={() => checkAnswer(q.id, q.correctAnswer)}
                disabled={!answers[q.id]}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 transition duration-150"
              >
                Antwort prüfen (Check Answer)
              </button>

              {showFeedback[q.id] && q.correctAnswer && (
                <AnswerFeedback isCorrect={answers[q.id] === q.correctAnswer} />
              )}
            </div>
          </div>
        </QuestionContainer>
      ))}
    </div>
  );
};
