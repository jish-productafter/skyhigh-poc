"use client"

import React, { useState } from "react"
import { Speaker } from "lucide-react"
import { SectionProps, ListeningQuestion } from "@/types"
import { GermanQuestion } from "@/components/ui/GermanQuestion"
import { QuestionContainer } from "@/components/ui/QuestionContainer"
import { AnswerFeedback } from "@/components/ui/AnswerFeedback"

export const ListeningSection: React.FC<SectionProps> = ({
  questions,
  level,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({})

  const handleAnswer = (qId: number, selectedOption: string) => {
    setAnswers({ ...answers, [qId]: selectedOption })
    setShowFeedback({ ...showFeedback, [qId]: false })
  }

  const checkAnswer = (qId: number, correctAnswer: string) => {
    setShowFeedback({ ...showFeedback, [qId]: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center text-3xl font-extrabold text-indigo-700 border-b pb-2">
        <Speaker className="w-7 h-7 mr-3" />
        <div>
          <p>1. Hören</p>
          <p className="text-sm font-medium text-gray-400 mt-1 italic leading-tight">
            (1. Listening)
          </p>
        </div>
      </div>

      <p className="text-gray-600 italic">
        Hören Sie gut zu. Da die Audiofiles nicht verfügbar sind, verwenden Sie
        die <strong>Audio-Beschreibung</strong> als Hinweis.{" "}
        <span className="text-xs font-normal opacity-80">
          (Listen carefully. Since the audio files are not available, use the{" "}
          <strong>audio description</strong> as a hint.)
        </span>
      </p>

      {questions.map((q: ListeningQuestion) => (
        <QuestionContainer key={q.id} id={q.id} level={level}>
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="shrink-0">
              <img
                src={q.imagePlaceholder}
                alt="Placeholder"
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="grow">
              <GermanQuestion
                germanText={q.question}
                englishTranslation={q.translation}
                className="mb-3"
              />
              <p className="text-sm text-blue-600 mb-4 font-medium">
                <em>{q.audioDescription}</em>
              </p>

              <div className="grid grid-cols-1 gap-3">
                {q.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(q.id, option)}
                    className={`p-3 text-left rounded-lg transition-all border-2
                      ${
                        answers[q.id] === option
                          ? "bg-indigo-100 border-indigo-500 text-indigo-700 font-bold"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                      }
                    `}
                  >
                    {q.type === "RichtigFalsch" ? (
                      <span className="font-mono text-xs mr-2">
                        {option.split(" ")[0]}
                      </span>
                    ) : (
                      ""
                    )}{" "}
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={() => checkAnswer(q.id, q.correctAnswer)}
                disabled={!answers[q.id]}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 transition duration-150"
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
  )
}
