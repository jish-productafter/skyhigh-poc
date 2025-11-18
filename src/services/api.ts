// Use local Next.js API routes to avoid CORS issues
// The API routes proxy requests to the external API
const CACHE_PREFIX = "german_practice_cache_";
const CACHE_VERSION = "1.0";

/**
 * Generate a cache key from parameters
 */
function getCacheKey(
  section: string,
  params:
    | GenerateListeningParams
    | GenerateReadingParams
    | GenerateWritingParams
    | GenerateSpeakingParams
): string {
  const baseKey = `${section}_${params.level}_${params.topic}`;
  const extraParams: string[] = [];

  if ("prefer_type" in params && params.prefer_type) {
    extraParams.push(`prefer_type:${params.prefer_type}`);
  }
  if ("task_type" in params && params.task_type) {
    extraParams.push(`task_type:${params.task_type}`);
  }
  if ("interaction_type" in params && params.interaction_type) {
    extraParams.push(`interaction_type:${params.interaction_type}`);
  }
  if ("item_id_start" in params && params.item_id_start !== undefined) {
    extraParams.push(`item_id_start:${params.item_id_start}`);
  }

  return extraParams.length > 0
    ? `${baseKey}_${extraParams.join("_")}`
    : baseKey;
}

/**
 * Get cached data from localStorage
 */
function getCachedData<T>(cacheKey: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${cacheKey}`);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    // Check if cache is still valid (optional: add expiration logic here)
    return parsed.data as T;
  } catch (error) {
    console.error("Error reading from cache:", error);
    return null;
  }
}

/**
 * Store data in cache
 */
function setCachedData<T>(cacheKey: string, data: T): void {
  if (typeof window === "undefined") return;

  try {
    const cacheEntry = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(
      `${CACHE_PREFIX}${cacheKey}`,
      JSON.stringify(cacheEntry)
    );
  } catch (error) {
    console.error("Error writing to cache:", error);
    // Handle quota exceeded error gracefully
    if (error instanceof Error && error.name === "QuotaExceededError") {
      console.warn("Cache storage quota exceeded, clearing old entries");
      clearOldCacheEntries();
    }
  }
}

/**
 * Clear old cache entries if storage is full
 */
function clearOldCacheEntries(): void {
  if (typeof window === "undefined") return;

  try {
    const keys: { key: string; timestamp: number }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const parsed = JSON.parse(cached);
            keys.push({ key, timestamp: parsed.timestamp || 0 });
          }
        } catch {
          // Skip invalid entries
        }
      }
    }

    // Sort by timestamp and remove oldest 50% if we have many entries
    if (keys.length > 20) {
      keys.sort((a, b) => a.timestamp - b.timestamp);
      const toRemove = keys.slice(0, Math.floor(keys.length / 2));
      toRemove.forEach(({ key }) => localStorage.removeItem(key));
    }
  } catch (error) {
    console.error("Error clearing old cache entries:", error);
  }
}

/**
 * Clear all cached practice data
 */
export function clearPracticeCache(): void {
  if (typeof window === "undefined") return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
}

export interface ApiListeningQuestion {
  id: number;
  type: "MultipleChoice" | "RichtigFalsch";
  question: string;
  translation: string;
  audioText: string;
  audioText_translation: string;
  audioDescription: string;
  ttsPrompt: string;
  options: string[];
  options_translations: string[];
  correctAnswer: string;
  imagePlaceholder: string;
  metadata: {
    level: string;
    skill: string;
    topic: string;
    source: string;
    timestamp: string;
  };
}

export interface ApiReadingQuestion {
  id: number;
  type: string;
  question: string;
  translation: string;
  text: string;
  textTranslation: string;
  options: string[];
  options_translations: string[];
  correctAnswer: string;
  imagePlaceholder: string;
  metadata: {
    level: string;
    skill: string;
    topic: string;
    source: string;
    timestamp: string;
  };
}

export interface ApiWritingQuestion {
  id: number;
  type: string;
  prompt: string;
  translation: string;
  fields?: string[];
  minWords?: number;
  maxWords?: number;
  imagePlaceholder?: string;
  metadata: {
    level: string;
    skill: string;
    topic: string;
    source: string;
    timestamp: string;
  };
}

export interface ApiSpeakingQuestion {
  id: number;
  type: string;
  prompt: string;
  translation: string;
  example?: string;
  imagePlaceholder?: string;
  metadata: {
    level: string;
    skill: string;
    topic: string;
    source: string;
    timestamp: string;
  };
}

export interface GenerateListeningParams {
  topic: string;
  level: string;
}

export interface GenerateReadingParams {
  topic: string;
  level: string;
  item_id_start?: number;
  prefer_type?: string;
}

export interface GenerateWritingParams {
  topic: string;
  level: string;
  item_id_start?: number;
  task_type?: string;
}

export interface GenerateSpeakingParams {
  topic: string;
  level: string;
  item_id_start?: number;
  interaction_type?: string;
}

/**
 * Load syllabus data from data.json
 * This function is only called from client-side code
 */
async function loadSyllabusData(): Promise<any> {
  const response = await fetch("/data.json");
  if (!response.ok) {
    throw new Error(`Failed to load syllabus data: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Generate listening questions from data.json (with caching)
 */
export async function generateListening(
  params: GenerateListeningParams,
  useCache: boolean = true
): Promise<ApiListeningQuestion[]> {
  const cacheKey = getCacheKey("listening", params);

  // Check cache first
  if (useCache) {
    const cached = getCachedData<ApiListeningQuestion[]>(cacheKey);
    if (cached) {
      console.log("Using cached listening questions");
      return cached;
    }
  }

  // Load data from data.json
  const syllabusData = await loadSyllabusData();
  const levelData = syllabusData.syllabus[params.level];

  if (!levelData || !levelData.listening) {
    throw new Error(`No listening data found for level ${params.level}`);
  }

  // Filter by topic if needed, otherwise return all
  let questions = levelData.listening;
  if (params.topic) {
    questions = questions.filter(
      (q: any) => q.metadata?.topic === params.topic
    );
  }

  // Map to ApiListeningQuestion format
  const data: ApiListeningQuestion[] = questions.map((q: any) => ({
    id: q.id,
    type: q.type,
    question: q.question,
    translation: q.translation,
    audioText: q.audioText,
    audioText_translation: q.audioText_translation,
    audioDescription: q.audioDescription,
    ttsPrompt: q.ttsPrompt,
    options: q.options,
    options_translations: q.options_translations,
    correctAnswer: q.correctAnswer,
    imagePlaceholder: q.imagePlaceholder || "",
    metadata: q.metadata,
  }));

  console.log("Listening questions from data.json:", data);

  // Cache the response
  if (useCache) {
    setCachedData(cacheKey, data);
  }

  return data;
}

/**
 * Generate reading questions from data.json (with caching)
 */
export async function generateReading(
  params: GenerateReadingParams,
  useCache: boolean = true
): Promise<ApiReadingQuestion[]> {
  const cacheKey = getCacheKey("reading", params);

  // Check cache first
  if (useCache) {
    const cached = getCachedData<ApiReadingQuestion[]>(cacheKey);
    if (cached) {
      console.log("Using cached reading questions");
      return cached;
    }
  }

  // Load data from data.json
  const syllabusData = await loadSyllabusData();
  const levelData = syllabusData.syllabus[params.level];

  if (!levelData || !levelData.reading) {
    throw new Error(`No reading data found for level ${params.level}`);
  }

  // Filter by topic and type if needed
  let questions = levelData.reading;
  console.log(
    `Reading: Found ${questions.length} total questions for level ${params.level}`
  );

  if (params.topic) {
    const filteredByTopic = questions.filter(
      (q: any) => q.metadata?.topic === params.topic
    );
    console.log(
      `Reading: Filtered by topic "${params.topic}": ${filteredByTopic.length} questions`
    );
    // Only apply topic filter if it returns results, otherwise use all questions
    if (filteredByTopic.length > 0) {
      questions = filteredByTopic;
    } else {
      console.log(
        `Reading: Topic "${params.topic}" returned 0 results, using all questions`
      );
    }
  }
  if (params.prefer_type) {
    const beforeTypeFilter = questions.length;
    questions = questions.filter((q: any) => q.type === params.prefer_type);
    console.log(
      `Reading: Filtered by type "${params.prefer_type}": ${beforeTypeFilter} -> ${questions.length} questions`
    );
  }

  console.log(`Reading: Final questions count: ${questions.length}`);

  // Map to ApiReadingQuestion format
  const data: ApiReadingQuestion[] = questions.map((q: any) => {
    // Handle two formats:
    // 1. Separate passage field (A2+)
    // 2. Passage embedded in question field (A1) - format: "Question\n\nPassage: ...\n\nPassage Translation: ..."
    let passage = q.passage || "";
    let passageTranslation = q.passage_translation || "";
    let questionText = q.question || "";

    // If no separate passage field, try to extract from question
    if (!passage && questionText.includes("\n\nPassage:")) {
      const parts = questionText.split("\n\nPassage:");
      questionText = parts[0].trim();
      if (parts[1]) {
        const passageParts = parts[1].split("\n\nPassage Translation:");
        passage = passageParts[0]?.trim() || "";
        passageTranslation = passageParts[1]?.trim() || "";
      }
    }

    // Map question types: MultipleChoice -> A_B_C, RichtigFalsch -> A_B_C (for now)
    let mappedType = q.type;
    if (q.type === "MultipleChoice" || q.type === "RichtigFalsch") {
      mappedType = "A_B_C"; // ReadingSection expects A_B_C type
    }

    // NOTE: For A1 level, the data.json has English text in the 'options' field
    // instead of German. This is a data quality issue. A2+ levels have correct
    // German text in 'options' and English in 'options_translations'.
    // The component expects German in 'options', so A1 questions will display
    // English until the data.json is corrected.
    const options = q.options || [];

    // Warn if options appear to be in English (for A1 data quality issue)
    if (params.level === "A1" && options.length > 0) {
      const firstOption = options[0]?.toLowerCase() || "";
      // Simple heuristic: if first option contains common English words, it's likely English
      if (
        firstOption.includes("fashion") ||
        firstOption.includes("design") ||
        firstOption.includes("equipment") ||
        firstOption.includes("accessories")
      ) {
        console.warn(
          `A1 Reading question ${q.id} has English text in options field. Expected German.`
        );
      }
    }

    return {
      id: q.id,
      type: mappedType,
      question: questionText,
      translation: q.question_translation || q.translation || "",
      text: passage,
      textTranslation: passageTranslation,
      options: options, // Should be German, but A1 data has English
      options_translations: q.options_translations || [],
      correctAnswer: q.correctAnswer,
      imagePlaceholder: q.imagePlaceholder || "",
      metadata: q.metadata,
    };
  });

  console.log("Reading questions from data.json:", data);

  // Cache the response
  if (useCache) {
    setCachedData(cacheKey, data);
  }

  return data;
}

/**
 * Generate writing questions from data.json (with caching)
 */
export async function generateWriting(
  params: GenerateWritingParams,
  useCache: boolean = true
): Promise<ApiWritingQuestion[]> {
  const cacheKey = getCacheKey("writing", params);

  // Check cache first
  if (useCache) {
    const cached = getCachedData<ApiWritingQuestion[]>(cacheKey);
    if (cached) {
      console.log("Using cached writing questions");
      return cached;
    }
  }

  // Load data from data.json
  const syllabusData = await loadSyllabusData();
  console.log("Syllabus data:", syllabusData);
  console.log("level", params.level);
  const levelData = syllabusData.syllabus[params.level];

  console.log("Level data:", levelData);

  if (!levelData || !levelData.writing) {
    throw new Error(`No writing data found for level ${params.level}`);
  }

  // Filter by topic and task_type if needed
  let questions = levelData.writing;

  // Cache the response
  if (useCache) {
    setCachedData(cacheKey, questions);
  }

  return questions;
}

/**
 * Generate speaking questions from data.json (with caching)
 */
export async function generateSpeaking(
  params: GenerateSpeakingParams,
  useCache: boolean = true
): Promise<ApiSpeakingQuestion[]> {
  const cacheKey = getCacheKey("speaking", params);

  // Check cache first
  if (useCache) {
    const cached = getCachedData<ApiSpeakingQuestion[]>(cacheKey);
    if (cached) {
      console.log("Using cached speaking questions");
      return cached;
    }
  }

  // Load data from data.json
  const syllabusData = await loadSyllabusData();
  const levelData = syllabusData.syllabus[params.level];

  if (!levelData || !levelData.speaking) {
    throw new Error(`No speaking data found for level ${params.level}`);
  }

  // Filter by topic and interaction_type if needed
  let questions = levelData.speaking;
  if (params.topic) {
    questions = questions.filter(
      (q: any) => q.metadata?.topic === params.topic
    );
  }
  if (params.interaction_type) {
    questions = questions.filter(
      (q: any) => q.metadata?.interaction_type === params.interaction_type
    );
  }

  // Map to ApiSpeakingQuestion format
  const data: ApiSpeakingQuestion[] = questions.map((q: any) => ({
    id: q.id,
    type: q.type,
    prompt: q.prompt || q.task_description || "",
    translation: q.prompt_translation || "",
    example: q.example_response || "",
    imagePlaceholder: q.imagePlaceholder || "",
    metadata: q.metadata,
  }));

  console.log("Speaking questions from data.json:", data);

  // Cache the response
  if (useCache) {
    setCachedData(cacheKey, data);
  }

  return data;
}

/**
 * Convert API listening question to app question format
 */
export function adaptListeningQuestion(
  apiQuestion: ApiListeningQuestion
): import("@/types").ListeningQuestion {
  return {
    id: apiQuestion.id,
    type: apiQuestion.type,
    question: apiQuestion.question,
    translation: apiQuestion.translation,
    audioDescription: apiQuestion.audioDescription,
    audioText: apiQuestion.audioText,
    audioText_translation: apiQuestion.audioText_translation,
    ttsPrompt: apiQuestion.ttsPrompt,
    options: apiQuestion.options,
    correctAnswer: apiQuestion.correctAnswer,
    imagePlaceholder: apiQuestion.imagePlaceholder,
  };
}

/**
 * Convert API reading question to app question format
 */
export function adaptReadingQuestion(
  apiQuestion: ApiReadingQuestion
): import("@/types").ReadingQuestion {
  // Map types to expected ReadingQuestion types
  let mappedType: "A_B_C" | "TextMatch" | "Lückentext" = "A_B_C";
  if (apiQuestion.type === "TextMatch" || apiQuestion.type === "textmatch") {
    mappedType = "TextMatch";
  } else if (
    apiQuestion.type === "Lückentext" ||
    apiQuestion.type === "lückentext"
  ) {
    mappedType = "Lückentext";
  } else {
    // Default to A_B_C for MultipleChoice, RichtigFalsch, etc.
    mappedType = "A_B_C";
  }

  return {
    id: apiQuestion.id,
    type: mappedType,
    text: apiQuestion.text,
    textTranslation: apiQuestion.textTranslation,
    question: apiQuestion.question,
    translation: apiQuestion.translation,
    options: apiQuestion.options || [],
    correctAnswer: apiQuestion.correctAnswer,
    imagePlaceholder: apiQuestion.imagePlaceholder,
  };
}

/**
 * Convert API writing question to app question format
 */
export function adaptWritingQuestion(
  apiQuestion: ApiWritingQuestion
): import("@/types").WritingQuestion {
  console.log("Adapting writing question:", apiQuestion);

  if (apiQuestion.type === "Formular" || apiQuestion.type === "formular") {
    return {
      id: apiQuestion.id,
      type: "Formular",
      prompt: apiQuestion.prompt,
      translation: apiQuestion.translation,
      fields: apiQuestion.fields || [],
      imagePlaceholder: apiQuestion.imagePlaceholder,
    };
  } else {
    // Map common API types to our expected types
    let mappedType: "Brief" | "Kommentar" = "Brief";
    if (
      apiQuestion.type === "Kommentar" ||
      apiQuestion.type === "kommentar" ||
      apiQuestion.type === "comment"
    ) {
      mappedType = "Kommentar";
    } else if (
      apiQuestion.type === "email" ||
      apiQuestion.type === "Email" ||
      apiQuestion.type === "Brief" ||
      apiQuestion.type === "brief"
    ) {
      mappedType = "Brief";
    }

    return {
      id: apiQuestion.id,
      type: mappedType,
      prompt: apiQuestion.prompt,
      translation: apiQuestion.translation,
      minWords: apiQuestion.minWords || 0,
      maxWords: apiQuestion.maxWords || 0,
      imagePlaceholder: apiQuestion.imagePlaceholder,
    };
  }
}

/**
 * Convert API speaking question to app question format
 */
export function adaptSpeakingQuestion(
  apiQuestion: ApiSpeakingQuestion
): import("@/types").SpeakingQuestion {
  return {
    id: apiQuestion.id,
    type: apiQuestion.type as "Vorstellen" | "Präsentation" | "Diskussion",
    prompt: apiQuestion.prompt,
    translation: apiQuestion.translation,
    example: apiQuestion.example,
    imagePlaceholder: apiQuestion.imagePlaceholder,
  };
}

export interface ValidateWritingParams {
  writing_task: ApiWritingQuestion | import("@/types").WritingQuestion;
  user_response: string;
}

export interface WritingValidationResult {
  score?: number;
  feedback?: string;
  errors?: string[];
  suggestions?: string[];
  [key: string]: any;
}

/**
 * Validate a writing response
 */
export async function validateWriting(
  params: ValidateWritingParams
): Promise<WritingValidationResult> {
  console.log("[API] validateWriting called");
  console.log("[API] Writing Task (object):", params.writing_task);
  console.log("[API] User Response Length:", params.user_response.length);

  // Convert writing task (full question details object) to JSON string for the API
  const writingTaskJson = JSON.stringify(params.writing_task);
  // User response should be sent as-is (plain input string), not double-encoded
  const userResponse = params.user_response;

  console.log("[API] Writing Task JSON:", writingTaskJson);
  console.log(
    "[API] User Response (plain):",
    userResponse.substring(0, 100) + "..."
  );

  const formData = new URLSearchParams();
  formData.append("writing_task", writingTaskJson);
  formData.append("user_response", userResponse);

  const url = new URL("/api/validate/writing", window.location.origin);
  console.log("[API] Request URL:", url.toString());
  console.log("[API] FormData values:", {
    writing_task: formData.get("writing_task")?.substring(0, 50) + "...",
    user_response: formData.get("user_response")?.substring(0, 50) + "...",
  });

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  console.log("[API] Response Status:", response.status);
  console.log("[API] Response OK:", response.ok);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: response.statusText,
    }));
    console.error("[API] Validation Error Response:", errorData);
    throw new Error(
      `Failed to validate writing: ${errorData.detail || response.statusText}`
    );
  }

  const result = await response.json();
  console.log("[API] Validation Success Response:", result);
  return result;
}

export interface ValidateSpeakingParams {
  speaking_task: ApiSpeakingQuestion | import("@/types").SpeakingQuestion;
  audioFile: Blob;
}

export interface SpeakingValidationResult {
  score?: number;
  feedback?: string;
  transcription?: string;
  errors?: string[];
  suggestions?: string[];
  [key: string]: any;
}

/**
 * Validate a speaking response (audio file)
 */
export async function validateSpeaking(
  params: ValidateSpeakingParams
): Promise<SpeakingValidationResult> {
  console.log("[API] validateSpeaking called");
  console.log("[API] Speaking Task:", params.speaking_task);
  console.log("[API] Audio File Size:", params.audioFile.size, "bytes");
  console.log("[API] Audio File Type:", params.audioFile.type);

  const formData = new FormData();
  formData.append("file", params.audioFile, "recording.mp3");
  formData.append("speaking_task", JSON.stringify(params.speaking_task));

  console.log(
    "[API] Speaking Task JSON:",
    JSON.stringify(params.speaking_task)
  );
  console.log("[API] FormData entries:", {
    hasFile: formData.has("file"),
    hasTask: formData.has("speaking_task"),
  });

  const url = new URL("/api/validate/speaking", window.location.origin);
  console.log("[API] Request URL:", url.toString());

  const response = await fetch(url.toString(), {
    method: "POST",
    body: formData,
  });

  console.log("[API] Response Status:", response.status);
  console.log("[API] Response OK:", response.ok);
  console.log(
    "[API] Response Headers:",
    Object.fromEntries(response.headers.entries())
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: response.statusText,
    }));
    console.error("[API] Validation Error Response:", errorData);
    throw new Error(
      `Failed to validate speaking: ${errorData.detail || response.statusText}`
    );
  }

  const result = await response.json();
  console.log("[API] Validation Success Response:", result);
  return result;
}
