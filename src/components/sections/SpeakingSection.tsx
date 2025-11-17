"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { SpeakingSectionProps } from "@/types";
import { GermanQuestion } from "@/components/ui/GermanQuestion";
import { QuestionContainer } from "@/components/ui/QuestionContainer";
import { validateSpeaking, ApiSpeakingQuestion } from "@/services/api";

export const SpeakingSection: React.FC<SpeakingSectionProps> = ({
  questions,
  level,
}) => {
  const [recording, setRecording] = useState<Record<number, boolean>>({});
  const [recordings, setRecordings] = useState<Record<number, Blob | null>>({});
  const [validating, setValidating] = useState<Record<number, boolean>>({});
  const [validationResults, setValidationResults] = useState<
    Record<
      number,
      {
        score?: number;
        feedback?: string;
        transcription?: string;
        errors?: string[];
        suggestions?: string[];
      } | null
    >
  >({});
  const [validationErrors, setValidationErrors] = useState<
    Record<number, string | null>
  >({});
  const mediaRecorderRef = useRef<Record<number, MediaRecorder | null>>({});
  const audioChunksRef = useRef<Record<number, Blob[]>>({});

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(mediaRecorderRef.current).forEach((recorder) => {
        if (recorder && recorder.state !== "inactive") {
          recorder.stop();
        }
      });
    };
  }, []);

  const startRecording = async (questionId: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      audioChunksRef.current[questionId] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current[questionId].push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current[questionId], {
          type: "audio/webm",
        });
        setRecordings({ ...recordings, [questionId]: audioBlob });
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current[questionId] = mediaRecorder;
      mediaRecorder.start();
      setRecording({ ...recording, [questionId]: true });
      setValidationResults({ ...validationResults, [questionId]: null });
      setValidationErrors({ ...validationErrors, [questionId]: null });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setValidationErrors({
        ...validationErrors,
        [questionId]:
          "Microphone access denied. Please allow microphone access.",
      });
    }
  };

  const stopRecording = (questionId: number) => {
    const recorder = mediaRecorderRef.current[questionId];
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      setRecording({ ...recording, [questionId]: false });
    }
  };

  const handleValidate = async (question: ApiSpeakingQuestion) => {
    const audioBlob = recordings[question.id];
    if (!audioBlob) {
      setValidationErrors({
        ...validationErrors,
        [question.id]: "Please record your answer first.",
      });
      return;
    }

    console.log("=== Speaking Validation Started ===");
    console.log("Question ID:", question.id);
    console.log("Question Type:", question.type);
    console.log("Question Prompt:", question.prompt);
    console.log("Audio Blob Size:", audioBlob.size, "bytes");
    console.log("Audio Blob Type:", audioBlob.type);

    setValidating({ ...validating, [question.id]: true });
    setValidationErrors({ ...validationErrors, [question.id]: null });
    setValidationResults({ ...validationResults, [question.id]: null });

    try {
      const startTime = Date.now();
      console.log("Sending validation request to API...");

      const result = await validateSpeaking({
        speaking_task: question,
        audioFile: audioBlob,
      });

      const duration = Date.now() - startTime;
      console.log("=== Speaking Validation Success ===");
      console.log("Validation Duration:", duration, "ms");
      console.log("Validation Result:", result);
      console.log("Score:", result.score);
      console.log("Transcription:", result.transcription);
      console.log("Feedback:", result.feedback);
      console.log("Errors:", result.errors);
      console.log("Suggestions:", result.suggestions);

      setValidationResults({ ...validationResults, [question.id]: result });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to validate speaking";

      console.error("=== Speaking Validation Error ===");
      console.error("Question ID:", question.id);
      console.error("Error:", error);
      console.error("Error Message:", errorMessage);
      console.error(
        "Error Stack:",
        error instanceof Error ? error.stack : "N/A"
      );

      setValidationErrors({
        ...validationErrors,
        [question.id]: errorMessage,
      });
    } finally {
      setValidating({ ...validating, [question.id]: false });
      console.log("Validation process completed for question:", question.id);
    }
  };

  const playRecording = (questionId: number) => {
    const audioBlob = recordings[questionId];
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center text-3xl font-extrabold text-red-700 border-b pb-2">
        <Mic className="w-7 h-7 mr-3" />
        <div>
          <p>4. Sprechen</p>
          <p className="text-sm font-medium text-gray-400 mt-1 italic leading-tight">
            (4. Speaking)
          </p>
        </div>
      </div>
      <p className="text-gray-600 italic">
        Üben Sie die mündliche Prüfung. Nehmen Sie Ihre Antwort auf und lassen
        Sie sie validieren.{" "}
        <span className="text-xs font-normal opacity-80">
          (Practice the oral exam. Record your answer and have it validated.)
        </span>
      </p>
      {questions.map((q: ApiSpeakingQuestion) => (
        <QuestionContainer key={q.id} id={q.id} level={level}>
          <GermanQuestion
            germanText={q.prompt}
            englishTranslation={q.translation}
            className="mb-4"
          />

          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-md mb-4">
            <p className="text-sm font-medium text-red-700">
              Beispiel / Fokus ({q.type}):{" "}
              <span className="text-xs font-normal opacity-80">
                (Example / Focus ({q.type}):)
              </span>
            </p>
            <p className="text-md italic mt-1 text-red-800">
              {q.example || "Denken Sie sich eine Antwort aus."}{" "}
              <span className="text-xs font-normal opacity-80">
                ({q.example ? "" : "Think of an answer."})
              </span>
            </p>
          </div>

          {/* Recording Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {!recording[q.id] ? (
                <button
                  onClick={() => startRecording(q.id)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-150 flex items-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Aufnahme starten (Start Recording)
                </button>
              ) : (
                <button
                  onClick={() => stopRecording(q.id)}
                  className="px-6 py-3 bg-red-800 text-white rounded-lg shadow-md hover:bg-red-900 transition duration-150 flex items-center gap-2"
                >
                  <Square className="w-5 h-5" />
                  Aufnahme stoppen (Stop Recording)
                </button>
              )}

              {recordings[q.id] && (
                <>
                  <button
                    onClick={() => playRecording(q.id)}
                    className="px-4 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-150 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Abspielen (Play)
                  </button>
                  <button
                    onClick={() => handleValidate(q)}
                    disabled={validating[q.id]}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 flex items-center gap-2"
                  >
                    {validating[q.id] ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Antwort prüfen (Validate)
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            {recording[q.id] && (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording...</span>
              </div>
            )}

            {recordings[q.id] && !recording[q.id] && (
              <p className="text-sm text-green-600">
                ✓ Recording completed. Click "Play" to listen or "Validate" to
                check your answer.
              </p>
            )}
          </div>

          {/* Validation Result */}
          {validationResults[q.id] &&
            (() => {
              const result = validationResults[q.id]!;
              const isFailed =
                (result.score !== undefined && result.score < 70) ||
                (result.errors && result.errors.length > 0);
              const bgColor = isFailed
                ? "bg-red-50 border-red-400"
                : "bg-green-50 border-green-400";
              const textColor = isFailed ? "text-red" : "text-green";
              const Icon = isFailed ? XCircle : CheckCircle;

              return (
                <div className={`mt-4 p-4 ${bgColor} border-l-4 rounded-md`}>
                  <div className="flex items-start gap-2">
                    <Icon className={`w-5 h-5 ${textColor}-600 mt-0.5`} />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${textColor}-800 mb-2`}>
                        Validation Result
                      </h4>
                      {result.score !== undefined && (
                        <p className={`${textColor}-700 mb-2`}>
                          <strong>Score:</strong> {result.score}/100
                        </p>
                      )}
                      {result.transcription && (
                        <p className={`${textColor}-700 mb-2`}>
                          <strong>Transcription:</strong> {result.transcription}
                        </p>
                      )}
                      {result.feedback && (
                        <p className={`${textColor}-700 mb-2`}>
                          <strong>Feedback:</strong> {result.feedback}
                        </p>
                      )}
                      {result.errors && result.errors.length > 0 && (
                        <div className="mt-2">
                          <strong className={`${textColor}-800`}>
                            Errors:
                          </strong>
                          <ul
                            className={`list-disc list-inside ${textColor}-700 mt-1`}
                          >
                            {result.errors.map((error, idx) => (
                              <li key={idx}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.suggestions && result.suggestions.length > 0 && (
                        <div className="mt-2">
                          <strong className={`${textColor}-800`}>
                            Suggestions:
                          </strong>
                          <ul
                            className={`list-disc list-inside ${textColor}-700 mt-1`}
                          >
                            {result.suggestions.map((suggestion, idx) => (
                              <li key={idx}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* Validation Error */}
          {validationErrors[q.id] && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
              <div className="flex items-start gap-2">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">
                    Validation Error
                  </h4>
                  <p className="text-red-700">{validationErrors[q.id]}</p>
                </div>
              </div>
            </div>
          )}
        </QuestionContainer>
      ))}
    </div>
  );
};
