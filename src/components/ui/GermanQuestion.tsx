import React from "react"
import { GermanQuestionProps } from "@/types"

/**
 * Renders a German text with its English translation as a small, light subscript.
 */
export const GermanQuestion: React.FC<GermanQuestionProps> = ({
  germanText,
  englishTranslation,
  size = "lg",
  className = "",
}) => {
  // size='3xl' for main titles, 'lg' for main questions, 'md'/'sm' for smaller prompts
  const textSizeClass =
    size === "3xl"
      ? "text-3xl font-extrabold"
      : size === "2xl"
      ? "text-2xl font-bold"
      : size === "lg"
      ? "text-lg font-semibold"
      : "text-md font-medium"

  return (
    <div className={className}>
      <p className={`${textSizeClass} text-gray-800`}>{germanText}</p>
      {englishTranslation && (
        <p className="text-xs text-gray-400 mt-1 italic leading-tight">
          {englishTranslation}
        </p>
      )}
    </div>
  )
}


