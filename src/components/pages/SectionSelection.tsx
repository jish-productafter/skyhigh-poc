"use client";

import React from "react";
import { Grid, Speaker, BookOpen, PenTool, Mic } from "lucide-react";
import { ExamContent } from "@/types";
import { SectionCard } from "@/components/ui/SectionCard";

interface SectionSelectionProps {
  examContent: ExamContent;
  onSelectSection: (
    section: "LISTENING" | "READING" | "WRITING" | "SPEAKING"
  ) => void;
}

export const SectionSelection: React.FC<SectionSelectionProps> = ({
  examContent,
  onSelectSection,
}) => {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-200 mb-2">
          {examContent.title} - Sektionen
        </h1>
        <p className="text-base text-gray-300">
          Wählen Sie den Prüfungsteil, den Sie üben möchten.{" "}
          <span className="text-sm italic opacity-80">
            (Select the exam part you would like to practice.)
          </span>
        </p>
      </div>

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
  );
};
