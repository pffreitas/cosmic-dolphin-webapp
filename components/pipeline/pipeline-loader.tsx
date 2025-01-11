"use client";

import useSWR from "swr";
import { fetchPipelines } from "@/lib/repository/pipelines.repo";

function fetcher(noteId: number): (url: string) => any {
    return async function fetcher(url: string) {
        const pipelines = await fetchPipelines(noteId);
        return pipelines;
    }
}

type Props = {
    noteId: number;
}

export const FetchEverySecondSWR : React.FC<Props> = ({noteId}) => {
    const { data, error } = useSWR("/api/data", fetcher(noteId), {
        refreshInterval: 1000,
    });

    if (error) return <div>Error loading data</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <h1>Data (SWR) fetched every second:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}