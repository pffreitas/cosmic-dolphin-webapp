"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { submitPrompt, SubmitPromptFormData } from "@/app/actions";


export default function ChatBox() {
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

    const onSubmit = (data: SubmitPromptFormData) => {
        console.log("Submitted Data:", data);
        submitPrompt(data);
        reset();
    };

    const isMessageEmpty = !watch("prompt");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
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
                <ArrowUp  />
            </Button>
        </form>
    );
}