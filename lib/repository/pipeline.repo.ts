
import { Configuration, Pipeline, PipelinesApi } from "@cosmic-dolphin/api";
import { API_BASE_URL } from "./base";

export async function fetchPipelines(refId: number, accessToken: string): Promise<Pipeline[]> {
    const pipelinesApi = new PipelinesApi(new Configuration({ basePath: API_BASE_URL, accessToken }));

    try {
        const pipelines = await pipelinesApi.pipelinesFindPipelinesByRefId({ refId });
        return pipelines;
    } catch (error) {
        console.error('Error fetching pipelines', error);

    }
    return [];
}