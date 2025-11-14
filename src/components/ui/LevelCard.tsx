import React from "react"
import { LevelCardProps } from "@/types"

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  description,
  englishDescription,
  onClick,
  color,
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-6 m-2 rounded-xl shadow-lg transition-transform transform hover:scale-[1.03] text-white ${color} w-full sm:w-1/2 md:w-[200px] min-h-[150px]`}
  >
    <div className="text-6xl font-black mb-2">{level}</div>
    <p className="text-sm text-center font-bold">{description}</p>
    <p className="text-xs text-center italic opacity-80 mt-1">
      {englishDescription}
    </p>
  </button>
)
