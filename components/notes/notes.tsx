"use client";
import { useEffect, useRef } from "react";
import type { Note } from "@cosmic-dolphin/api";
import { ArrowDown, LoaderCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  clearPendingPrompt,
  streamNoteKnowledge,
  setCurrentNote,
  clearStreaming,
  fetchNoteById,
} from "@/lib/store/slices/notesSlice";
import CosmicEditor from "../editor/CosmicEditor";

interface NoteProps {
  note: Note | null;
  noteId: number;
  accessToken: string;
}

export default function Note({ note, noteId, accessToken }: NoteProps) {
  const streamRef = useRef<boolean>(false);
  const initializedRef = useRef<boolean>(false);
  const dispatch = useAppDispatch();

  const {
    currentNote,
    pendingPrompt,
    isStreaming,
    streamStatus,
    streamError,
    streamingTokens,
    isLoading,
  } = useAppSelector((state) => state.notes);

  // Initialize Redux store with server-side data
  useEffect(() => {
    if (note && !initializedRef.current) {
      dispatch(setCurrentNote(note));
      initializedRef.current = true;
    }
  }, [note, dispatch]);

  // Handle streaming when there's a pending prompt
  useEffect(() => {
    if (pendingPrompt && !streamRef.current) {
      streamRef.current = true;

      dispatch(clearStreaming());

      dispatch(
        streamNoteKnowledge({
          accessToken,
          noteId,
          prompt: pendingPrompt,
        })
      ).then(() => {
        dispatch(clearPendingPrompt());
        // Refresh the note after streaming to get the updated content
        dispatch(fetchNoteById({ accessToken, noteId }));
        streamRef.current = false;
      });
    }
  }, [isLoading, accessToken, noteId, pendingPrompt, dispatch]);

  // Use currentNote from Redux store (initialized with server-side data)
  const noteToRender = currentNote || note;

  if (!noteToRender || !noteToRender.id) {
    return <div>Note not found</div>;
  }

  return (
    <div key={noteToRender.id}>
      {isStreaming && (
        <div className="flex gap-4">
          <p className="flex items-center gap-1 font-karla shimmer text-purple-950">
            <LoaderCircle size={16} className="animate-spin" />
            {streamStatus || "Processing your request"}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <ArrowDown size={16} className="animate-bounce" />
            {streamingTokens.length} Tokens Received
          </p>
        </div>
      )}
      {streamError && (
        <div className="text-red-500 mb-4">Error: {streamError}</div>
      )}

      {!isStreaming && (
        <div key={noteToRender.id}>
          <h2>{noteToRender.id}</h2>
          <CosmicEditor
            content={noteToRender.body || streamingTokens.join("")}
          />
        </div>
      )}
    </div>
  );
}
