import { API_BASE_URL } from "./base";

export interface KnowledgeStreamRequest {
  noteId: number;
  prompt: string;
}

export interface KnowledgeStreamResponse {
  success: boolean;
  message?: string;
}

export async function streamKnowledge(
  accessToken: string,
  noteId: number,
  prompt: string
): Promise<Response> {
  const url = new URL(`${API_BASE_URL}/knowledge`);
  url.searchParams.append("url", prompt);
  url.searchParams.append("noteId", noteId.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "text/event-stream",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}
