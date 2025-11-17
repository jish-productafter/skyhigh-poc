import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL!;

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topic = searchParams.get("topic");
    const level = searchParams.get("level");
    const item_id_start = searchParams.get("item_id_start");
    const interaction_type = searchParams.get("interaction_type");

    if (!topic || !level) {
      return NextResponse.json(
        { error: "Missing required parameters: topic, level" },
        { status: 400 }
      );
    }

    const url = new URL(`${API_BASE_URL}/generate/speaking`);
    url.searchParams.append("topic", topic);
    url.searchParams.append("level", level);
    if (item_id_start) {
      url.searchParams.append("item_id_start", item_id_start);
    }
    if (interaction_type) {
      url.searchParams.append("interaction_type", interaction_type);
    }

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

    // Get response as text first to handle potential JSON parsing errors
    const data = await response.json();

    console.log("speaking questions", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying speaking request:", error);
    return NextResponse.json(
      {
        error: "Failed to generate speaking questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
