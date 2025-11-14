"use client"

import React from "react"
import { Grid, Speaker, BookOpen, PenTool, Mic } from "lucide-react"
import { ExamContent } from "@/types"
import { SectionCard } from "@/components/ui/SectionCard"

interface SectionSelectionProps {
  examContent: ExamContent
  onSelectSection: (
    section: "LISTENING" | "READING" | "WRITING" | "SPEAKING"
  ) => void
}

export const SectionSelection: React.FC<SectionSelectionProps> = ({
  examContent,
  onSelectSection,
}) => {
  return (
    <div className="p-8">
      <div className="flex items-center text-3xl font-extrabold text-gray-800 mb-6">
        <Grid className="w-7 h-7 mr-3 text-indigo-500" />
        <div>
          <p>{examContent.title} - Sektionen</p>
          <p className="text-sm font-medium text-gray-400 mt-1 italic leading-tight">
            ({examContent.englishTitle} - Sections)
          </p>
        </div>
      </div>

      <p className="text-lg text-gray-600 mb-10">
        Wählen Sie den Prüfungsteil, den Sie üben möchten.{" "}
        <span className="text-sm font-normal opacity-80 italic">
          (Select the exam part you would like to practice.)
        </span>
      </p>

      <div className="flex flex-wrap justify-center -m-2">
        <SectionCard
          icon={<Speaker />}
          title="Hören"
          englishTitle="Listening"
          description="Verständnis von Ankündigungen und Gesprächen."
          englishDescription="Comprehension of announcements and conversations."
          onClick={() => onSelectSection("LISTENING")}
          color="bg-indigo-500"
        />
        <SectionCard
          icon={<BookOpen />}
          title="Lesen"
          englishTitle="Reading"
          description="Verständnis von Texten, Anzeigen und Artikeln."
          englishDescription="Comprehension of texts, advertisements, and articles."
          onClick={() => onSelectSection("READING")}
          color="bg-green-500"
        />
        <SectionCard
          icon={<PenTool />}
          title="Schreiben"
          englishTitle="Writing"
          description="Verfassen von Nachrichten, Briefen oder Kommentaren."
          englishDescription="Writing messages, letters, or commentaries."
          onClick={() => onSelectSection("WRITING")}
          color="bg-orange-500"
        />
        <SectionCard
          icon={<Mic />}
          title="Sprechen"
          englishTitle="Speaking"
          description="Mündliche Interaktion, Präsentation und Diskussion."
          englishDescription="Oral interaction, presentation, and discussion."
          onClick={() => onSelectSection("SPEAKING")}
          color="bg-red-500"
        />
      </div>
    </div>
  )
}
