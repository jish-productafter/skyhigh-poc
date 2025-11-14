"use client"

import React from "react"
import { Mic } from "lucide-react"
import { SectionProps, SpeakingQuestion } from "@/types"
import { GermanQuestion } from "@/components/ui/GermanQuestion"
import { QuestionContainer } from "@/components/ui/QuestionContainer"

export const SpeakingSection: React.FC<SectionProps> = ({
  questions,
  level,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-3xl font-extrabold text-red-700 border-b pb-2">
        <Mic className="w-7 h-7 mr-3" />
        <div>
          <p>4. Sprechen</p>
          <p className="text-sm font-medium text-gray-400 mt-1 italic leading-tight">
            (4. Speaking)
          </p>
        </div>
      </div>
      <p className="text-gray-600 italic">
        Üben Sie die mündliche Prüfung. Konzentrieren Sie sich auf flüssiges
        Sprechen und korrekte Grammatik.{" "}
        <span className="text-xs font-normal opacity-80">
          (Practice the oral exam. Focus on fluent speaking and correct
          grammar.)
        </span>
      </p>
      {questions.map((q: SpeakingQuestion) => (
        <QuestionContainer key={q.id} id={q.id} level={level}>
          <GermanQuestion
            germanText={q.prompt}
            englishTranslation={q.translation}
            className="mb-4"
          />

          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-md mb-4">
            <p className="text-sm font-medium text-red-700">
              Beispiel / Fokus ({q.type}):{" "}
              <span className="text-xs font-normal opacity-80">
                (Example / Focus ({q.type}):)
              </span>
            </p>
            <p className="text-md italic mt-1 text-red-800">
              {q.example || "Denken Sie sich eine Antwort aus."}{" "}
              <span className="text-xs font-normal opacity-80">
                ({q.example ? "" : "Think of an answer."})
              </span>
            </p>
          </div>
          <textarea
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 resize-none"
            placeholder="Schreiben Sie Ihre Antwort zur Übung oder sprechen Sie laut. (Write your answer for practice or speak out loud.)"
          ></textarea>
          <p className="text-sm mt-3 text-gray-500">
            <strong>Hinweis (Note):</strong> In der echten Prüfung müssen Sie
            laut sprechen. Nutzen Sie dieses Feld, um Ihre Sätze zu formulieren.{" "}
            <span className="text-xs font-normal opacity-80">
              (In the real exam, you must speak out loud. Use this field to
              formulate your sentences.)
            </span>
          </p>
        </QuestionContainer>
      ))}
    </div>
  )
}
