import React from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { AnswerFeedbackProps } from "@/types"

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  isCorrect,
}) => {
  const germanText = isCorrect
    ? "Richtig! Gut gemacht."
    : "Leider Falsch. Versuchen Sie es noch einmal."
  const englishText = isCorrect
    ? "Correct! Well done."
    : "Unfortunately False. Try again."

  return (
    <div
      className={`mt-4 p-3 rounded-lg flex items-center font-semibold ${
        isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isCorrect ? (
        <CheckCircle className="w-5 h-5 mr-2" />
      ) : (
        <XCircle className="w-5 h-5 mr-2" />
      )}
      {germanText}
      <span className="text-xs ml-2 opacity-75">({englishText})</span>
    </div>
  )
}
