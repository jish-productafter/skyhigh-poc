"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Speaker, Pause, Volume2 } from "lucide-react";
import { ListeningSectionProps, ListeningQuestion } from "@/types";
import { GermanQuestion } from "@/components/ui/GermanQuestion";
import { QuestionContainer } from "@/components/ui/QuestionContainer";
import { AnswerFeedback } from "@/components/ui/AnswerFeedback";
import { adaptListeningQuestion } from "@/services/api";

export const ListeningSection: React.FC<ListeningSectionProps> = ({
  questions,
  level,
}) => {
  // Adapt API questions to app format
  const adaptedQuestions = useMemo(() => {
    return questions.map(adaptListeningQuestion);
  }, [questions]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
  const [playing, setPlaying] = useState<Record<number, boolean>>({});
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthesisRef.current = window.speechSynthesis;

      // Load voices (some browsers need this)
      const loadVoices = () => {
        if (synthesisRef.current) {
          synthesisRef.current.getVoices();
        }
      };

      // Chrome loads voices asynchronously
      if (synthesisRef.current.onvoiceschanged !== undefined) {
        synthesisRef.current.onvoiceschanged = loadVoices;
      }
      loadVoices();
    }
    return () => {
      // Cleanup: stop any ongoing speech when component unmounts
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  const handleAnswer = (qId: number, selectedOption: string) => {
    setAnswers({ ...answers, [qId]: selectedOption });
    setShowFeedback({ ...showFeedback, [qId]: false });
  };

  const checkAnswer = (qId: number, correctAnswer: string) => {
    setShowFeedback({ ...showFeedback, [qId]: true });
  };

  const speakText = (text: string, lang: string = "de-DE") => {
    if (!synthesisRef.current) {
      console.warn("Speech synthesis not supported in this browser");
      return;
    }

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a German voice if available
    const voices = synthesisRef.current.getVoices();
    const germanVoice = voices.find(
      (voice) => voice.lang.startsWith("de") || voice.lang.startsWith("de-DE")
    );
    if (germanVoice) {
      utterance.voice = germanVoice;
    }

    utteranceRef.current = utterance;

    utterance.onend = () => {
      setPlaying((prev) => {
        const newState = { ...prev };
        // Reset all playing states when speech ends
        Object.keys(newState).forEach((key) => {
          newState[Number(key)] = false;
        });
        return newState;
      });
    };

    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      setPlaying((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          newState[Number(key)] = false;
        });
        return newState;
      });
    };

    synthesisRef.current.speak(utterance);
  };

  const handlePlayAudio = (question: ListeningQuestion) => {
    // Read the question text, not the audioText
    const textToSpeak = question.question;

    if (!textToSpeak) {
      console.warn("No question text available for this question");
      return;
    }

    // Toggle play/pause
    if (playing[question.id]) {
      // Stop current speech
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
      setPlaying({ ...playing, [question.id]: false });
    } else {
      // Stop any other playing audio first
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
      // Reset all playing states
      setPlaying({});
      // Start speaking
      setPlaying({ [question.id]: true });
      speakText(textToSpeak, "de-DE");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center text-3xl font-extrabold text-indigo-700 border-b pb-2">
        <Speaker className="w-7 h-7 mr-3" />
        <div>
          <p>1. Hören</p>
          <p className="text-sm font-medium text-gray-400 mt-1 italic leading-tight">
            (1. Listening)
          </p>
        </div>
      </div>

      <p className="text-gray-600 italic">
        Hören Sie gut zu. Da die Audiofiles nicht verfügbar sind, verwenden Sie
        die <strong>Audio-Beschreibung</strong> als Hinweis.{" "}
        <span className="text-xs font-normal opacity-80">
          (Listen carefully. Since the audio files are not available, use the{" "}
          <strong>audio description</strong> as a hint.)
        </span>
      </p>

      {adaptedQuestions.map((q: ListeningQuestion) => (
        <QuestionContainer key={q.id} id={q.id} level={level}>
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="shrink-0">
              <img
                src={q.imagePlaceholder}
                alt="Placeholder"
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="grow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <GermanQuestion
                    germanText={q.question}
                    englishTranslation={q.translation}
                    className="mb-0"
                  />
                </div>
                {/* TTS Play Button */}
                {q.question && (
                  <button
                    onClick={() => handlePlayAudio(q)}
                    className="ml-4 p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition-all duration-200 flex items-center justify-center min-w-[44px] min-h-[44px]"
                    title="Play question (Frage abspielen)"
                    aria-label="Play question"
                  >
                    {playing[q.id] ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-sm text-blue-600 mb-4 font-medium">
                <em>{q.audioDescription}</em>
              </p>
              {(q.ttsPrompt || q.audioText) && (
                <div className="mb-4 p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-xs text-indigo-700">
                    <strong>Audio Text:</strong> {q.ttsPrompt || q.audioText}
                  </p>
                  {q.audioText_translation && (
                    <p className="text-xs text-indigo-600 mt-1 italic">
                      ({q.audioText_translation})
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {q.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(q.id, option)}
                    className={`p-3 text-left rounded-lg transition-all border-2
                      ${
                        answers[q.id] === option
                          ? "bg-indigo-100 border-indigo-500 text-indigo-700 font-bold"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                      }
                    `}
                  >
                    {q.type === "RichtigFalsch" ? (
                      <span className="font-mono text-xs mr-2">
                        {option.split(" ")[0]}
                      </span>
                    ) : (
                      ""
                    )}{" "}
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={() => checkAnswer(q.id, q.correctAnswer)}
                disabled={!answers[q.id]}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 transition duration-150"
              >
                Antwort prüfen (Check Answer)
              </button>

              {showFeedback[q.id] && q.correctAnswer && (
                <AnswerFeedback isCorrect={answers[q.id] === q.correctAnswer} />
              )}
            </div>
          </div>
        </QuestionContainer>
      ))}
    </div>
  );
};
