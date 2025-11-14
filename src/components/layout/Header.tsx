"use client"

import React from "react"
import { ChevronLeft } from "lucide-react"

interface HeaderProps {
  activeLevel: string | null
  activeSection: string | null
  onBack: () => void
}

export const Header: React.FC<HeaderProps> = ({
  activeLevel,
  activeSection,
  onBack,
}) => {
  return (
    <div className="bg-white shadow-lg">
      <header className="max-w-6xl mx-auto p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-black text-gray-900 flex items-center">
          <span className="text-indigo-600 mr-2 text-3xl font-serif">
            GOETHE
          </span>{" "}
          EXAM TRAINER
        </h1>
        {(activeLevel || activeSection) && (
          <div className="flex space-x-3">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {activeSection
                ? "Zurück zu Sektionen (Back to Sections)"
                : activeLevel === "Basic"
                ? "Zurück zur Auswahl (Back to Selection)"
                : "Level wechseln (Change Level)"}
            </button>
          </div>
        )}
      </header>
    </div>
  )
}
