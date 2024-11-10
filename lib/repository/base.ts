
import { createClient } from "@/utils/supabase/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function cosmicFetch(url: string, token: string) : Promise<any> {
    const response = await fetch(`${API_BASE_URL}/url`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  }

  async function cosmicGet(url: string, mapper: (data: any) => any) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token || '';

    return cosmicFetch(url, accessToken)
  }

  export {
    cosmicGet
  }