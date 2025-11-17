import React from "react";
import { SectionCardProps } from "@/types";

const getGradientColors = (color: string) => {
  if (color.includes("indigo")) {
    return "from-blue-600 to-purple-600";
  } else if (color.includes("green")) {
    return "from-green-400 to-green-600";
  } else if (color.includes("orange")) {
    return "from-yellow-400 to-orange-500";
  } else if (color.includes("red")) {
    return "from-orange-500 to-red-500";
  }
  return "from-blue-600 to-purple-600";
};

export const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  englishTitle,
  description,
  englishDescription,
  onClick,
  color,
}) => {
  const gradient = getGradientColors(color);

  return (
    <button
      onClick={onClick}
      className="glass-card relative flex flex-col items-center justify-center p-6 m-2 rounded-xl transition-transform transform hover:scale-[1.03] text-white min-w-[200px] min-h-[180px] overflow-hidden group"
    >
      {/* Gradient accent strip on the left */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${gradient}`}
      />

      {/* Icon on the right */}
      <div className="absolute top-4 right-4 opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="text-white">{icon}</div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full text-center">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-sm opacity-90 text-white mb-2">{englishTitle}</p>
        <p className="text-xs opacity-80 italic text-white">
          {englishDescription}
        </p>
      </div>
    </button>
  );
};
