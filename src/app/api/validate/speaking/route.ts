import { NextRequest, NextResponse } from "next/server";
import { fetchWithRetry } from "../../utils";

const API_BASE_URL = process.env.API_BASE_URL!;

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

    // Create FormData factory function for retries
    const createFormData = () => {
      const apiFormData = new FormData();
      apiFormData.append("file", file as Blob);
      apiFormData.append("speaking_task", speaking_task.toString());
      return apiFormData;
    };

    const response = await fetchWithRetry(
      () =>
        fetch(`${API_BASE_URL}/validate/speaking`, {
          method: "POST",
          body: createFormData(),
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

    const data = await response.json();
    console.log("speaking validation", data);
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
