import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const writing_task = body.get("writing_task");
    const user_response = body.get("user_response");

    if (!writing_task || !user_response) {
      return NextResponse.json(
        { error: "Missing required parameters: writing_task, user_response" },
        { status: 400 }
      );
    }

    console.log("[API Route] Writing validation request received");
    console.log(
      "[API Route] Writing Task (JSON string):",
      writing_task.toString().substring(0, 100) + "..."
    );
    console.log(
      "[API Route] User Response (plain string) Length:",
      user_response.toString().length
    );

    const formData = new URLSearchParams();
    formData.append("writing_task", writing_task.toString());
    formData.append("user_response", user_response.toString());

    console.log(
      "[API Route] Sending to external API:",
      `${API_BASE_URL}/validate/writing`
    );
    console.log("[API Route] FormData preview:", {
      writing_task: formData.get("writing_task"),
      user_response: formData.get("user_response"),
    });

    const response = await fetch(`${API_BASE_URL}/validate/writing`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    console.log("[API Route] External API Response Status:", response.status);
    console.log("[API Route] External API Response OK:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText };
      }
      console.error("[API Route] External API Error:", errorData);
      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[API Route] External API Success Response:", data);
    console.log("writing validation", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Route] Error validating writing:", error);
    return NextResponse.json(
      {
        error: "Failed to validate writing",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
