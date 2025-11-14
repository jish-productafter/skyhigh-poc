import React from "react"
import { QuestionContainerProps } from "@/types"

export const QuestionContainer: React.FC<QuestionContainerProps> = ({
  id,
  children,
  level,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-indigo-400">
    <div className="font-mono text-xs text-indigo-600 mb-2">
      AUFGABE {level}-{id} (TASK {level}-{id})
    </div>
    {children}
  </div>
)
