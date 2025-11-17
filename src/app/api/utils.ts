/**
 * Retry a fetch request up to maxRetries times
 * @param fetchFn Function that returns a Promise<Response>
 * @param maxRetries Maximum number of retries (default: 2, so 3 total attempts)
 * @param delayMs Delay between retries in milliseconds (default: 1000)
 * @returns Promise<Response>
 */
export async function fetchWithRetry(
  fetchFn: () => Promise<Response>,
  maxRetries: number = 2,
  delayMs: number = 1000
): Promise<Response> {
  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchFn();

      // If response is OK, return it immediately
      if (response.ok) {
        return response;
      }

      // Store the last non-OK response
      lastResponse = response;

      // If this is not the last attempt, wait and retry
      if (attempt < maxRetries) {
        console.log(
          `Fetch attempt ${attempt + 1} failed with status ${
            response.status
          }, retrying...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
    } catch (error) {
      // Store the last error
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this is not the last attempt, wait and retry
      if (attempt < maxRetries) {
        console.log(
          `Fetch attempt ${attempt + 1} failed with error: ${
            lastError.message
          }, retrying...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
    }
  }

  // If we have a response (even if not OK), return it
  if (lastResponse) {
    return lastResponse;
  }

  // Otherwise, throw the last error
  throw lastError || new Error("Fetch failed after all retries");
}
