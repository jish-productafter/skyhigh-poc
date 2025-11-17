import { NextRequest, NextResponse } from "next/server";
import { fetchWithRetry } from "../../utils";

const API_BASE_URL = process.env.API_BASE_URL!;

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

    const response = await fetchWithRetry(
      () =>
        fetch(url.toString(), {
          method: "POST",
          headers: {
            accept: "application/json",
          },
        }),
      2
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    // Get response as text first to handle potential JSON parsing errors
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error(
        "Response text (first 1000 chars):",
        responseText.substring(0, 1000)
      );
      console.error("Response text length:", responseText.length);
      return NextResponse.json(
        {
          error: "Invalid JSON response from API",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error",
          responsePreview: responseText.substring(0, 500),
        },
        { status: 500 }
      );
    }

    console.log("listening questions", data);
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
