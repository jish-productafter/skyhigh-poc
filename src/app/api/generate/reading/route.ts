import { NextRequest, NextResponse } from "next/server";
import { fetchWithRetry } from "../../utils";

const API_BASE_URL = process.env.API_BASE_URL!;

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topic = searchParams.get("topic");
    const level = searchParams.get("level");
    const item_id_start = searchParams.get("item_id_start");
    const prefer_type = searchParams.get("prefer_type");

    if (!topic || !level) {
      return NextResponse.json(
        { error: "Missing required parameters: topic, level" },
        { status: 400 }
      );
    }

    const url = new URL(`${API_BASE_URL}/generate/reading`);
    url.searchParams.append("topic", topic);
    url.searchParams.append("level", level);
    if (item_id_start) {
      url.searchParams.append("item_id_start", item_id_start);
    }
    if (prefer_type) {
      url.searchParams.append("prefer_type", prefer_type);
    }

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
    const data = await response.json();

    console.log("reading questions", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying reading request:", error);
    return NextResponse.json(
      {
        error: "Failed to generate reading questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
