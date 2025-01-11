
import { Configuration, Pipeline, PipelinesApi } from "@cosmic-dolphin/api";
import { createClient } from "@/utils/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchPipelines(refId: number) : Promise<Pipeline[]> {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token || '';

    const pipelinesApi = new PipelinesApi(new Configuration({ basePath: API_URL, accessToken }));

    try {
        const pipelines = await pipelinesApi.pipelinesFindPipelinesByRefId({ refId });
        return pipelines;
    } catch (error) {
        console.error('Error fetching pipelines', error);
        
    }
    return [];
}