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
    pendingPromptTargetNoteId,
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

  // Handle streaming when there's a pending prompt for this specific note
  useEffect(() => {
    if (
      pendingPrompt &&
      pendingPromptTargetNoteId === noteId &&
      !streamRef.current
    ) {
      streamRef.current = true;

      dispatch(clearStreaming());

      dispatch(
        streamNoteKnowledge({
          accessToken,
          noteId: noteId, // Use the specific noteId instead of fallback logic
          prompt: pendingPrompt,
        })
      ).then(() => {
        dispatch(clearPendingPrompt());
        // Refresh the note after streaming to get the updated content
        dispatch(fetchNoteById({ accessToken, noteId: noteId }));
        streamRef.current = false;
      });
    }
  }, [
    isLoading,
    accessToken,
    noteId,
    pendingPrompt,
    pendingPromptTargetNoteId,
    dispatch,
  ]);

  // Use currentNote from Redux store (initialized with server-side data)
  const noteToRender = currentNote || note;

  if (!noteToRender || !noteToRender.id) {
    return <div>Note not found</div>;
  }

  return (
    <div key={noteToRender.id}>
      {isStreaming && (
        <div className="flex flex-col gap-4">
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
        </div>
      )}

      {streamError && (
        <div className="text-red-500 mb-4">Error: {streamError}</div>
      )}

      {!isStreaming && (
        <div className="flex flex-col gap-4" key={noteToRender.id}>
          <CosmicEditor
            content={noteToRender.body}
            onUpdate={(text) => {
              console.log("Updated content:", text);
            }}
          />
          <div className="flex flex-col gap-2 mt-4 mb-8">
            {noteToRender.resources &&
              noteToRender.resources.map(
                (resource) =>
                  resource.openGraph && (
                    <a
                      key={resource.openGraph.title}
                      href={resource.openGraph.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex text-inherit no-underline select-none transition-all duration-75 ease-in-out cursor-pointer flex-grow min-w-0 flex-wrap-reverse items-stretch text-left overflow-hidden border border-white/13 rounded-[10px] relative hover:bg-white/5"
                    >
                      {/* Text Content Section */}
                      <div className="flex-[4_1_180px] p-3 pb-[14px] overflow-hidden text-left">
                        {/* Title */}
                        <div className="text-sm leading-5 text-white/81 whitespace-nowrap overflow-hidden text-ellipsis min-h-6 mb-0.5">
                          {resource.openGraph.title}
                        </div>

                        {/* Description */}
                        <div className="text-xs leading-4 text-white/46 h-8 overflow-hidden">
                          {resource.openGraph.description}
                        </div>

                        {/* URL with Favicon */}
                        <div className="flex mt-1.5">
                          {resource.openGraph.image && (
                            <img
                              src={resource.openGraph.image}
                              alt=""
                              className="w-4 h-4 min-w-4 mr-1.5 rounded-sm"
                            />
                          )}
                          <div className="text-xs leading-4 text-white/81 whitespace-nowrap overflow-hidden text-ellipsis">
                            {resource.openGraph.url}
                          </div>
                        </div>
                      </div>

                      {/* Image Section */}
                      {resource.openGraph.image && (
                        <div className="flex-[1_1_180px] block relative">
                          <div className="absolute inset-0">
                            <div className="w-full h-full">
                              <img
                                src={resource.openGraph.image}
                                alt={resource.openGraph.title || ""}
                                className="block object-cover w-full h-full"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </a>
                  )
              )}
          </div>
        </div>
      )}
    </div>
  );
}
