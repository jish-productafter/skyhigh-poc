"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Mic,
  Speaker,
  RefreshCw,
  Square,
  Play,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { BASIC_GERMAN_WORDS } from "@/data";
import {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from "@/types";
import { validateSpeaking } from "@/services/api";

export const BasicPractice: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<Blob | null>(null);
  const [validating, setValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    score?: number;
    feedback?: string;
    transcription?: string;
    errors?: string[];
    suggestions?: string[];
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize with a random word
  useEffect(() => {
    getRandomWord();
  }, []);

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * BASIC_GERMAN_WORDS.length);
    setCurrentWord(BASIC_GERMAN_WORDS[randomIndex]);
    // Reset validation when word changes
    setValidationResult(null);
    setValidationError(null);
    setRecording(null);
  };

  const speakWord = () => {
    if (!currentWord) return;

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = "de-DE";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setRecording(audioBlob);
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setValidationResult(null);
      setValidationError(null);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setValidationError(
        "Microphone access denied. Please allow microphone access."
      );
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (recording) {
      const audioUrl = URL.createObjectURL(recording);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    }
  };

  const handleValidate = async () => {
    if (!recording || !currentWord) {
      setValidationError("Please record your pronunciation first.");
      return;
    }

    setValidating(true);
    setValidationError(null);
    setValidationResult(null);

    try {
      // Create a simple speaking task for basic word practice
      const speakingTask: import("@/types").SpeakingQuestion = {
        id: 0,
        type: "Vorstellen",
        prompt: `Sprechen Sie das Wort "${currentWord}" aus. (Pronounce the word "${currentWord}".)`,
        translation: `Pronounce the word "${currentWord}".`,
      };

      const result = await validateSpeaking({
        speaking_task: speakingTask,
        audioFile: recording,
      });
      setValidationResult(result);
    } catch (error) {
      setValidationError(
        error instanceof Error
          ? error.message
          : "Failed to validate pronunciation"
      );
      console.error("Validation error:", error);
    } finally {
      setValidating(false);
    }
  };

  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass() as SpeechRecognition;
    recognition.lang = "de-DE";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();
      const confidence = event.results[0][0].confidence || 0;
      const isCorrect = transcript.toLowerCase() === currentWord.toLowerCase();

      // Send data to mock backend
      try {
        const response = await fetch("/api/practice/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            word: currentWord,
            transcript,
            isCorrect,
            confidence,
            language: "de-DE",
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          console.error(
            "Failed to save practice record:",
            await response.text()
          );
        } else {
          const data = await response.json();
          console.log("Practice record saved:", data);
        }
      } catch (error) {
        console.error("Error sending practice record to backend:", error);
      }

      if (isCorrect) {
        alert("Richtig! Gut gemacht! (Correct! Well done!)");
      } else {
        alert(
          `Sie sagten: "${transcript}". Das richtige Wort ist: "${currentWord}". (You said: "${transcript}". The correct word is: "${currentWord}".)`
        );
      }
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "no-speech") {
        alert(
          "Keine Sprache erkannt. Versuchen Sie es erneut. (No speech detected. Please try again.)"
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center text-3xl font-extrabold text-purple-300 border-b border-gray-600 pb-2 mb-4">
        <Grid className="w-7 h-7 mr-3 text-purple-300" />
        <div>
          <p className="text-gray-200">Basic - Aussprache üben</p>
          <p className="text-sm font-medium text-gray-300 mt-1 italic leading-tight">
            (Basic - Practice Pronunciation)
          </p>
        </div>
      </div>

      <p className="text-gray-300 italic mb-6">
        Üben Sie die Aussprache deutscher Wörter. Hören Sie das Wort an und
        versuchen Sie es nachzusprechen.{" "}
        <span className="text-xs font-normal opacity-80">
          (Practice the pronunciation of German words. Listen to the word and
          try to repeat it.)
        </span>
      </p>

      <div className="glass-card p-8 rounded-lg shadow-md border-l-4 border-purple-400">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Word Display */}
          <div className="text-center">
            <p className="text-5xl font-black text-gray-200 mb-2">
              {currentWord}
            </p>
            <p className="text-sm text-gray-300 italic">
              (Click the speaker icon to hear the pronunciation)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* Speaker Button */}
            <button
              onClick={speakWord}
              disabled={isSpeaking}
              className={`flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 ${
                isSpeaking
                  ? "bg-purple-300 text-purple-700 cursor-not-allowed"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              <Speaker className="w-6 h-6 mr-2" />
              <span className="font-semibold">
                {isSpeaking ? "Speaking..." : "Listen"}
              </span>
            </button>

            {/* Record Button */}
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 bg-red-500 text-white hover:bg-red-600"
              >
                <Mic className="w-6 h-6 mr-2" />
                <span className="font-semibold">Record</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 bg-red-800 text-white hover:bg-red-900 animate-pulse"
              >
                <Square className="w-6 h-6 mr-2" />
                <span className="font-semibold">Stop</span>
              </button>
            )}

            {/* Play Recording Button */}
            {recording && !isRecording && (
              <button
                onClick={playRecording}
                className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 bg-gray-600 text-white hover:bg-gray-700"
              >
                <Play className="w-6 h-6 mr-2" />
                <span className="font-semibold">Play</span>
              </button>
            )}

            {/* Validate Button */}
            {recording && !isRecording && (
              <button
                onClick={handleValidate}
                disabled={validating}
                className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {validating ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    <span className="font-semibold">Validating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 mr-2" />
                    <span className="font-semibold">Validate</span>
                  </>
                )}
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={getRandomWord}
              className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 bg-gray-500 text-white hover:bg-gray-600"
            >
              <RefreshCw className="w-6 h-6 mr-2" />
              <span className="font-semibold">New Word</span>
            </button>
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center justify-center gap-2 text-red-400">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Recording...</span>
            </div>
          )}

          {/* Validation Result */}
          {validationResult && (
            <div className="mt-4 p-4 bg-green-900/30 border-l-4 border-green-400 rounded-md max-w-2xl">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-300 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-200 mb-2">
                    Validation Result
                  </h4>
                  {validationResult.score !== undefined && (
                    <p className="text-green-200 mb-2">
                      <strong>Score:</strong> {validationResult.score}/100
                    </p>
                  )}
                  {validationResult.transcription && (
                    <p className="text-green-200 mb-2">
                      <strong>Transcription:</strong>{" "}
                      {validationResult.transcription}
                    </p>
                  )}
                  {validationResult.feedback && (
                    <p className="text-green-200 mb-2">
                      <strong>Feedback:</strong> {validationResult.feedback}
                    </p>
                  )}
                  {validationResult.errors &&
                    validationResult.errors.length > 0 && (
                      <div className="mt-2">
                        <strong className="text-green-200">Errors:</strong>
                        <ul className="list-disc list-inside text-green-300 mt-1">
                          {validationResult.errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {validationResult.suggestions &&
                    validationResult.suggestions.length > 0 && (
                      <div className="mt-2">
                        <strong className="text-green-200">Suggestions:</strong>
                        <ul className="list-disc list-inside text-green-300 mt-1">
                          {validationResult.suggestions.map(
                            (suggestion, idx) => (
                              <li key={idx}>{suggestion}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Validation Error */}
          {validationError && (
            <div className="mt-4 p-4 bg-red-900/30 border-l-4 border-red-400 rounded-md max-w-2xl">
              <div className="flex items-start gap-2">
                <XCircle className="w-5 h-5 text-red-300 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-200 mb-1">
                    Validation Error
                  </h4>
                  <p className="text-red-300">{validationError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-purple-900/30 border-l-4 border-purple-400 rounded-md max-w-2xl">
            <p className="text-sm font-medium text-purple-200 mb-2">
              Anleitung (Instructions):
            </p>
            <ol className="text-sm text-purple-200 space-y-1 list-decimal list-inside">
              <li>
                Klicken Sie auf "Anhören", um das Wort zu hören. (Click "Listen"
                to hear the word.)
              </li>
              <li>
                Klicken Sie auf "Aufnehmen" und sprechen Sie das Wort nach.
                (Click "Record" and repeat the word.)
              </li>
              <li>
                Klicken Sie auf "Stoppen", wenn Sie fertig sind. (Click "Stop"
                when you're done.)
              </li>
              <li>
                Klicken Sie auf "Prüfen", um Ihre Aussprache validieren zu
                lassen. (Click "Validate" to have your pronunciation validated.)
              </li>
              <li>
                Klicken Sie auf "Neues Wort", um ein anderes Wort zu üben.
                (Click "New Word" to practice another word.)
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
