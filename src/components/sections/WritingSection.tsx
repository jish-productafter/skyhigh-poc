"use client";

import React, { useState, useMemo } from "react";
import { PenTool, CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  SectionProps,
  WritingFormQuestion,
  WritingLetterQuestion,
} from "@/types";
import { GermanQuestion } from "@/components/ui/GermanQuestion";
import { QuestionContainer } from "@/components/ui/QuestionContainer";
import { validateWriting } from "@/services/api";

export const WritingSection: React.FC<SectionProps> = ({
  questions,
  level,
}) => {
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [essayAnswer, setEssayAnswer] = useState("");
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    score?: number;
    feedback?: string;
    errors?: string[];
    suggestions?: string[];
    questionId?: number;
  } | null>(null);
  const [validationError, setValidationError] = useState<{
    message: string;
    questionId?: number;
  } | null>(null);

  const wordCount = useMemo(() => {
    return essayAnswer
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }, [essayAnswer]);

  // Debug: Log questions to see what we're receiving
  console.log("WritingSection questions:", questions);
  console.log("Questions length:", questions.length);

  const formQuestion = questions.find((q) => q.type === "Formular") as
    | WritingFormQuestion
    | undefined;
  const briefQuestion = questions.find(
    (q) => q.type === "Brief" || q.type === "Kommentar"
  ) as WritingLetterQuestion | undefined;

  const handleValidate = async (
    question: WritingFormQuestion | WritingLetterQuestion
  ) => {
    const userResponse =
      question.type === "Formular" ? JSON.stringify(formAnswers) : essayAnswer;

    if (!userResponse || userResponse.trim().length === 0) {
      setValidationError({
        message: "Please write something before validating.",
        questionId: question.id,
      });
      return;
    }

    setValidating(true);
    setValidationError(null);
    setValidationResult(null);

    try {
      const result = await validateWriting({
        writing_task: question,
        user_response: userResponse,
      });
      setValidationResult({ ...result, questionId: question.id });
    } catch (error) {
      setValidationError({
        message:
          error instanceof Error ? error.message : "Failed to validate writing",
        questionId: question.id,
      });
      console.error("Validation error:", error);
    } finally {
      setValidating(false);
    }
  };

  console.log("Form question found:", formQuestion);
  console.log("Brief question found:", briefQuestion);

  // Show message if no questions are available
  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center text-3xl font-extrabold text-orange-700 border-b pb-2">
          <PenTool className="w-7 h-7 mr-3" />
          <div>
            <p>3. Schreiben</p>
            <p className="text-sm font-medium text-gray-400 mt-1 italic leading-tight">
              (3. Writing)
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">No writing questions available</p>
          <p className="text-sm text-gray-400 mt-2">
            (Keine Schreibaufgaben verfügbar)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center text-3xl font-extrabold text-orange-700 border-b pb-2">
        <PenTool className="w-7 h-7 mr-3" />
        <div>
          <p>3. Schreiben</p>
          <p className="text-sm font-medium text-gray-400 mt-1 italic leading-tight">
            (3. Writing)
          </p>
        </div>
      </div>
      <p className="text-gray-600 italic">
        Schreiben Sie eine Nachricht oder füllen Sie ein Formular aus. Achten
        Sie auf die vorgegebene Wortanzahl.{" "}
        <span className="text-xs font-normal opacity-80">
          (Write a message or fill out a form. Pay attention to the specified
          word count.)
        </span>
      </p>

      {/* Task 1: Formular (A1 only) or Brief/Kommentar */}
      {formQuestion && (
        <QuestionContainer id={formQuestion.id} level={level}>
          <GermanQuestion
            germanText="Teil 1: Formular ausfüllen"
            englishTranslation="Part 1: Filling out a form"
            size="2xl"
            className="mb-4"
          />
          <GermanQuestion
            germanText={formQuestion.prompt}
            englishTranslation={formQuestion.translation}
            size="sm"
            className="mb-4"
          />

          <div className="space-y-3">
            {formQuestion.fields.map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field}:{" "}
                  <span className="text-xs text-gray-400 italic">
                    ({field})
                  </span>
                </label>
                <input
                  type="text"
                  id={field}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder={`Ihr ${field} hier (Your ${field} here)`}
                  value={formAnswers[field] || ""}
                  onChange={(e) =>
                    setFormAnswers({ ...formAnswers, [field]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>

          {/* Validation Button for Form */}
          <button
            onClick={() => handleValidate(formQuestion)}
            disabled={validating || Object.keys(formAnswers).length === 0}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 flex items-center gap-2"
          >
            {validating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Antwort prüfen (Validate Answer)
              </>
            )}
          </button>

          {/* Validation Result for Form */}
          {validationResult &&
            formQuestion &&
            validationResult.questionId === formQuestion.id && (
              <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-md">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Validation Result
                    </h4>
                    {validationResult.score !== undefined && (
                      <p className="text-green-700 mb-2">
                        <strong>Score:</strong> {validationResult.score}/100
                      </p>
                    )}
                    {validationResult.feedback && (
                      <p className="text-green-700 mb-2">
                        <strong>Feedback:</strong> {validationResult.feedback}
                      </p>
                    )}
                    {validationResult.errors &&
                      validationResult.errors.length > 0 && (
                        <div className="mt-2">
                          <strong className="text-green-800">Errors:</strong>
                          <ul className="list-disc list-inside text-green-700 mt-1">
                            {validationResult.errors.map((error, idx) => (
                              <li key={idx}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {validationResult.suggestions &&
                      validationResult.suggestions.length > 0 && (
                        <div className="mt-2">
                          <strong className="text-green-800">
                            Suggestions:
                          </strong>
                          <ul className="list-disc list-inside text-green-700 mt-1">
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

          {/* Validation Error for Form */}
          {validationError &&
            formQuestion &&
            validationError.questionId === formQuestion.id && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">
                      Validation Error
                    </h4>
                    <p className="text-red-700">{validationError.message}</p>
                  </div>
                </div>
              </div>
            )}
        </QuestionContainer>
      )}
      {/* Task 2: Brief / E-Mail / Kommentar */}
      {briefQuestion && (
        <QuestionContainer id={briefQuestion.id} level={level}>
          <GermanQuestion
            germanText={`Teil ${formQuestion ? "2" : "1"}: ${
              briefQuestion.type === "Kommentar"
                ? "Kommentar verfassen"
                : "Mitteilung verfassen"
            }`}
            englishTranslation={`Part ${formQuestion ? "2" : "1"}: Write a ${
              briefQuestion.type === "Kommentar" ? "commentary" : "message"
            }`}
            size="2xl"
            className="mb-4"
          />
          <GermanQuestion
            germanText={briefQuestion.prompt}
            englishTranslation={briefQuestion.translation}
            size="sm"
            className="mb-4"
          />

          <textarea
            rows={8}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 resize-none"
            placeholder="Ihre Antwort hier... (Your answer here...)"
            value={essayAnswer}
            onChange={(e) => setEssayAnswer(e.target.value)}
          ></textarea>
          <p
            className={`text-sm mt-2 font-medium ${
              wordCount < briefQuestion.minWords ||
              wordCount > briefQuestion.maxWords
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            Wortzahl: {wordCount} (Ziel: {briefQuestion.minWords}-
            {briefQuestion.maxWords} Wörter){" "}
            <span className="text-xs font-normal opacity-80">
              (Word count: {wordCount} | Target: {briefQuestion.minWords}-
              {briefQuestion.maxWords} words)
            </span>
          </p>
          <div className="mt-4 p-3 bg-orange-50 border-l-4 border-orange-400 text-orange-700 rounded-md">
            <strong>Tipp (Tip):</strong> Achten Sie auf Struktur, passende
            Anrede und Grußformel (für Briefe) oder eine klare Argumentation
            (für Kommentare).
          </div>

          {/* Validation Button */}
          <button
            onClick={() => handleValidate(briefQuestion)}
            disabled={validating || !essayAnswer.trim()}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 flex items-center gap-2"
          >
            {validating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Antwort prüfen (Validate Answer)
              </>
            )}
          </button>

          {/* Validation Result */}
          {validationResult &&
            briefQuestion &&
            validationResult.questionId === briefQuestion.id && (
              <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-md">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Validation Result
                    </h4>
                    {validationResult.score !== undefined && (
                      <p className="text-green-700 mb-2">
                        <strong>Score:</strong> {validationResult.score}/100
                      </p>
                    )}
                    {validationResult.feedback && (
                      <p className="text-green-700 mb-2">
                        <strong>Feedback:</strong> {validationResult.feedback}
                      </p>
                    )}
                    {validationResult.errors &&
                      validationResult.errors.length > 0 && (
                        <div className="mt-2">
                          <strong className="text-green-800">Errors:</strong>
                          <ul className="list-disc list-inside text-green-700 mt-1">
                            {validationResult.errors.map((error, idx) => (
                              <li key={idx}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {validationResult.suggestions &&
                      validationResult.suggestions.length > 0 && (
                        <div className="mt-2">
                          <strong className="text-green-800">
                            Suggestions:
                          </strong>
                          <ul className="list-disc list-inside text-green-700 mt-1">
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
          {validationError &&
            briefQuestion &&
            validationError.questionId === briefQuestion.id && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">
                      Validation Error
                    </h4>
                    <p className="text-red-700">{validationError.message}</p>
                  </div>
                </div>
              </div>
            )}
        </QuestionContainer>
      )}

      {/* Show message if no questions match expected types */}
      {!formQuestion && !briefQuestion && questions.length > 0 && (
        <div className="text-center py-8 border border-orange-200 rounded-lg bg-orange-50">
          <p className="text-orange-700 font-medium">
            No matching writing questions found
          </p>
          <p className="text-sm text-orange-600 mt-2">
            (Keine passenden Schreibaufgaben gefunden)
          </p>
          <p className="text-xs text-orange-500 mt-2">
            Available question types: {questions.map((q) => q.type).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};
