import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://german.productafter.com";

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topic = searchParams.get("topic");
    const level = searchParams.get("level");
    const item_id_start = searchParams.get("item_id_start");
    const task_type = searchParams.get("task_type");

    if (!topic || !level) {
      return NextResponse.json(
        { error: "Missing required parameters: topic, level" },
        { status: 400 }
      );
    }

    const url = new URL(`${API_BASE_URL}/generate/writing`);
    url.searchParams.append("topic", topic);
    url.searchParams.append("level", level);
    if (item_id_start) {
      url.searchParams.append("item_id_start", item_id_start);
    }
    if (task_type) {
      url.searchParams.append("task_type", task_type);
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying writing request:", error);
    return NextResponse.json(
      {
        error: "Failed to generate writing questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
