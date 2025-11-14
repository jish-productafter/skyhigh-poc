import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://german.productafter.com";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const speaking_task = formData.get("speaking_task");

    if (!file || !speaking_task) {
      return NextResponse.json(
        { error: "Missing required parameters: file, speaking_task" },
        { status: 400 }
      );
    }

    // Create new FormData for the external API
    const apiFormData = new FormData();
    apiFormData.append("file", file as Blob);
    apiFormData.append("speaking_task", speaking_task.toString());

    const response = await fetch(`${API_BASE_URL}/validate/speaking`, {
      method: "POST",
      body: apiFormData,
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
    console.error("Error validating speaking:", error);
    return NextResponse.json(
      {
        error: "Failed to validate speaking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
