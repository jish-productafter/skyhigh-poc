import { Level, ExamContent } from "@/types"

// Hardcoded German words for Basic practice
export const BASIC_GERMAN_WORDS = [
  "Hallo",
  "Guten Tag",
  "Danke",
  "Bitte",
  "Entschuldigung",
  "Ja",
  "Nein",
  "Brot",
  "Wasser",
  "Kaffee",
  "Haus",
  "Auto",
  "Buch",
  "Schule",
  "Freund",
  "Familie",
  "Mutter",
  "Vater",
  "Bruder",
  "Schwester",
  "Apfel",
  "Banane",
  "Milch",
  "Käse",
  "Fisch",
  "Fleisch",
  "Tisch",
  "Stuhl",
  "Fenster",
  "Tür",
  "Hund",
  "Katze",
  "Blume",
  "Baum",
  "Sonne",
  "Mond",
  "Himmel",
  "Erde",
  "Stadt",
  "Land",
  "Straße",
  "Park",
  "Restaurant",
  "Hotel",
  "Bahnhof",
  "Flughafen",
  "Geld",
  "Zeit",
  "Tag",
  "Nacht",
  "Morgen",
  "Abend",
  "Woche",
  "Monat",
  "Jahr",
  "Heute",
  "Gestern",
  "Morgen",
  "Rot",
  "Blau",
  "Grün",
  "Gelb",
  "Schwarz",
  "Weiß",
  "Groß",
  "Klein",
  "Alt",
  "Neu",
  "Gut",
  "Schlecht",
  "Schön",
  "Hässlich",
  "Schnell",
  "Langsam",
  "Warm",
  "Kalt",
  "Heiß",
  "Kühl",
]

// Mock Exam Content for A1, A2, B1, B2
export const EXAM_CONTENT: Record<Level, ExamContent> = {
  A1: {
    title: "Start Deutsch 1 (A1)",
    englishTitle: "Start German 1 (A1)",
    LISTENING: [
      {
        id: 1,
        type: "MultipleChoice",
        question:
          "Sie hören eine Ansage am Bahnhof. Wann fährt der Zug nach Berlin ab?",
        translation:
          "You hear an announcement at the train station. When does the train to Berlin depart?",
        audioDescription:
          "Ansage am Bahnhof (Announcement at the train station)",
        options: ["Um 14:30 Uhr", "Um 14:50 Uhr", "Um 15:00 Uhr"],
        correctAnswer: "Um 14:50 Uhr",
        imagePlaceholder: "https://placehold.co/100x100/38bdf8/ffffff?text=Zug",
      },
      {
        id: 2,
        type: "RichtigFalsch",
        question: "Sie hören ein Gespräch. Ist Herr Müller heute im Büro?",
        translation:
          "You hear a conversation. Is Mr. Müller in the office today?",
        audioDescription: "Kurzes Telefongespräch (Short phone conversation)",
        options: ["Richtig (Ja)", "Falsch (Nein)"],
        correctAnswer: "Falsch (Nein)",
        imagePlaceholder:
          "https://placehold.co/100x100/f87171/ffffff?text=Telefon",
      },
    ],
    READING: [
      {
        id: 3,
        type: "A_B_C",
        text: "Sie sehen ein Schild an einer Tür: 'Bitte klingeln, Bürozeiten: Mo-Fr 9:00-12:00 Uhr.'",
        textTranslation:
          "You see a sign on a door: 'Please ring, office hours: Mon-Fri 9:00-12:00.'",
        question: "Was bedeutet das?",
        translation: "What does this mean?",
        options: [
          "Das Büro ist immer geöffnet.",
          "Sie müssen klingeln, um hineinzukommen.",
          "Man kann nur nachmittags kommen.",
        ],
        correctAnswer: "Sie müssen klingeln, um hineinzukommen.",
        imagePlaceholder:
          "https://placehold.co/100x100/4ade80/ffffff?text=Schild",
      },
    ],
    WRITING: [
      {
        id: 5,
        type: "Formular",
        prompt: "Füllen Sie das Formular aus: Name, Adresse, Telefonnummer.",
        translation: "Fill out the form: Name, address, phone number.",
        fields: ["Name", "Adresse", "Telefon"],
      },
      {
        id: 6,
        type: "Brief",
        prompt:
          "Schreiben Sie eine kurze Nachricht (ca. 30 Wörter) an Ihren Freund Martin. Sie laden ihn zum Abendessen ein und schlagen eine Uhrzeit vor.",
        translation:
          "Write a short message (approx. 30 words) to your friend Martin. You invite him to dinner and suggest a time.",
        minWords: 20,
        maxWords: 40,
      },
    ],
    SPEAKING: [
      {
        id: 7,
        type: "Vorstellen",
        prompt:
          "Teil 1: Sich vorstellen (Name, Alter, Herkunftsland, Sprachen, Hobby).",
        translation:
          "Part 1: Introducing yourself (name, age, country of origin, languages, hobby).",
        example: "Mein Name ist [Name]. Ich bin [Alter] Jahre alt...",
      },
    ],
  },
  A2: {
    title: "Goethe-Zertifikat A2",
    englishTitle: "Goethe Certificate A2",
    LISTENING: [
      {
        id: 101,
        type: "MultipleChoice",
        question:
          "Sie hören eine Ansage. Wo findet die neue Ausstellung statt?",
        translation:
          "You hear an announcement. Where is the new exhibition taking place?",
        audioDescription:
          "Ansage im Kulturzentrum (Announcement in the cultural center)",
        options: ["Im Raum 201", "Im Foyer", "Im Erdgeschoss"],
        correctAnswer: "Im Foyer",
        imagePlaceholder:
          "https://placehold.co/100x100/3b82f6/ffffff?text=Ausstellung",
      },
      {
        id: 102,
        type: "RichtigFalsch",
        question: "Sie hören ein Gespräch. Muss Tina heute Abend kochen?",
        translation: "You hear a conversation. Does Tina have to cook tonight?",
        audioDescription:
          "Gespräch über Abendpläne (Conversation about evening plans)",
        options: ["Richtig", "Falsch"],
        correctAnswer: "Falsch",
        imagePlaceholder:
          "https://placehold.co/100x100/10b981/ffffff?text=Kochen",
      },
    ],
    READING: [
      {
        id: 103,
        type: "A_B_C",
        text: "Anzeige: Biete Nachhilfe in Mathematik, Klasse 5-10. 15€/Stunde. Tel: 0152...",
        textTranslation:
          "Ad: Offering tutoring in Mathematics, grades 5-10. 15€/hour. Tel: 0152...",
        question: "Wer bietet seine Hilfe an?",
        translation: "Who is offering help?",
        options: [
          "Ein Mathelehrer",
          "Ein Schüler der 11. Klasse",
          "Jemand, der Mathematik unterrichtet",
        ],
        correctAnswer: "Jemand, der Mathematik unterrichtet",
        imagePlaceholder:
          "https://placehold.co/100x100/f59e0b/ffffff?text=Nachhilfe",
      },
    ],
    WRITING: [
      {
        id: 104,
        type: "Brief",
        prompt:
          "Schreiben Sie eine E-Mail an Ihren Vermieter. Ihre Heizung funktioniert nicht, und Sie bitten um Reparatur. Nennen Sie das Problem und schlagen Sie einen Termin vor (ca. 50 Wörter).",
        translation:
          "Write an email to your landlord. Your heating is not working, and you ask for a repair. Name the problem and suggest an appointment (approx. 50 words).",
        minWords: 40,
        maxWords: 60,
      },
    ],
    SPEAKING: [
      {
        id: 105,
        type: "Vorstellen",
        prompt:
          "Teil 1: Über eine Reise oder ein Erlebnis in der Vergangenheit berichten (Perfekt).",
        translation:
          "Part 1: Report on a trip or an experience in the past (Perfect tense).",
        example:
          "Letztes Jahr bin ich nach Italien gefahren. Ich habe Pizza gegessen...",
      },
    ],
  },
  B1: {
    title: "Goethe-Zertifikat B1",
    englishTitle: "Goethe Certificate B1",
    LISTENING: [
      {
        id: 201,
        type: "RichtigFalsch",
        question:
          "Sie hören einen Radiobericht. Ist der Sprecher gegen das Autofahren in der Innenstadt?",
        translation:
          "You hear a radio report. Is the speaker against driving in the inner city?",
        audioDescription:
          "Ausschnitt aus einem Radiobeitrag (Excerpt from a radio contribution)",
        options: ["Richtig", "Falsch"],
        correctAnswer: "Richtig",
        imagePlaceholder:
          "https://placehold.co/100x100/ef4444/ffffff?text=Radio",
      },
    ],
    READING: [
      {
        id: 202,
        type: "TextMatch",
        text: "Forumbeitrag: 'Ich bin seit drei Monaten in der neuen Stadt, aber ich finde einfach keine Freunde. Alle sind so beschäftigt!'",
        textTranslation:
          "Forum post: 'I've been in the new city for three months, but I just can't make any friends. Everyone is so busy!'",
        question: "Was ist das Hauptproblem der Person?",
        translation: "What is the person's main problem?",
        options: [
          "Sie hat keine Arbeit.",
          "Sie ist einsam und findet keinen Anschluss.",
          "Sie mag die Stadt nicht.",
        ],
        correctAnswer: "Sie ist einsam und findet keinen Anschluss.",
        imagePlaceholder:
          "https://placehold.co/100x100/14b8a6/ffffff?text=Forum",
      },
    ],
    WRITING: [
      {
        id: 203,
        type: "Brief",
        prompt:
          "Schreiben Sie eine Beschwerde an den Kundendienst über einen defekten Artikel. Beschreiben Sie das Problem, erklären Sie, wann Sie ihn gekauft haben, und bitten Sie um eine Lösung (Ersatz oder Geld zurück). (ca. 90 Wörter)",
        translation:
          "Write a complaint to customer service about a faulty item. Describe the problem, explain when you bought it, and ask for a solution (replacement or money back). (approx. 90 words).",
        minWords: 80,
        maxWords: 100,
      },
    ],
    SPEAKING: [
      {
        id: 204,
        type: "Präsentation",
        prompt:
          "Teil 2: Halten Sie eine kurze Präsentation über 'Leben ohne Auto'. Begründen Sie Ihre Meinung und nennen Sie Vor- und Nachteile.",
        translation:
          "Part 2: Give a short presentation on 'Life without a car'. Justify your opinion and mention advantages and disadvantages.",
        example:
          "Ich bin der Meinung, dass man kein Auto braucht, weil es besser für die Umwelt ist...",
      },
    ],
  },
  B2: {
    title: "Goethe-Zertifikat B2",
    englishTitle: "Goethe Certificate B2",
    LISTENING: [
      {
        id: 301,
        type: "MultipleChoice",
        question:
          "Sie hören eine Diskussion über die Digitalisierung des Arbeitsmarktes. Was hält der Experte von der aktuellen Entwicklung?",
        translation:
          "You hear a discussion about the digitalization of the labor market. What is the expert's opinion on the current development?",
        audioDescription:
          "Ausschnitt aus einer Fachtagung (Excerpt from an expert conference)",
        options: [
          "Er sieht große Risiken.",
          "Er begrüßt die Entwicklung uneingeschränkt.",
          "Er ist optimistisch, aber warnt vor notwendigen Anpassungen.",
        ],
        correctAnswer:
          "Er ist optimistisch, aber warnt vor notwendigen Anpassungen.",
        imagePlaceholder:
          "https://placehold.co/100x100/6366f1/ffffff?text=Expert",
      },
    ],
    READING: [
      {
        id: 302,
        type: "Lückentext",
        text: "Zeitungsartikel: 'Die Globalisierung der Wirtschaft stellt Unternehmen vor immense Herausforderungen...' ",
        textTranslation:
          "Newspaper article: 'The globalization of the economy presents companies with immense challenges...'",
        question: "Was ist die Hauptbotschaft des Artikels?",
        translation: "What is the main message of the article?",
        options: [
          "Unternehmen müssen sich anpassen, um zu überleben.",
          "Die Globalisierung ist ein rein negatives Phänomen.",
          "Es gibt keine Lösungen für die aktuellen Probleme.",
        ],
        correctAnswer: "Unternehmen müssen sich anpassen, um zu überleben.",
        imagePlaceholder:
          "https://placehold.co/100x100/7c3aed/ffffff?text=Text",
      },
    ],
    WRITING: [
      {
        id: 303,
        type: "Kommentar",
        prompt:
          "Verfassen Sie einen Kommentar zu dem Thema 'Vorteile und Gefahren der Künstlichen Intelligenz'. Nehmen Sie Stellung, begründen Sie Ihre Position und strukturieren Sie Ihren Text klar (ca. 220 Wörter).",
        translation:
          "Write a commentary on the topic 'Advantages and dangers of Artificial Intelligence'. Take a stand, justify your opinion, and structure your text clearly (approx. 220 words).",
        minWords: 200,
        maxWords: 250,
      },
    ],
    SPEAKING: [
      {
        id: 304,
        type: "Diskussion",
        prompt:
          "Teil 3: Diskutieren Sie mit Ihrem Partner über die Frage, ob soziale Medien die Demokratie stärken oder schwächen. Nutzen Sie komplexe Argumentationsstrukturen.",
        translation:
          "Part 3: Discuss with your partner the question of whether social media strengthens or weakens democracy. Use complex argumentation structures.",
        example:
          "Einerseits muss man bedenken, dass soziale Medien eine wichtige Plattform für politischen Austausch darstellen. Andererseits ist es nicht zu leugnen, dass...",
      },
    ],
  },
}


