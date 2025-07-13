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
  initialNote: Note | null;
  noteId: number;
  accessToken: string;
}

export default function Note({ initialNote, noteId, accessToken }: NoteProps) {
  const streamRef = useRef<boolean>(false);
  const dispatch = useAppDispatch();

  // Get streaming state from Redux
  const {
    pendingPrompt,
    isStreaming,
    streamStatus,
    streamError,
    currentNote,
    streamingTokens,
    isLoading,
  } = useAppSelector((state) => state.notes);

  // Set initial note if provided
  useEffect(() => {
    if (initialNote && !currentNote) {
      dispatch(setCurrentNote(initialNote));
    }
  }, [initialNote, currentNote, dispatch]);

  function fetchNoteData() {
    dispatch(fetchNoteById({ accessToken, noteId }));
  }

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
        fetchNoteData();
        streamRef.current = false;
      });
    } else if (!isLoading && !isStreaming) {
      fetchNoteData();
    }
  }, [isLoading, accessToken, noteId, pendingPrompt, dispatch]);

  if (!currentNote || !currentNote.id) {
    return <div>Note not found</div>;
  }

  return (
    <div key={currentNote.id}>
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
        <div key={currentNote.id}>
          <CosmicEditor
            content={currentNote.body || streamingTokens.join("")}
          />
        </div>
      )}
    </div>
  );
}
