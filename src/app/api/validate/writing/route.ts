import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://german.productafter.com";

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

    const formData = new URLSearchParams();
    formData.append("writing_task", writing_task.toString());
    formData.append("user_response", user_response.toString());

    const response = await fetch(`${API_BASE_URL}/validate/writing`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText };
      }
      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error validating writing:", error);
    return NextResponse.json(
      {
        error: "Failed to validate writing",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
