"use client";
import { useEffect, useState, useRef } from "react";
import type { Note } from "@cosmic-dolphin/api";
import { fetchNote } from "@/lib/repository/notes.repo";
import moment from "moment";
import { ArrowDown, LoaderCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  clearPendingPrompt,
  streamNoteKnowledge,
  setCurrentNote,
  clearStreaming,
} from "@/lib/store/slices/notesSlice";
import CosmicEditor from "../editor/CosmicEditor";

interface NoteProps {
  initialNote: Note | null;
  noteId: number;
  accessToken: string;
}

export default function Note({ initialNote, noteId, accessToken }: NoteProps) {
  const [note, setNote] = useState<Note | null>(initialNote);
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

  async function fetchNoteData() {
    const noteData = await fetchNote(accessToken, noteId);
    setNote(noteData);
    dispatch(setCurrentNote(noteData));
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
        // Clear the pending prompt after processing
        dispatch(clearPendingPrompt());
        // Fetch final note data
        fetchNoteData();
        streamRef.current = false;
      });
    } else if (!isLoading && !isStreaming) {
      fetchNoteData();
    }
  }, [isLoading, accessToken, noteId, pendingPrompt, dispatch]);

  // Update local note state when Redux currentNote changes
  useEffect(() => {
    if (currentNote && currentNote.id === noteId) {
      setNote(currentNote);
    }
  }, [currentNote, noteId]);

  if (!note || !note.id) {
    return <div>Note not found</div>;
  }

  return (
    <div key={note.id}>
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
        <div key={note.id}>
          <CosmicEditor content={note.body || streamingTokens.join("")} />
        </div>
      )}
    </div>
  );
}
