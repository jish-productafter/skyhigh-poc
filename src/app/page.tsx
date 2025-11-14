"use client";

import React, { useState, useEffect } from "react";
import {
  Level,
  Section,
  ListeningQuestion,
  ReadingQuestion,
  WritingQuestion,
  SpeakingQuestion,
} from "@/types";
import { EXAM_CONTENT } from "@/data";
import { Header } from "@/components/layout/Header";
import { LevelSelection } from "@/components/pages/LevelSelection";
import { SectionSelection } from "@/components/pages/SectionSelection";
import { BasicPractice } from "@/components/practice/BasicPractice";
import { ListeningSection } from "@/components/sections/ListeningSection";
import { ReadingSection } from "@/components/sections/ReadingSection";
import { WritingSection } from "@/components/sections/WritingSection";
import { SpeakingSection } from "@/components/sections/SpeakingSection";
import {
  generateListening,
  generateReading,
  generateWriting,
  generateSpeaking,
  adaptListeningQuestion,
  adaptReadingQuestion,
  adaptWritingQuestion,
  adaptSpeakingQuestion,
} from "@/services/api";

const App = () => {
  const [activeLevel, setActiveLevel] = useState<Level | "Basic" | null>(null);
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [questions, setQuestions] = useState<
    | ListeningQuestion[]
    | ReadingQuestion[]
    | WritingQuestion[]
    | SpeakingQuestion[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Default topic - can be made configurable later
  const defaultTopic = "greetings";

  // Reset section when level changes
  const setLevel = (level: Level | "Basic") => {
    setActiveLevel(level);
    setActiveSection(null); // Go to section selection for the new level
    setQuestions([]);
    setError(null);
    setRetryKey(0);
  };

  const currentLevelContent =
    activeLevel && activeLevel !== "Basic" ? EXAM_CONTENT[activeLevel] : null;

  // Fetch questions when section is selected
  useEffect(() => {
    if (activeLevel && activeLevel !== "Basic" && activeSection) {
      setError(null);
      setQuestions([]);

      const fetchQuestions = async () => {
        setLoading(true);

        try {
          switch (activeSection) {
            case "LISTENING": {
              const listeningData = await generateListening({
                topic: defaultTopic,
                level: activeLevel,
              });
              setQuestions(listeningData.map(adaptListeningQuestion));
              break;
            }
            case "READING": {
              const readingData = await generateReading({
                topic: defaultTopic,
                level: activeLevel,
                prefer_type: "MultipleChoice",
              });
              setQuestions(readingData.map(adaptReadingQuestion));
              break;
            }
            case "WRITING": {
              const writingData = await generateWriting({
                topic: defaultTopic,
                level: activeLevel,
                task_type: "email",
              });
              console.log("Raw writing data from API:", writingData);
              const adapted = writingData.map(adaptWritingQuestion);
              console.log("Adapted writing questions:", adapted);
              setQuestions(adapted);
              break;
            }
            case "SPEAKING": {
              const speakingData = await generateSpeaking({
                topic: defaultTopic,
                level: activeLevel,
                interaction_type: "interview",
              });
              setQuestions(speakingData.map(adaptSpeakingQuestion));
              break;
            }
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load questions"
          );
          console.error("Error fetching questions:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [activeLevel, activeSection, defaultTopic, retryKey]);

  const handleBack = () => {
    if (activeSection) {
      setActiveSection(null);
      setQuestions([]);
      setError(null);
      setRetryKey(0);
    } else if (activeLevel) {
      setActiveLevel(null);
    }
  };

  const renderContent = () => {
    if (!activeLevel) {
      // 1. Level Selection Dashboard
      return <LevelSelection onSelectLevel={setLevel} />;
    }

    // Handle Basic practice
    if (activeLevel === "Basic") {
      return <BasicPractice />;
    }

    if (!activeSection) {
      // 2. Section Selection Dashboard (for a chosen level)
      return (
        <SectionSelection
          examContent={currentLevelContent!}
          onSelectSection={setActiveSection}
        />
      );
    }

    // 3. Exam Section View
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading questions...</p>
            <p className="text-sm text-gray-400 mt-2">
              (Fragen werden geladen...)
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold mb-2">
              Error loading questions
            </p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setRetryKey((prev) => prev + 1);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600">No questions available</p>
            <p className="text-sm text-gray-400 mt-2">
              (Keine Fragen verfügbar)
            </p>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case "LISTENING":
        return (
          <ListeningSection
            questions={questions as ListeningQuestion[]}
            level={activeLevel}
          />
        );
      case "READING":
        return (
          <ReadingSection
            questions={questions as ReadingQuestion[]}
            level={activeLevel}
          />
        );
      case "WRITING":
        return (
          <WritingSection
            questions={questions as WritingQuestion[]}
            level={activeLevel}
          />
        );
      case "SPEAKING":
        return (
          <SpeakingSection
            questions={questions as SpeakingQuestion[]}
            level={activeLevel}
          />
        );
      default:
        return null;
    }
  };

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
  );
};

export default App;
