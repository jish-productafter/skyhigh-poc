"use client"

import React from "react"
import { Grid } from "lucide-react"
import { Level } from "@/types"
import { LevelCard } from "@/components/ui/LevelCard"

interface LevelSelectionProps {
  onSelectLevel: (level: Level | "Basic") => void
}

export const LevelSelection: React.FC<LevelSelectionProps> = ({
  onSelectLevel,
}) => {
  return (
    <div className="p-8">
      <div className="flex items-center text-3xl font-extrabold text-gray-800 mb-6">
        <Grid className="w-7 h-7 mr-3 text-indigo-500" />
        <div>
          <p>Goethe-Zertifikat Level Auswahl</p>
          <p className="text-sm font-medium text-gray-400 mt-1 italic leading-tight">
            (Goethe Certificate Level Selection)
          </p>
        </div>
      </div>

      <p className="text-lg text-gray-600 mb-10">
        Wählen Sie das Sprachniveau aus, um mit dem Üben zu beginnen.{" "}
        <span className="text-sm font-normal opacity-80 italic">
          (Select the language level to begin practicing.)
        </span>
      </p>

      <div className="flex flex-wrap justify-center -m-2">
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
        <button
          onClick={() => onSelectLevel("Basic")}
          className="flex flex-col items-center justify-center p-6 m-2 rounded-xl shadow-lg transition-transform transform hover:scale-[1.03] text-white bg-purple-500 w-full sm:w-1/2 md:w-[200px] min-h-[150px]"
        >
          <div className="text-6xl font-black mb-2">Basic</div>
          <p className="text-sm text-center font-bold">Aussprache üben</p>
          <p className="text-xs text-center italic opacity-80 mt-1">
            (Pronunciation Practice)
          </p>
        </button>
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
      <div className="mt-12 p-6 bg-gray-100 rounded-xl shadow-inner text-center">
        <p className="text-gray-600">
          Der Trainer enthält typische Aufgabenformate für die
          Goethe-Zertifikate von A1 bis B2.{" "}
          <span className="text-xs font-normal opacity-80 italic">
            (The trainer contains typical task formats for the Goethe
            Certificates from A1 to B2.)
          </span>
        </p>
      </div>
    </div>
  )
}
