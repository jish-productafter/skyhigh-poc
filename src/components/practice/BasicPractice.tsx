"use client"

import React, { useState, useEffect, useRef } from "react"
import { Grid, Mic, Speaker, RefreshCw } from "lucide-react"
import { BASIC_GERMAN_WORDS } from "@/data"
import {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from "@/types"

export const BasicPractice: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<string>("")
  const [isListening, setIsListening] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const recognitionRef = useRef<any>(null)

  // Initialize with a random word
  useEffect(() => {
    getRandomWord()
  }, [])

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * BASIC_GERMAN_WORDS.length)
    setCurrentWord(BASIC_GERMAN_WORDS[randomIndex])
  }

  const speakWord = () => {
    if (!currentWord) return

    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(currentWord)
    utterance.lang = "de-DE"
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in your browser.")
      return
    }

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognitionClass() as SpeechRecognition
    recognition.lang = "de-DE"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim()
      const confidence = event.results[0][0].confidence || 0
      const isCorrect = transcript.toLowerCase() === currentWord.toLowerCase()

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
        })

        if (!response.ok) {
          console.error(
            "Failed to save practice record:",
            await response.text()
          )
        } else {
          const data = await response.json()
          console.log("Practice record saved:", data)
        }
      } catch (error) {
        console.error("Error sending practice record to backend:", error)
      }

      if (isCorrect) {
        alert("Richtig! Gut gemacht! (Correct! Well done!)")
      } else {
        alert(
          `Sie sagten: "${transcript}". Das richtige Wort ist: "${currentWord}". (You said: "${transcript}". The correct word is: "${currentWord}".)`
        )
      }
      setIsListening(false)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
      if (event.error === "no-speech") {
        alert(
          "Keine Sprache erkannt. Versuchen Sie es erneut. (No speech detected. Please try again.)"
        )
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      speechSynthesis.cancel()
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center text-3xl font-extrabold text-purple-700 border-b pb-2">
        <Grid className="w-7 h-7 mr-3" />
        <div>
          <p>Basic - Aussprache üben</p>
          <p className="text-sm font-medium text-gray-400 mt-1 italic leading-tight">
            (Basic - Practice Pronunciation)
          </p>
        </div>
      </div>

      <p className="text-gray-600 italic">
        Üben Sie die Aussprache deutscher Wörter. Hören Sie das Wort an und
        versuchen Sie es nachzusprechen.{" "}
        <span className="text-xs font-normal opacity-80">
          (Practice the pronunciation of German words. Listen to the word and
          try to repeat it.)
        </span>
      </p>

      <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-purple-400">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Word Display */}
          <div className="text-center">
            <p className="text-5xl font-black text-gray-800 mb-2">
              {currentWord}
            </p>
            <p className="text-sm text-gray-400 italic">
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
                {isSpeaking ? "Spricht..." : "Anhören"}
              </span>
              <span className="text-xs ml-2 opacity-80">
                ({isSpeaking ? "Speaking..." : "Listen"})
              </span>
            </button>

            {/* Mic Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 ${
                isListening
                  ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              <Mic className="w-6 h-6 mr-2" />
              <span className="font-semibold">
                {isListening ? "Stoppen" : "Sprechen"}
              </span>
              <span className="text-xs ml-2 opacity-80">
                ({isListening ? "Stop" : "Speak"})
              </span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={getRandomWord}
              className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 bg-gray-500 text-white hover:bg-gray-600"
            >
              <RefreshCw className="w-6 h-6 mr-2" />
              <span className="font-semibold">Neues Wort</span>
              <span className="text-xs ml-2 opacity-80">(New Word)</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-purple-50 border-l-4 border-purple-400 rounded-md max-w-2xl">
            <p className="text-sm font-medium text-purple-700 mb-2">
              Anleitung (Instructions):
            </p>
            <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
              <li>
                Klicken Sie auf "Anhören", um das Wort zu hören. (Click "Listen"
                to hear the word.)
              </li>
              <li>
                Klicken Sie auf "Sprechen" und sprechen Sie das Wort nach.
                (Click "Speak" and repeat the word.)
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
  )
}
