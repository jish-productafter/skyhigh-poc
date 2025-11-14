import React from "react"
import { SectionCardProps } from "@/types"

export const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  englishTitle,
  description,
  englishDescription,
  onClick,
  color,
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 m-2 rounded-xl shadow-lg transition-transform transform hover:scale-[1.03] text-white ${color} w-full sm:w-1/2 md:w-1/4 min-h-[150px]`}
  >
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-sm text-center mt-1 opacity-90">{englishTitle}</p>
    <p className="text-xs text-center mt-2 opacity-80 italic">
      {englishDescription}
    </p>
  </button>
)
