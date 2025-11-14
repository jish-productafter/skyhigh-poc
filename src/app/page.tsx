"use client"

import React, { useState } from "react"
import { Level, Section } from "@/types"
import { EXAM_CONTENT } from "@/data"
import { Header } from "@/components/layout/Header"
import { LevelSelection } from "@/components/pages/LevelSelection"
import { SectionSelection } from "@/components/pages/SectionSelection"
import { BasicPractice } from "@/components/practice/BasicPractice"
import { ListeningSection } from "@/components/sections/ListeningSection"
import { ReadingSection } from "@/components/sections/ReadingSection"
import { WritingSection } from "@/components/sections/WritingSection"
import { SpeakingSection } from "@/components/sections/SpeakingSection"

const App = () => {
  const [activeLevel, setActiveLevel] = useState<Level | "Basic" | null>(null)
  const [activeSection, setActiveSection] = useState<Section | null>(null)

  // Reset section when level changes
  const setLevel = (level: Level | "Basic") => {
    setActiveLevel(level)
    setActiveSection(null) // Go to section selection for the new level
  }

  const currentLevelContent =
    activeLevel && activeLevel !== "Basic" ? EXAM_CONTENT[activeLevel] : null

  const handleBack = () => {
    if (activeSection) {
      setActiveSection(null)
    } else if (activeLevel) {
      setActiveLevel(null)
    }
  }

  const renderContent = () => {
    if (!activeLevel) {
      // 1. Level Selection Dashboard
      return <LevelSelection onSelectLevel={setLevel} />
    }

    // Handle Basic practice
    if (activeLevel === "Basic") {
      return <BasicPractice />
    }

    if (!activeSection) {
      // 2. Section Selection Dashboard (for a chosen level)
      return (
        <SectionSelection
          examContent={currentLevelContent!}
          onSelectSection={setActiveSection}
        />
      )
    }

    // 3. Exam Section View
    const questions = currentLevelContent![activeSection]
    switch (activeSection) {
      case "LISTENING":
        return <ListeningSection questions={questions} level={activeLevel} />
      case "READING":
        return <ReadingSection questions={questions} level={activeLevel} />
      case "WRITING":
        return <WritingSection questions={questions} level={activeLevel} />
      case "SPEAKING":
        return <SpeakingSection questions={questions} level={activeLevel} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header
        activeLevel={activeLevel}
        activeSection={activeSection}
        onBack={handleBack}
      />
      <main className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
