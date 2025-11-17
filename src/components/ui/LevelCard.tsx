import React from "react";
import { LevelCardProps } from "@/types";
import { MessageCircle, Handshake, Mic, User } from "lucide-react";

const getGradientColors = (level: string) => {
  switch (level) {
    case "A1":
      return "from-blue-600 to-purple-600";
    case "A2":
      return "from-green-400 to-green-600";
    case "B1":
      return "from-yellow-400 to-orange-500";
    case "B2":
      return "from-orange-500 to-red-500";
    default:
      return "from-blue-600 to-purple-600";
  }
};

const getIcon = (level: string) => {
  switch (level) {
    case "A1":
      return <MessageCircle className="w-6 h-6 text-white" />;
    case "A2":
      return <Handshake className="w-6 h-6 text-white" />;
    case "B1":
    case "B2":
      return <User className="w-6 h-6 text-white" />;
    default:
      return <MessageCircle className="w-6 h-6 text-white" />;
  }
};

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  description,
  englishDescription,
  onClick,
  color,
}) => {
  const gradient = getGradientColors(level);
  const icon = getIcon(level);

  return (
    <button
      onClick={onClick}
      className="glass-card relative flex flex-col items-start justify-center p-6 rounded-xl transition-transform transform hover:scale-[1.03] text-white min-w-[280px] min-h-[180px] overflow-hidden group"
    >
      {/* Gradient accent strip on the left */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${gradient}`}
      />

      {/* Icon on the right */}
      <div className="absolute top-4 right-4 opacity-80 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="text-6xl font-black mb-3 text-white">{level}</div>
        <p className="text-sm font-bold text-white mb-1">{description}</p>
        <p className="text-xs italic opacity-80 text-white">
          ({englishDescription})
        </p>
      </div>
    </button>
  );
};
