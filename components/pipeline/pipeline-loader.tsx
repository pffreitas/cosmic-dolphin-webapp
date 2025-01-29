"use client";

import useSWR from "swr";
import { LoaderCircle } from "lucide-react";
import { fetchPipelines } from "@/lib/repository/pipeline.repo";
import _ from 'lodash';
import { useEffect } from "react";
import './pipeline-loader.css';

type PipelineLoadingProps = {
    accessToken: string;
    noteId: number;
    onCompleted?: () => void;
}

const fetcher = (accessToken: string, noteId: number) => async () => {
    return fetchPipelines(noteId, accessToken);
}

export const PipelineLoading: React.FC<PipelineLoadingProps> = ({ accessToken, noteId, onCompleted }) => {
    const { data: pipelines, error } = useSWR(`notes/${noteId}/pipelines`, fetcher(accessToken, noteId), {
        refreshInterval: 1000,
    });

    const lastPipe = _.chain(pipelines ?? [])
        .sortBy('createdAt')
        .first()
        .value();

    const loading = lastPipe?.status !== 'complete';

    useEffect(() => {
        console.log({ pipelines });
        if (!loading && pipelines) {
            if (onCompleted) {
                onCompleted();
            }
        }
    }, [loading, pipelines]);

    // if (error) return <div>Error loading pipelines</div>;
    if (!pipelines) return <div>Loading...</div>;

    if (pipelines.length === 0) {
        return
    }

    const lastStage = _.chain(lastPipe.stages).last().value();

    return (
        <div>
            <p className="flex items-center gap-2 font-karla shimmer">
                <LoaderCircle size={16} className="animate-spin" /> {/* Apply the animation class */}
                {lastStage.key}
            </p>
        </div>
    );
}