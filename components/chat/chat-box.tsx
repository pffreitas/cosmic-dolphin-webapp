"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { NoteType } from "@cosmic-dolphin/api";
import { useSession } from "@supabase/auth-helpers-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { createNewNote, setPendingPrompt } from "@/lib/store/slices/notesSlice";
import CosmicEditor from "../editor/CosmicEditor";

interface ChatBoxProps {
  onSubmit: () => void;
}

export default function ChatBox({ onSubmit }: ChatBoxProps) {
  const [prompt, setPrompt] = useState("");
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.notes);
  const session = useSession();
  const accessToken = session?.access_token;
  const router = useRouter();

  const handleSubmitPrompt = async () => {
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    if (!prompt.trim()) {
      return;
    }

    try {
      // Create a new note with the user's prompt as body using Redux
      const resultAction = await dispatch(
        createNewNote({
          accessToken,
          body: "",
          noteType: NoteType.Knowledge,
        })
      );

      if (createNewNote.fulfilled.match(resultAction)) {
        const createdNote = resultAction.payload;

        // Store the prompt in Redux state for processing after redirect
        dispatch(
          setPendingPrompt({
            prompt: prompt.trim(),
            targetNoteId: createdNote.id,
          })
        );

        router.push(`/notes/${createdNote.id}`);

        setPrompt("");
        onSubmit();
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const isMessageEmpty = !prompt.trim();

  return (
    <div className="flex flex-col gap-4">
      <CosmicEditor
        className="max-h-[50vh]"
        onUpdate={(text) => {
          setPrompt(text);
        }}
        content={"https://semaphore.io/blog/ai-technical-debt"}
        onSubmit={handleSubmitPrompt}
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleSubmitPrompt}
        disabled={isMessageEmpty || isLoading}
        className={`rounded-md self-end p-2 h-8 w-8 disabled:shadow-none shadow-md hover:bg-gray-100`}
      >
        <ArrowUp />
      </Button>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
