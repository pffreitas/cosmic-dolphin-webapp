"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { redirect } from "next/navigation";
import { submitPrompt, SubmitPromptFormData } from "@/app/actions";
import { createNote } from "@/lib/repository/notes.repo";
import { NoteType } from "@cosmic-dolphin/api";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface ChatBoxProps {
    onSubmit: () => void;
}

export default function ChatBox({ onSubmit }: ChatBoxProps) {

    const session = useSession();
    const accessToken = session?.access_token;

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<SubmitPromptFormData>({
        defaultValues: {
            prompt: "",
        },
    });

    const submitFrom = async (data: SubmitPromptFormData) => {
        const note = await createNote(accessToken, data.prompt, NoteType.Knowledge);
        reset();
        onSubmit();
        redirect(`/notes/${note.id}`);
    };

    const isMessageEmpty = !watch("prompt");

    return (
        <form onSubmit={handleSubmit(submitFrom)} className="flex gap-2">
            <textarea
                id="prompt"
                {...register("prompt", { required: "This field is required" })}
                className="w-full max-w focus:outline-none focus:border-0 resize-none"
                rows={1}
                placeholder="Type something here"
            />
            <Button
                type="submit"
                disabled={isMessageEmpty}
                className={`rounded-full p-2 h-8 w-8 ${isMessageEmpty
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"}`}
            >
                <ArrowUp />
            </Button>
        </form>
    );
}