import { NextRequest, NextResponse } from "next/server"

export interface PracticeRecord {
  word: string
  transcript: string
  isCorrect: boolean
  timestamp: string
  confidence?: number
  language: string
}

// Mock storage (in a real app, this would be a database)
const practiceRecords: PracticeRecord[] = []

export async function POST(request: NextRequest) {
  try {
    const body: PracticeRecord = await request.json()

    // Validate required fields
    if (!body.word || !body.transcript || body.isCorrect === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: word, transcript, isCorrect" },
        { status: 400 }
      )
    }

    // Add timestamp if not provided
    const record: PracticeRecord = {
      ...body,
      timestamp: body.timestamp || new Date().toISOString(),
      language: body.language || "de-DE",
    }

    // Store the record (mock backend)
    practiceRecords.push(record)

    // Log for debugging (in production, you'd save to a database)
    console.log("Practice record received:", record)
    console.log("Total records:", practiceRecords.length)

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Practice record saved successfully",
        record,
        totalRecords: practiceRecords.length,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error saving practice record:", error)
    return NextResponse.json(
      { error: "Failed to save practice record" },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve all practice records (for testing/debugging)
export async function GET() {
  return NextResponse.json({
    success: true,
    records: practiceRecords,
    totalRecords: practiceRecords.length,
  })
}
