"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { NoteType } from "@cosmic-dolphin/api";
import { useSession } from "@supabase/auth-helpers-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { createNewNote, setPendingPrompt } from "@/lib/store/slices/notesSlice";

interface ChatBoxProps {
  onSubmit: () => void;
}

export default function ChatBox({ onSubmit }: ChatBoxProps) {
  const [prompt, setPrompt] = useState(
    "https://app.daily.dev/posts/entropy-in-teams-the-silent-productivity-killer-5pxbgkwpz"
  );
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
      // Store the prompt in Redux state for processing after redirect
      dispatch(setPendingPrompt(prompt.trim()));

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
    <div className="flex gap-2">
      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full max-w focus:outline-none focus:border-0 resize-none"
        rows={1}
        placeholder="Type something here"
        disabled={isLoading}
      />
      <Button
        type="button"
        onClick={handleSubmitPrompt}
        disabled={isMessageEmpty || isLoading}
        className={`rounded-full p-2 h-8 w-8 ${
          isMessageEmpty || isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        <ArrowUp />
      </Button>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
