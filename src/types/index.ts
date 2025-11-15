// Speech Recognition API types
export interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

export interface Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof webkitSpeechRecognition;
}

export type QuestionType =
  | "MultipleChoice"
  | "RichtigFalsch"
  | "A_B_C"
  | "TextMatch"
  | "Lückentext"
  | "Formular"
  | "Brief"
  | "Kommentar"
  | "Vorstellen"
  | "Präsentation"
  | "Diskussion";

export interface BaseQuestion {
  id: number;
  type: QuestionType;
  imagePlaceholder?: string;
}

export interface ListeningQuestion extends BaseQuestion {
  type: "MultipleChoice" | "RichtigFalsch";
  question: string;
  translation: string;
  audioDescription: string;
  audioText?: string;
  audioText_translation?: string;
  ttsPrompt?: string;
  options: string[];
  correctAnswer: string;
}

export interface ReadingQuestion extends BaseQuestion {
  type: "A_B_C" | "TextMatch" | "Lückentext";
  text: string;
  textTranslation: string;
  question: string;
  translation: string;
  options: string[];
  correctAnswer: string;
}

export interface WritingFormQuestion extends BaseQuestion {
  type: "Formular";
  prompt: string;
  translation: string;
  fields: string[];
}

export interface WritingLetterQuestion extends BaseQuestion {
  type: "Brief" | "Kommentar";
  prompt: string;
  translation: string;
  minWords: number;
  maxWords: number;
}

export type WritingQuestion = WritingFormQuestion | WritingLetterQuestion;

export interface SpeakingQuestion extends BaseQuestion {
  type: "Vorstellen" | "Präsentation" | "Diskussion";
  prompt: string;
  translation: string;
  example?: string;
}

export interface ExamContent {
  title: string;
  englishTitle: string;
  LISTENING: ListeningQuestion[];
  READING: ReadingQuestion[];
  WRITING: WritingQuestion[];
  SPEAKING: SpeakingQuestion[];
}

export type Level = "A1" | "A2" | "B1" | "B2";
export type Section = "LISTENING" | "READING" | "WRITING" | "SPEAKING";

export interface GermanQuestionProps {
  germanText: string;
  englishTranslation?: string;
  size?: "3xl" | "2xl" | "lg" | "md" | "sm";
  className?: string;
}

export interface LevelCardProps {
  level: Level;
  description: string;
  englishDescription: string;
  onClick: () => void;
  color: string;
}

export interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  englishTitle: string;
  description: string;
  englishDescription: string;
  onClick: () => void;
  color: string;
}

export interface QuestionContainerProps {
  id: number;
  children: React.ReactNode;
  level: Level;
}

export interface AnswerFeedbackProps {
  isCorrect: boolean;
}

export interface SectionProps {
  questions: any[];
  level: Level;
}
