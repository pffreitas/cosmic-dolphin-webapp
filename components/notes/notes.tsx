"use client";
import { useEffect, useState } from 'react';
import { PipelineLoading } from "@/components/pipeline/pipeline-loader";
import { fetchPipelines } from "@/lib/repository/pipeline.repo";
import type { Note, NoteSection } from "@cosmic-dolphin/api";
import _ from 'lodash';
import { fetchNote } from '@/lib/repository/notes.repo';
import moment from 'moment';

interface NoteProps {
    initialNote: Note | null;
    noteId: number;
    accessToken: string;
}

export default function Note({ initialNote, noteId, accessToken }: NoteProps) {
    const [note, setNote] = useState<Note | null>(initialNote);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchNoteData() {
        const noteData = await fetchNote(accessToken, noteId);
        setNote(noteData);
    }

    useEffect(() => {
        if (!isLoading) {
            fetchNoteData();
        }
    }, [isLoading, accessToken, noteId]);

    const onCompleted = () => {
        setIsLoading(false);
    }

    if (!note || !note.id) {
        return <div>Note not found</div>;
    }

    const tags = note.tags;

    return (
        <div key={note.id}>
            {isLoading && <PipelineLoading accessToken={accessToken} noteId={note.id} onCompleted={onCompleted} />}
            {!isLoading && (
                <div key={note.id}>
                    <h1 className="font-bold font-karla text-3xl mb-4">{note.title}</h1>
                    <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent mb-4" />
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags?.map((t: string) => (
                            <span key={t} className="bg-foreground/10 text-foreground text-[0.65rem] uppercase text-gray-600 px-2 py-1 rounded-sm">{t}</span>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Created {moment(note.createdAt).fromNow()}</p>
                    <p className="mb-4">{note.summary}</p>
                    {note.sections?.map((s) => (
                        <div  className="mb-4">
                            <h2 className="font-karla text-2xl mb-2">{s.content.title}</h2>
                            <p>{s.content.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
