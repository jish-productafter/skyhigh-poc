"use client";

import React from "react";
import { Level } from "@/types";
import { LevelCard } from "@/components/ui/LevelCard";
import { Mic } from "lucide-react";

interface LevelSelectionProps {
  onSelectLevel: (level: Level | "Basic") => void;
}

export const LevelSelection: React.FC<LevelSelectionProps> = ({
  onSelectLevel,
}) => {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-200 mb-2">
          Goethe-Zertifikat Level Auswahl
        </h1>
        <p className="text-base text-gray-300">
          Wählen Sie das Sprachniveau aus, um mit dem Üben zu beginnen.{" "}
          <span className="text-sm italic opacity-80">
            (Select the language level to begin practising.)
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <button
          onClick={() => onSelectLevel("Basic")}
          className="glass-card relative flex flex-col items-start justify-center p-6 rounded-xl transition-transform transform hover:scale-[1.03] text-white min-w-[280px] min-h-[180px] overflow-hidden group"
        >
          {/* Gradient accent strip - pink to dark purple */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-pink-500 to-purple-700" />

          {/* Icon on the right */}
          <div className="absolute top-4 right-4 opacity-80 group-hover:opacity-100 transition-opacity">
            <Mic className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full">
            <div className="text-6xl font-black mb-3 text-white">Basic</div>
            <p className="text-sm font-bold text-white mb-1">Aussprache üben</p>
            <p className="text-xs italic opacity-80 text-white">
              (Pronunciation Practice)
            </p>
          </div>
        </button>
        <LevelCard
          level="A1"
          description="Einfache Kommunikation"
          englishDescription="Simple Communication"
          onClick={() => onSelectLevel("A1")}
          color="bg-indigo-500"
        />
        <LevelCard
          level="A2"
          description="Elementare Konversation"
          englishDescription="Elementary Conversation"
          onClick={() => onSelectLevel("A2")}
          color="bg-green-500"
        />

        <LevelCard
          level="B1"
          description="Selbstständige Sprachverwendung"
          englishDescription="Independent Language Use"
          onClick={() => onSelectLevel("B1")}
          color="bg-orange-500"
        />
        <LevelCard
          level="B2"
          description="Fließend und differenziert"
          englishDescription="Fluent and Differentiated"
          onClick={() => onSelectLevel("B2")}
          color="bg-red-500"
        />
      </div>
    </div>
  );
};
