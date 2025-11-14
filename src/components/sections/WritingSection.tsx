"use client"

import React, { useState, useMemo } from "react"
import { PenTool } from "lucide-react"
import {
  SectionProps,
  WritingFormQuestion,
  WritingLetterQuestion,
} from "@/types"
import { GermanQuestion } from "@/components/ui/GermanQuestion"
import { QuestionContainer } from "@/components/ui/QuestionContainer"

export const WritingSection: React.FC<SectionProps> = ({
  questions,
  level,
}) => {
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({})
  const [essayAnswer, setEssayAnswer] = useState("")
  const wordCount = useMemo(() => {
    return essayAnswer
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }, [essayAnswer])

  const formQuestion = questions.find((q) => q.type === "Formular") as
    | WritingFormQuestion
    | undefined
  const briefQuestion = questions.find(
    (q) => q.type === "Brief" || q.type === "Kommentar"
  ) as WritingLetterQuestion | undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center text-3xl font-extrabold text-orange-700 border-b pb-2">
        <PenTool className="w-7 h-7 mr-3" />
        <div>
          <p>3. Schreiben</p>
          <p className="text-sm font-medium text-gray-400 mt-1 italic leading-tight">
            (3. Writing)
          </p>
        </div>
      </div>
      <p className="text-gray-600 italic">
        Schreiben Sie eine Nachricht oder füllen Sie ein Formular aus. Achten
        Sie auf die vorgegebene Wortanzahl.{" "}
        <span className="text-xs font-normal opacity-80">
          (Write a message or fill out a form. Pay attention to the specified
          word count.)
        </span>
      </p>

      {/* Task 1: Formular (A1 only) or Brief/Kommentar */}
      {formQuestion && (
        <QuestionContainer id={formQuestion.id} level={level}>
          <GermanQuestion
            germanText="Teil 1: Formular ausfüllen"
            englishTranslation="Part 1: Filling out a form"
            size="2xl"
            className="mb-4"
          />
          <GermanQuestion
            germanText={formQuestion.prompt}
            englishTranslation={formQuestion.translation}
            size="sm"
            className="mb-4"
          />

          <div className="space-y-3">
            {formQuestion.fields.map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field}:{" "}
                  <span className="text-xs text-gray-400 italic">
                    ({field})
                  </span>
                </label>
                <input
                  type="text"
                  id={field}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder={`Ihr ${field} hier (Your ${field} here)`}
                  value={formAnswers[field] || ""}
                  onChange={(e) =>
                    setFormAnswers({ ...formAnswers, [field]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        </QuestionContainer>
      )}
      {/* Task 2: Brief / E-Mail / Kommentar */}
      {briefQuestion && (
        <QuestionContainer id={briefQuestion.id} level={level}>
          <GermanQuestion
            germanText={`Teil ${formQuestion ? "2" : "1"}: ${
              briefQuestion.type === "Kommentar"
                ? "Kommentar verfassen"
                : "Mitteilung verfassen"
            }`}
            englishTranslation={`Part ${formQuestion ? "2" : "1"}: Write a ${
              briefQuestion.type === "Kommentar" ? "commentary" : "message"
            }`}
            size="2xl"
            className="mb-4"
          />
          <GermanQuestion
            germanText={briefQuestion.prompt}
            englishTranslation={briefQuestion.translation}
            size="sm"
            className="mb-4"
          />

          <textarea
            rows={8}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 resize-none"
            placeholder="Ihre Antwort hier... (Your answer here...)"
            value={essayAnswer}
            onChange={(e) => setEssayAnswer(e.target.value)}
          ></textarea>
          <p
            className={`text-sm mt-2 font-medium ${
              wordCount < briefQuestion.minWords ||
              wordCount > briefQuestion.maxWords
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            Wortzahl: {wordCount} (Ziel: {briefQuestion.minWords}-
            {briefQuestion.maxWords} Wörter){" "}
            <span className="text-xs font-normal opacity-80">
              (Word count: {wordCount} | Target: {briefQuestion.minWords}-
              {briefQuestion.maxWords} words)
            </span>
          </p>
          <div className="mt-4 p-3 bg-orange-50 border-l-4 border-orange-400 text-orange-700 rounded-md">
            <strong>Tipp (Tip):</strong> Achten Sie auf Struktur, passende
            Anrede und Grußformel (für Briefe) oder eine klare Argumentation
            (für Kommentare).
          </div>
        </QuestionContainer>
      )}
    </div>
  )
}
