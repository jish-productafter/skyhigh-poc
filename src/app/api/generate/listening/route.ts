import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://german.productafter.com";

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topic = searchParams.get("topic");
    const level = searchParams.get("level");

    if (!topic || !level) {
      return NextResponse.json(
        { error: "Missing required parameters: topic, level" },
        { status: 400 }
      );
    }

    const url = new URL(`${API_BASE_URL}/generate/listening`);
    url.searchParams.append("topic", topic);
    url.searchParams.append("level", level);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying listening request:", error);
    return NextResponse.json(
      {
        error: "Failed to generate listening questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
