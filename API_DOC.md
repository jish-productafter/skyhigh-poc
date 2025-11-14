# API Documentation - German Language Learning Platform

## Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
   - [Level Management](#level-management)
   - [Section Management](#section-management)
   - [Question Management](#question-management)
   - [Answer Submission](#answer-submission)
   - [Practice Recording](#practice-recording)
   - [Audio Management](#audio-management)
   - [Progress Tracking](#progress-tracking)
   - [User Management](#user-management)

---

## Overview

This API documentation describes all endpoints required for the German Language Learning Platform (Goethe-Zertifikat Practice System). The platform supports multiple proficiency levels (A1, A2, B1, B2) and includes sections for Listening, Reading, Writing, and Speaking practice.

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

---

## Authentication

**Note:** Currently, the API does not require authentication. For production, consider implementing:

- JWT tokens
- Session-based authentication
- API keys for certain endpoints

**Future Authentication Headers:**

```
Authorization: Bearer <token>
```

---

## API Endpoints

### Level Management

#### 1. Get All Available Levels

Retrieve all available proficiency levels and basic practice option.

**Endpoint:** `GET /levels`

**Response:**

```json
{
  "success": true,
  "levels": [
    {
      "id": "A1",
      "title": "Start Deutsch 1 (A1)",
      "englishTitle": "Start German 1 (A1)",
      "description": "Einfache Kommunikation",
      "englishDescription": "Simple Communication",
      "color": "indigo"
    },
    {
      "id": "A2",
      "title": "Goethe-Zertifikat A2",
      "englishTitle": "Goethe Certificate A2",
      "description": "Elementare Konversation",
      "englishDescription": "Elementary Conversation",
      "color": "green"
    },
    {
      "id": "B1",
      "title": "Goethe-Zertifikat B1",
      "englishTitle": "Goethe Certificate B1",
      "description": "Selbstständige Sprachverwendung",
      "englishDescription": "Independent Language Use",
      "color": "orange"
    },
    {
      "id": "B2",
      "title": "Goethe-Zertifikat B2",
      "englishTitle": "Goethe Certificate B2",
      "description": "Fließend und differenziert",
      "englishDescription": "Fluent and Differentiated",
      "color": "red"
    }
  ],
  "basicPractice": {
    "id": "Basic",
    "title": "Basic - Aussprache üben",
    "englishTitle": "Basic - Practice Pronunciation",
    "description": "Aussprache üben",
    "englishDescription": "Pronunciation Practice",
    "color": "purple"
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

#### 2. Get Level Details

Retrieve detailed information about a specific level including available sections.

**Endpoint:** `GET /levels/:levelId`

**Parameters:**

- `levelId` (path parameter): One of `A1`, `A2`, `B1`, `B2`

**Response:**

```json
{
  "success": true,
  "level": {
    "id": "A1",
    "title": "Start Deutsch 1 (A1)",
    "englishTitle": "Start German 1 (A1)",
    "sections": [
      {
        "id": "LISTENING",
        "title": "Hören",
        "englishTitle": "Listening",
        "questionCount": 2,
        "available": true
      },
      {
        "id": "READING",
        "title": "Lesen",
        "englishTitle": "Reading",
        "questionCount": 1,
        "available": true
      },
      {
        "id": "WRITING",
        "title": "Schreiben",
        "englishTitle": "Writing",
        "questionCount": 2,
        "available": true
      },
      {
        "id": "SPEAKING",
        "title": "Sprechen",
        "englishTitle": "Speaking",
        "questionCount": 1,
        "available": true
      }
    ]
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `404 Not Found` - Level not found
- `500 Internal Server Error` - Server error

---

### Section Management

#### 3. Get Sections for a Level

Retrieve all sections available for a specific level.

**Endpoint:** `GET /levels/:levelId/sections`

**Parameters:**

- `levelId` (path parameter): One of `A1`, `A2`, `B1`, `B2`

**Response:**

```json
{
  "success": true,
  "levelId": "A1",
  "sections": [
    {
      "id": "LISTENING",
      "title": "Hören",
      "englishTitle": "Listening",
      "description": "Verständnis von Ankündigungen und Gesprächen.",
      "englishDescription": "Comprehension of announcements and conversations.",
      "icon": "Speaker",
      "color": "indigo",
      "questionCount": 2
    },
    {
      "id": "READING",
      "title": "Lesen",
      "englishTitle": "Reading",
      "description": "Verständnis von Texten, Anzeigen und Artikeln.",
      "englishDescription": "Comprehension of texts, advertisements, and articles.",
      "icon": "BookOpen",
      "color": "green",
      "questionCount": 1
    },
    {
      "id": "WRITING",
      "title": "Schreiben",
      "englishTitle": "Writing",
      "description": "Verfassen von Nachrichten, Briefen oder Kommentaren.",
      "englishDescription": "Writing messages, letters, or commentaries.",
      "icon": "PenTool",
      "color": "orange",
      "questionCount": 2
    },
    {
      "id": "SPEAKING",
      "title": "Sprechen",
      "englishTitle": "Speaking",
      "description": "Mündliche Interaktion, Präsentation und Diskussion.",
      "englishDescription": "Oral interaction, presentation, and discussion.",
      "icon": "Mic",
      "color": "red",
      "questionCount": 1
    }
  ]
}
```

**Status Codes:**

- `200 OK` - Success
- `404 Not Found` - Level not found
- `500 Internal Server Error` - Server error

---

### Question Management

#### 4. Get Questions for a Section

Retrieve all questions for a specific section and level.

**Endpoint:** `GET /levels/:levelId/sections/:sectionId/questions`

**Parameters:**

- `levelId` (path parameter): One of `A1`, `A2`, `B1`, `B2`
- `sectionId` (path parameter): One of `LISTENING`, `READING`, `WRITING`, `SPEAKING`

**Query Parameters:**

- `limit` (optional): Number of questions to return (default: all)
- `offset` (optional): Number of questions to skip (default: 0)

**Response for LISTENING:**

```json
{
  "success": true,
  "levelId": "A1",
  "sectionId": "LISTENING",
  "questions": [
    {
      "id": 1,
      "type": "MultipleChoice",
      "question": "Sie hören eine Ansage am Bahnhof. Wann fährt der Zug nach Berlin ab?",
      "translation": "You hear an announcement at the train station. When does the train to Berlin depart?",
      "audioDescription": "Ansage am Bahnhof (Announcement at the train station)",
      "audioUrl": "/api/audio/listening/A1/1",
      "options": ["Um 14:30 Uhr", "Um 14:50 Uhr", "Um 15:00 Uhr"],
      "correctAnswer": "Um 14:50 Uhr",
      "imagePlaceholder": "https://placehold.co/100x100/38bdf8/ffffff?text=Zug"
    },
    {
      "id": 2,
      "type": "RichtigFalsch",
      "question": "Sie hören ein Gespräch. Ist Herr Müller heute im Büro?",
      "translation": "You hear a conversation. Is Mr. Müller in the office today?",
      "audioDescription": "Kurzes Telefongespräch (Short phone conversation)",
      "audioUrl": "/api/audio/listening/A1/2",
      "options": ["Richtig (Ja)", "Falsch (Nein)"],
      "correctAnswer": "Falsch (Nein)",
      "imagePlaceholder": "https://placehold.co/100x100/f87171/ffffff?text=Telefon"
    }
  ],
  "total": 2
}
```

**Response for READING:**

```json
{
  "success": true,
  "levelId": "A1",
  "sectionId": "READING",
  "questions": [
    {
      "id": 3,
      "type": "A_B_C",
      "text": "Sie sehen ein Schild an einer Tür: 'Bitte klingeln, Bürozeiten: Mo-Fr 9:00-12:00 Uhr.'",
      "textTranslation": "You see a sign on a door: 'Please ring, office hours: Mon-Fri 9:00-12:00.'",
      "question": "Was bedeutet das?",
      "translation": "What does this mean?",
      "options": [
        "Das Büro ist immer geöffnet.",
        "Sie müssen klingeln, um hineinzukommen.",
        "Man kann nur nachmittags kommen."
      ],
      "correctAnswer": "Sie müssen klingeln, um hineinzukommen.",
      "imagePlaceholder": "https://placehold.co/100x100/4ade80/ffffff?text=Schild"
    }
  ],
  "total": 1
}
```

**Response for WRITING:**

```json
{
  "success": true,
  "levelId": "A1",
  "sectionId": "WRITING",
  "questions": [
    {
      "id": 5,
      "type": "Formular",
      "prompt": "Füllen Sie das Formular aus: Name, Adresse, Telefonnummer.",
      "translation": "Fill out the form: Name, address, phone number.",
      "fields": ["Name", "Adresse", "Telefon"]
    },
    {
      "id": 6,
      "type": "Brief",
      "prompt": "Schreiben Sie eine kurze Nachricht (ca. 30 Wörter) an Ihren Freund Martin. Sie laden ihn zum Abendessen ein und schlagen eine Uhrzeit vor.",
      "translation": "Write a short message (approx. 30 words) to your friend Martin. You invite him to dinner and suggest a time.",
      "minWords": 20,
      "maxWords": 40
    }
  ],
  "total": 2
}
```

**Response for SPEAKING:**

```json
{
  "success": true,
  "levelId": "A1",
  "sectionId": "SPEAKING",
  "questions": [
    {
      "id": 7,
      "type": "Vorstellen",
      "prompt": "Teil 1: Sich vorstellen (Name, Alter, Herkunftsland, Sprachen, Hobby).",
      "translation": "Part 1: Introducing yourself (name, age, country of origin, languages, hobby).",
      "example": "Mein Name ist [Name]. Ich bin [Alter] Jahre alt...",
      "recordingDuration": 120,
      "preparationTime": 15
    }
  ],
  "total": 1
}
```

**Status Codes:**

- `200 OK` - Success
- `404 Not Found` - Level or section not found
- `500 Internal Server Error` - Server error

---

#### 5. Get Single Question

Retrieve a specific question by ID.

**Endpoint:** `GET /questions/:questionId`

**Parameters:**

- `questionId` (path parameter): Question ID

**Response:**

```json
{
  "success": true,
  "question": {
    "id": 1,
    "levelId": "A1",
    "sectionId": "LISTENING",
    "type": "MultipleChoice",
    "question": "Sie hören eine Ansage am Bahnhof. Wann fährt der Zug nach Berlin ab?",
    "translation": "You hear an announcement at the train station. When does the train to Berlin depart?",
    "audioDescription": "Ansage am Bahnhof (Announcement at the train station)",
    "audioUrl": "/api/audio/listening/A1/1",
    "options": ["Um 14:30 Uhr", "Um 14:50 Uhr", "Um 15:00 Uhr"],
    "correctAnswer": "Um 14:50 Uhr",
    "imagePlaceholder": "https://placehold.co/100x100/38bdf8/ffffff?text=Zug"
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `404 Not Found` - Question not found
- `500 Internal Server Error` - Server error

---

### Answer Submission

#### 6. Submit Answer for Listening/Reading Question

Submit an answer for a multiple choice or true/false question.

**Endpoint:** `POST /answers/submit`

**Request Body:**

```json
{
  "questionId": 1,
  "levelId": "A1",
  "sectionId": "LISTENING",
  "answer": "Um 14:50 Uhr",
  "timeSpent": 45,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "answerId": "ans_123456",
  "isCorrect": true,
  "correctAnswer": "Um 14:50 Uhr",
  "feedback": {
    "message": "Richtig! Gut gemacht.",
    "englishMessage": "Correct! Well done.",
    "explanation": null
  },
  "score": 1,
  "timestamp": "2024-01-15T10:30:05Z"
}
```

**Status Codes:**

- `200 OK` - Success
- `400 Bad Request` - Invalid request body
- `404 Not Found` - Question not found
- `500 Internal Server Error` - Server error

---

#### 7. Submit Form Answer (Writing Section)

Submit a form completion answer for writing section.

**Endpoint:** `POST /answers/submit-form`

**Request Body:**

```json
{
  "questionId": 5,
  "levelId": "A1",
  "sectionId": "WRITING",
  "formData": {
    "Name": "Max Mustermann",
    "Adresse": "Musterstraße 123, 12345 Berlin",
    "Telefon": "+49 30 12345678"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "answerId": "ans_123457",
  "validation": {
    "allFieldsFilled": true,
    "fieldCount": 3,
    "requiredFields": ["Name", "Adresse", "Telefon"],
    "filledFields": ["Name", "Adresse", "Telefon"]
  },
  "feedback": {
    "message": "Formular erfolgreich ausgefüllt.",
    "englishMessage": "Form successfully completed.",
    "suggestions": []
  },
  "timestamp": "2024-01-15T10:30:05Z"
}
```

**Status Codes:**

- `200 OK` - Success
- `400 Bad Request` - Invalid request body or missing required fields
- `404 Not Found` - Question not found
- `500 Internal Server Error` - Server error

---

#### 8. Submit Essay/Letter Answer (Writing Section)

Submit a written essay, letter, or commentary answer.

**Endpoint:** `POST /answers/submit-essay`

**Request Body:**

```json
{
  "questionId": 6,
  "levelId": "A1",
  "sectionId": "WRITING",
  "text": "Hallo Martin,\n\nIch lade dich zum Abendessen ein. Wir können uns um 19:00 Uhr treffen. Bitte sag mir Bescheid, ob du Zeit hast.\n\nViele Grüße,\nMax",
  "wordCount": 28,
  "timeSpent": 300,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "answerId": "ans_123458",
  "validation": {
    "wordCount": 28,
    "minWords": 20,
    "maxWords": 40,
    "withinRange": true,
    "hasGreeting": true,
    "hasClosing": true,
    "structureScore": 0.85
  },
  "feedback": {
    "message": "Gute Arbeit! Die Wortanzahl ist angemessen.",
    "englishMessage": "Good work! The word count is appropriate.",
    "suggestions": [
      "Consider adding more details about the dinner location.",
      "The greeting and closing are well-formatted."
    ],
    "grammarScore": 0.9,
    "vocabularyScore": 0.85,
    "structureScore": 0.85
  },
  "timestamp": "2024-01-15T10:30:05Z"
}
```

**Status Codes:**

- `200 OK` - Success
- `400 Bad Request` - Invalid request body or word count out of range
- `404 Not Found` - Question not found
- `500 Internal Server Error` - Server error

---

#### 9. Submit Speaking Answer

Submit a speaking response (audio recording or text transcription).

**Endpoint:** `POST /answers/submit-speaking`

**Request Body:**

```json
{
  "questionId": 7,
  "levelId": "A1",
  "sectionId": "SPEAKING",
  "audioUrl": "/api/audio/recordings/user_123/question_7.wav",
  "transcript": "Mein Name ist Max. Ich bin 25 Jahre alt. Ich komme aus Deutschland.",
  "duration": 8.5,
  "confidence": 0.92,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "answerId": "ans_123459",
  "evaluation": {
    "pronunciationScore": 0.88,
    "fluencyScore": 0.85,
    "grammarScore": 0.9,
    "vocabularyScore": 0.87,
    "contentScore": 0.92,
    "overallScore": 0.88
  },
  "feedback": {
    "message": "Gute Aussprache und flüssiges Sprechen.",
    "englishMessage": "Good pronunciation and fluent speaking.",
    "strengths": ["Clear pronunciation", "Good use of vocabulary"],
    "improvements": [
      "Work on sentence structure",
      "Practice more complex sentences"
    ]
  },
  "timestamp": "2024-01-15T10:30:05Z"
}
```

**Status Codes:**

- `200 OK` - Success
- `400 Bad Request` - Invalid request body
- `404 Not Found` - Question not found
- `413 Payload Too Large` - Audio file too large
- `500 Internal Server Error` - Server error

---

### Practice Recording

#### 10. Record Basic Practice Attempt

Record a pronunciation practice attempt (already implemented).

**Endpoint:** `POST /practice/record`

**Request Body:**

```json
{
  "word": "Hallo",
  "transcript": "Hallo",
  "isCorrect": true,
  "confidence": 0.95,
  "language": "de-DE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Practice record saved successfully",
  "record": {
    "word": "Hallo",
    "transcript": "Hallo",
    "isCorrect": true,
    "confidence": 0.95,
    "language": "de-DE",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "totalRecords": 1
}
```

**Status Codes:**

- `201 Created` - Success
- `400 Bad Request` - Missing required fields
- `500 Internal Server Error` - Server error

---

#### 11. Get Practice Records

Retrieve all practice records for a user (for testing/debugging).

**Endpoint:** `GET /practice/record`

**Query Parameters:**

- `limit` (optional): Number of records to return (default: 100)
- `offset` (optional): Number of records to skip (default: 0)
- `word` (optional): Filter by word
- `startDate` (optional): Filter by start date (ISO 8601)
- `endDate` (optional): Filter by end date (ISO 8601)

**Response:**

```json
{
  "success": true,
  "records": [
    {
      "word": "Hallo",
      "transcript": "Hallo",
      "isCorrect": true,
      "confidence": 0.95,
      "language": "de-DE",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "totalRecords": 1
}
```

**Status Codes:**

- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

#### 12. Get Practice Statistics

Get statistics about practice attempts.

**Endpoint:** `GET /practice/statistics`

**Query Parameters:**

- `startDate` (optional): Start date for statistics (ISO 8601)
- `endDate` (optional): End date for statistics (ISO 8601)

**Response:**

```json
{
  "success": true,
  "statistics": {
    "totalAttempts": 150,
    "correctAttempts": 120,
    "incorrectAttempts": 30,
    "accuracy": 0.8,
    "averageConfidence": 0.87,
    "mostPracticedWords": [
      {
        "word": "Hallo",
        "attempts": 15,
        "accuracy": 0.93
      },
      {
        "word": "Guten Tag",
        "attempts": 12,
        "accuracy": 0.83
      }
    ],
    "dailyProgress": [
      {
        "date": "2024-01-15",
        "attempts": 10,
        "accuracy": 0.8
      }
    ]
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### Audio Management

#### 13. Get Audio File for Listening Question

Retrieve the audio file for a listening question.

**Endpoint:** `GET /audio/listening/:levelId/:questionId`

**Parameters:**

- `levelId` (path parameter): One of `A1`, `A2`, `B1`, `B2`
- `questionId` (path parameter): Question ID

**Response:**

- Content-Type: `audio/mpeg` or `audio/wav`
- Binary audio file stream

**Status Codes:**

- `200 OK` - Success
- `404 Not Found` - Audio file not found
- `500 Internal Server Error` - Server error

---

#### 14. Upload Speaking Recording

Upload an audio recording for a speaking question.

**Endpoint:** `POST /audio/speaking/upload`

**Request:**

- Content-Type: `multipart/form-data`
- Body: Audio file (WAV, MP3, or OGG format)

**Form Data:**

- `questionId` (required): Question ID
- `levelId` (required): Level ID
- `sectionId` (required): Section ID
- `audio` (required): Audio file

**Response:**

```json
{
  "success": true,
  "audioUrl": "/api/audio/recordings/user_123/question_7.wav",
  "duration": 8.5,
  "fileSize": 136000,
  "format": "wav",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**

- `201 Created` - Success
- `400 Bad Request` - Invalid file format or missing fields
- `413 Payload Too Large` - File too large (max 10MB)
- `500 Internal Server Error` - Server error

---

### Progress Tracking

#### 15. Get User Progress

Retrieve user's progress across all levels and sections.

**Endpoint:** `GET /progress`

**Query Parameters:**

- `levelId` (optional): Filter by level
- `sectionId` (optional): Filter by section

**Response:**

```json
{
  "success": true,
  "progress": {
    "overall": {
      "totalQuestions": 50,
      "answeredQuestions": 35,
      "correctAnswers": 28,
      "completionRate": 0.7,
      "accuracy": 0.8
    },
    "byLevel": {
      "A1": {
        "totalQuestions": 6,
        "answeredQuestions": 6,
        "correctAnswers": 5,
        "completionRate": 1.0,
        "accuracy": 0.83
      },
      "A2": {
        "totalQuestions": 4,
        "answeredQuestions": 3,
        "correctAnswers": 2,
        "completionRate": 0.75,
        "accuracy": 0.67
      }
    },
    "bySection": {
      "LISTENING": {
        "totalQuestions": 8,
        "answeredQuestions": 8,
        "correctAnswers": 7,
        "completionRate": 1.0,
        "accuracy": 0.88
      },
      "READING": {
        "totalQuestions": 4,
        "answeredQuestions": 4,
        "correctAnswers": 3,
        "completionRate": 1.0,
        "accuracy": 0.75
      }
    },
    "recentActivity": [
      {
        "date": "2024-01-15",
        "levelId": "A1",
        "sectionId": "LISTENING",
        "questionsAnswered": 2,
        "accuracy": 1.0
      }
    ]
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

#### 16. Get Progress for Specific Level

Get detailed progress for a specific level.

**Endpoint:** `GET /progress/levels/:levelId`

**Parameters:**

- `levelId` (path parameter): One of `A1`, `A2`, `B1`, `B2`

**Response:**

```json
{
  "success": true,
  "levelId": "A1",
  "progress": {
    "totalQuestions": 6,
    "answeredQuestions": 6,
    "correctAnswers": 5,
    "completionRate": 1.0,
    "accuracy": 0.83,
    "sections": {
      "LISTENING": {
        "totalQuestions": 2,
        "answeredQuestions": 2,
        "correctAnswers": 2,
        "completionRate": 1.0,
        "accuracy": 1.0
      },
      "READING": {
        "totalQuestions": 1,
        "answeredQuestions": 1,
        "correctAnswers": 1,
        "completionRate": 1.0,
        "accuracy": 1.0
      },
      "WRITING": {
        "totalQuestions": 2,
        "answeredQuestions": 2,
        "correctAnswers": 1,
        "completionRate": 1.0,
        "accuracy": 0.5
      },
      "SPEAKING": {
        "totalQuestions": 1,
        "answeredQuestions": 1,
        "correctAnswers": 1,
        "completionRate": 1.0,
        "accuracy": 1.0
      }
    },
    "lastActivity": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `404 Not Found` - Level not found
- `500 Internal Server Error` - Server error

---

#### 17. Get Answer History

Retrieve history of submitted answers.

**Endpoint:** `GET /answers/history`

**Query Parameters:**

- `questionId` (optional): Filter by question ID
- `levelId` (optional): Filter by level
- `sectionId` (optional): Filter by section
- `limit` (optional): Number of records to return (default: 50)
- `offset` (optional): Number of records to skip (default: 0)

**Response:**

```json
{
  "success": true,
  "answers": [
    {
      "answerId": "ans_123456",
      "questionId": 1,
      "levelId": "A1",
      "sectionId": "LISTENING",
      "answer": "Um 14:50 Uhr",
      "isCorrect": true,
      "score": 1,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

**Status Codes:**

- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### User Management

#### 18. Create User Account

Create a new user account (for future implementation).

**Endpoint:** `POST /users`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "Max Mustermann",
  "preferredLanguage": "en"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "userId": "user_123",
    "email": "user@example.com",
    "name": "Max Mustermann",
    "preferredLanguage": "en",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "jwt_token_here"
}
```

**Status Codes:**

- `201 Created` - Success
- `400 Bad Request` - Invalid request body or email already exists
- `500 Internal Server Error` - Server error

---

#### 19. Get User Profile

Retrieve user profile information.

**Endpoint:** `GET /users/:userId`

**Parameters:**

- `userId` (path parameter): User ID

**Response:**

```json
{
  "success": true,
  "user": {
    "userId": "user_123",
    "email": "user@example.com",
    "name": "Max Mustermann",
    "preferredLanguage": "en",
    "currentLevel": "A1",
    "createdAt": "2024-01-15T10:30:00Z",
    "lastActivity": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

#### 20. Update User Profile

Update user profile information.

**Endpoint:** `PATCH /users/:userId`

**Parameters:**

- `userId` (path parameter): User ID

**Request Body:**

```json
{
  "name": "Max Mustermann Updated",
  "preferredLanguage": "de",
  "currentLevel": "A2"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "userId": "user_123",
    "email": "user@example.com",
    "name": "Max Mustermann Updated",
    "preferredLanguage": "de",
    "currentLevel": "A2",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `400 Bad Request` - Invalid request body
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `INTERNAL_ERROR` - Internal server error
- `RATE_LIMIT_EXCEEDED` - Too many requests

---

## Rate Limiting

**Note:** Rate limiting should be implemented in production:

- General endpoints: 100 requests per minute
- Answer submission: 20 requests per minute
- Audio upload: 10 requests per minute

---

## Data Models

### Question Types

1. **MultipleChoice** - Multiple choice questions (Listening, Reading)
2. **RichtigFalsch** - True/False questions (Listening)
3. **A_B_C** - Multiple choice with A, B, C options (Reading)
4. **TextMatch** - Text matching questions (Reading)
5. **Lückentext** - Fill-in-the-blank questions (Reading)
6. **Formular** - Form completion (Writing)
7. **Brief** - Letter/Email writing (Writing)
8. **Kommentar** - Commentary writing (Writing)
9. **Vorstellen** - Self-introduction (Speaking)
10. **Präsentation** - Presentation (Speaking)
11. **Diskussion** - Discussion (Speaking)

### Levels

- `A1` - Start Deutsch 1
- `A2` - Goethe-Zertifikat A2
- `B1` - Goethe-Zertifikat B1
- `B2` - Goethe-Zertifikat B2
- `Basic` - Basic pronunciation practice

### Sections

- `LISTENING` - Hören (Listening)
- `READING` - Lesen (Reading)
- `WRITING` - Schreiben (Writing)
- `SPEAKING` - Sprechen (Speaking)

---

## Implementation Notes

1. **Current Implementation:**

   - `/api/practice/record` - Already implemented
   - All other endpoints need to be implemented

2. **Database Requirements:**

   - Users table
   - Questions table
   - Answers table
   - Practice records table
   - Progress tracking table
   - Audio files storage

3. **Future Enhancements:**
   - Real-time audio processing for speaking evaluation
   - AI-powered grammar and vocabulary checking
   - Advanced analytics and reporting
   - Social features (leaderboards, sharing)
   - Mobile app API support

---

## Versioning

**Current Version:** `v1`

API versioning should be implemented using URL path:

- `/api/v1/...` for version 1
- `/api/v2/...` for version 2 (future)

---

## Support

For API support and questions, please contact the development team.

---

**Last Updated:** January 2024
