
import { createClient } from "@/utils/supabase/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function cosmicFetch(url: string, token: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function cosmicGet(url: string, mapper: (data: any) => any) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token || '';

  const resp = cosmicFetch(url, accessToken)

  return mapper(resp)
}

export async function cosmicPost(url: string, data: any) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token || '';

  const response = await fetch(`${API_BASE_URL}/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return response.status;
}