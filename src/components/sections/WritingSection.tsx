"use client";

import React, { useState } from "react";
import { PenTool, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { WritingSectionProps } from "@/types";
import { GermanQuestion } from "@/components/ui/GermanQuestion";
import { QuestionContainer } from "@/components/ui/QuestionContainer";
import { validateWriting, ApiWritingQuestion } from "@/services/api";

export const WritingSection: React.FC<WritingSectionProps> = ({
  questions,
  level,
}) => {
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});
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

  // Debug: Log questions to see what we're receiving
  console.log("WritingSection questions:", questions);
  console.log("Questions length:", questions.length);

  const handleValidate = async (question: ApiWritingQuestion) => {
    let userResponse: string;
    if (
      (question.type === "Formular" || question.type === "formular") &&
      question.fields
    ) {
      // Collect form answers for this specific question
      const questionFormAnswers: Record<string, string> = {};
      question.fields.forEach((field) => {
        const key = `${question.id}-${field}`;
        if (formAnswers[key]) {
          questionFormAnswers[field] = formAnswers[key];
        }
      });
      userResponse = JSON.stringify(questionFormAnswers);
    } else {
      userResponse = essayAnswers[question.id] || "";
    }

    if (!userResponse || userResponse.trim().length === 0) {
      setValidationError({
        message: "Please write something before validating.",
        questionId: question.id,
      });
      return;
    }

    console.log("=== Writing Validation Started ===");
    console.log("Question ID:", question.id);
    console.log("Question Type:", question.type);
    console.log("Question Prompt:", question.prompt);
    console.log("User Response Length:", userResponse.length, "characters");
    if (question.type === "Formular" || question.type === "formular") {
      console.log("Form Answers:", formAnswers);
    } else {
      const wordCount = userResponse
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
      console.log("Word Count:", wordCount);
      console.log("Min Words:", question.minWords);
      console.log("Max Words:", question.maxWords);
    }

    setValidating(true);
    setValidationError(null);
    setValidationResult(null);

    try {
      const startTime = Date.now();
      console.log("Sending validation request to API...");
      console.log("Writing Task (full question object):", question);
      console.log("User Response (plain string):", userResponse);

      const result = await validateWriting({
        writing_task: question, // Full question object - will be converted to JSON string in api.ts
        user_response: userResponse, // Plain input string
      });

      const duration = Date.now() - startTime;
      console.log("=== Writing Validation Success ===");
      console.log("Validation Duration:", duration, "ms");
      console.log("Validation Result:", result);
      console.log("Score:", result.score);
      console.log("Feedback:", result.feedback);
      console.log("Errors:", result.errors);
      console.log("Suggestions:", result.suggestions);

      setValidationResult({ ...result, questionId: question.id });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to validate writing";

      console.error("=== Writing Validation Error ===");
      console.error("Question ID:", question.id);
      console.error("Error:", error);
      console.error("Error Message:", errorMessage);
      console.error(
        "Error Stack:",
        error instanceof Error ? error.stack : "N/A"
      );

      setValidationError({
        message: errorMessage,
        questionId: question.id,
      });
    } finally {
      setValidating(false);
      console.log("Validation process completed for question:", question.id);
    }
  };

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

      {questions.map((question, index) => {
        const isFormQuestion =
          question.type === "Formular" || question.type === "formular";
        const isBriefQuestion =
          question.type === "Brief" ||
          question.type === "brief" ||
          question.type === "Kommentar" ||
          question.type === "kommentar" ||
          question.type === "email" ||
          question.type === "Email";

        if (isFormQuestion && question.fields) {
          return (
            <QuestionContainer key={question.id} id={question.id} level={level}>
              <GermanQuestion
                germanText={`Teil ${index + 1}: Formular ausfüllen`}
                englishTranslation={`Part ${index + 1}: Filling out a form`}
                size="2xl"
                className="mb-4"
              />
              <GermanQuestion
                germanText={question.prompt}
                englishTranslation={question.translation}
                size="sm"
                className="mb-4"
              />

              <div className="space-y-3">
                {question.fields.map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={`${question.id}-${field}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field}:{" "}
                      <span className="text-xs text-gray-400 italic">
                        ({field})
                      </span>
                    </label>
                    <input
                      type="text"
                      id={`${question.id}-${field}`}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder={`Ihr ${field} hier (Your ${field} here)`}
                      value={formAnswers[`${question.id}-${field}`] || ""}
                      onChange={(e) =>
                        setFormAnswers({
                          ...formAnswers,
                          [`${question.id}-${field}`]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Validation Button for Form */}
              <button
                onClick={() => handleValidate(question)}
                disabled={
                  validating ||
                  !question.fields.some(
                    (field) => formAnswers[`${question.id}-${field}`]
                  )
                }
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
                validationResult.questionId === question.id &&
                (() => {
                  const isFailed =
                    (validationResult.score !== undefined &&
                      validationResult.score < 70) ||
                    (validationResult.errors &&
                      validationResult.errors.length > 0);
                  const bgColor = isFailed
                    ? "bg-red-50 border-red-400"
                    : "bg-green-50 border-green-400";
                  const textColor = isFailed ? "text-red" : "text-green";
                  const Icon = isFailed ? XCircle : CheckCircle;

                  return (
                    <div
                      className={`mt-4 p-4 ${bgColor} border-l-4 rounded-md`}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className={`w-5 h-5 ${textColor}-600 mt-0.5`} />
                        <div className="flex-1">
                          <h4 className={`font-semibold ${textColor}-800 mb-2`}>
                            Validation Result
                          </h4>
                          {validationResult.score !== undefined && (
                            <p className={`${textColor}-700 mb-2`}>
                              <strong>Score:</strong> {validationResult.score}
                              /100
                            </p>
                          )}
                          {validationResult.feedback && (
                            <p className={`${textColor}-700 mb-2`}>
                              <strong>Feedback:</strong>{" "}
                              {validationResult.feedback}
                            </p>
                          )}
                          {validationResult.errors &&
                            validationResult.errors.length > 0 && (
                              <div className="mt-2">
                                <strong className={`${textColor}-800`}>
                                  Errors:
                                </strong>
                                <ul
                                  className={`list-disc list-inside ${textColor}-700 mt-1`}
                                >
                                  {validationResult.errors.map((error, idx) => (
                                    <li key={idx}>{error}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          {validationResult.suggestions &&
                            validationResult.suggestions.length > 0 && (
                              <div className="mt-2">
                                <strong className={`${textColor}-800`}>
                                  Suggestions:
                                </strong>
                                <ul
                                  className={`list-disc list-inside ${textColor}-700 mt-1`}
                                >
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
                  );
                })()}

              {/* Validation Error for Form */}
              {validationError &&
                validationError.questionId === question.id && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 mb-1">
                          Validation Error
                        </h4>
                        <p className="text-red-700">
                          {validationError.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </QuestionContainer>
          );
        }

        if (isBriefQuestion) {
          const questionEssayAnswer = essayAnswers[question.id] || "";
          const questionWordCount = questionEssayAnswer
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
          const isKommentar =
            question.type === "Kommentar" || question.type === "kommentar";

          return (
            <QuestionContainer key={question.id} id={question.id} level={level}>
              <GermanQuestion
                germanText={`Teil ${index + 1}: ${
                  isKommentar ? "Kommentar verfassen" : "Mitteilung verfassen"
                }`}
                englishTranslation={`Part ${index + 1}: Write a ${
                  isKommentar ? "commentary" : "message"
                }`}
                size="2xl"
                className="mb-4"
              />
              <GermanQuestion
                germanText={question.prompt}
                englishTranslation={question.translation}
                size="sm"
                className="mb-4"
              />

              <textarea
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Ihre Antwort hier... (Your answer here...)"
                value={questionEssayAnswer}
                onChange={(e) =>
                  setEssayAnswers({
                    ...essayAnswers,
                    [question.id]: e.target.value,
                  })
                }
              ></textarea>
              <p
                className={`text-sm mt-2 font-medium ${
                  (question.minWords &&
                    questionWordCount < question.minWords) ||
                  (question.maxWords && questionWordCount > question.maxWords)
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                Wortzahl: {questionWordCount}
                {question.minWords && question.maxWords && (
                  <>
                    {" "}
                    (Ziel: {question.minWords}-{question.maxWords} Wörter)
                  </>
                )}{" "}
                <span className="text-xs font-normal opacity-80">
                  (Word count: {questionWordCount}
                  {question.minWords &&
                    question.maxWords &&
                    ` | Target: ${question.minWords}-${question.maxWords} words`}
                  )
                </span>
              </p>
              <div className="mt-4 p-3 bg-orange-50 border-l-4 border-orange-400 text-orange-700 rounded-md">
                <strong>Tipp (Tip):</strong> Achten Sie auf Struktur, passende
                Anrede und Grußformel (für Briefe) oder eine klare Argumentation
                (für Kommentare).
              </div>

              {/* Validation Button */}
              <button
                onClick={() => handleValidate(question)}
                disabled={validating || !questionEssayAnswer.trim()}
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
                validationResult.questionId === question.id &&
                (() => {
                  const isFailed =
                    (validationResult.score !== undefined &&
                      validationResult.score < 70) ||
                    (validationResult.errors &&
                      validationResult.errors.length > 0);
                  const bgColor = isFailed
                    ? "bg-red-50 border-red-400"
                    : "bg-green-50 border-green-400";
                  const textColor = isFailed ? "text-red" : "text-green";
                  const Icon = isFailed ? XCircle : CheckCircle;

                  return (
                    <div
                      className={`mt-4 p-4 ${bgColor} border-l-4 rounded-md`}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className={`w-5 h-5 ${textColor}-600 mt-0.5`} />
                        <div className="flex-1">
                          <h4 className={`font-semibold ${textColor}-800 mb-2`}>
                            Validation Result
                          </h4>
                          {validationResult.score !== undefined && (
                            <p className={`${textColor}-700 mb-2`}>
                              <strong>Score:</strong> {validationResult.score}
                              /100
                            </p>
                          )}
                          {validationResult.feedback && (
                            <p className={`${textColor}-700 mb-2`}>
                              <strong>Feedback:</strong>{" "}
                              {validationResult.feedback}
                            </p>
                          )}
                          {validationResult.errors &&
                            validationResult.errors.length > 0 && (
                              <div className="mt-2">
                                <strong className={`${textColor}-800`}>
                                  Errors:
                                </strong>
                                <ul
                                  className={`list-disc list-inside ${textColor}-700 mt-1`}
                                >
                                  {validationResult.errors.map((error, idx) => (
                                    <li key={idx}>{error}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          {validationResult.suggestions &&
                            validationResult.suggestions.length > 0 && (
                              <div className="mt-2">
                                <strong className={`${textColor}-800`}>
                                  Suggestions:
                                </strong>
                                <ul
                                  className={`list-disc list-inside ${textColor}-700 mt-1`}
                                >
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
                  );
                })()}

              {/* Validation Error */}
              {validationError &&
                validationError.questionId === question.id && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 mb-1">
                          Validation Error
                        </h4>
                        <p className="text-red-700">
                          {validationError.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </QuestionContainer>
          );
        }

        return null;
      })}

      {/* Show message if no questions match expected types */}
      {questions.length > 0 &&
        !questions.some(
          (q) =>
            q.type === "Formular" ||
            q.type === "formular" ||
            q.type === "Brief" ||
            q.type === "brief" ||
            q.type === "Kommentar" ||
            q.type === "kommentar" ||
            q.type === "email" ||
            q.type === "Email"
        ) && (
          <div className="text-center py-8 border border-orange-200 rounded-lg bg-orange-50">
            <p className="text-orange-700 font-medium">
              No matching writing questions found
            </p>
            <p className="text-sm text-orange-600 mt-2">
              (Keine passenden Schreibaufgaben gefunden)
            </p>
            <p className="text-xs text-orange-500 mt-2">
              Available question types:{" "}
              {questions.map((q) => q.type).join(", ")}
            </p>
          </div>
        )}
    </div>
  );
};
