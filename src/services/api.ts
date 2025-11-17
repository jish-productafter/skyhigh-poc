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
 * Generate listening questions from API (with caching)
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

  // Fetch from API (via Next.js API route to avoid CORS)
  const url = new URL("/api/generate/listening", window.location.origin);
  url.searchParams.append("topic", params.topic);
  url.searchParams.append("level", params.level);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to generate listening questions: ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("Listening API response:", data);

  // Cache the response
  if (useCache) {
    setCachedData(cacheKey, data);
  }

  return data;
}

/**
 * Generate reading questions from API (with caching)
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

  // Fetch from API (via Next.js API route to avoid CORS)
  const url = new URL("/api/generate/reading", window.location.origin);
  url.searchParams.append("topic", params.topic);
  url.searchParams.append("level", params.level);
  if (params.item_id_start !== undefined) {
    url.searchParams.append("item_id_start", params.item_id_start.toString());
  }
  if (params.prefer_type) {
    url.searchParams.append("prefer_type", params.prefer_type);
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to generate reading questions: ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("Reading API response:", data);

  // Cache the response
  if (useCache) {
    setCachedData(cacheKey, data);
  }

  return data;
}

/**
 * Generate writing questions from API (with caching)
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

  // Fetch from API (via Next.js API route to avoid CORS)
  const url = new URL("/api/generate/writing", window.location.origin);
  url.searchParams.append("topic", params.topic);
  url.searchParams.append("level", params.level);
  if (params.item_id_start !== undefined) {
    url.searchParams.append("item_id_start", params.item_id_start.toString());
  }
  if (params.task_type) {
    url.searchParams.append("task_type", params.task_type);
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to generate writing questions: ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("Writing API response:", data);
  // Log the response to debug
  console.log("Writing API response:", data);
  console.log("Writing API response type:", typeof data);
  console.log("Is array?", Array.isArray(data));
  if (Array.isArray(data) && data.length > 0) {
    console.log("First writing question:", data[0]);
    console.log("First question type:", data[0]?.type);
  }

  // Cache the response
  if (useCache) {
    setCachedData(cacheKey, data);
  }

  return data;
}

/**
 * Generate speaking questions from API (with caching)
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

  // Fetch from API (via Next.js API route to avoid CORS)
  const url = new URL("/api/generate/speaking", window.location.origin);
  url.searchParams.append("topic", params.topic);
  url.searchParams.append("level", params.level);
  if (params.item_id_start !== undefined) {
    url.searchParams.append("item_id_start", params.item_id_start.toString());
  }
  if (params.interaction_type) {
    url.searchParams.append("interaction_type", params.interaction_type);
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to generate speaking questions: ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("speaking questions", data);

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
  return {
    id: apiQuestion.id,
    type: apiQuestion.type as "A_B_C" | "TextMatch" | "Lückentext",
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
