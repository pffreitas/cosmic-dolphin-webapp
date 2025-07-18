"use client";

import { EditorContent, EditorProvider, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import { Extension } from "@tiptap/core";
import { marked } from "marked";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

// Extend the TipTap core module to include our custom storage
declare module "@tiptap/core" {
  interface Storage {
    submitExtension?: {
      onSubmit?: () => void;
    };
  }
}

// Custom extension for submit keyboard shortcut
const SubmitExtension = Extension.create({
  name: "submitExtension",

  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => {
        // Get the onSubmit callback from the editor's storage
        const onSubmit = this.editor.storage.submitExtension?.onSubmit;
        if (onSubmit) {
          onSubmit();
          return true;
        }
        return false;
      },
    };
  },
});

interface CosmicEditorProps {
  className?: string;
  content: string;
  onUpdate: (text: string) => void;
  onSubmit?: () => void;
}

const CosmicEditor = ({
  content,
  onUpdate,
  onSubmit,
  className,
}: CosmicEditorProps) => {
  const extensions = [
    StarterKit,
    Highlight,
    Placeholder,
    Typography,
    SubmitExtension,
  ];

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn(
          "focus:outline-none min-h-[75px] overflow-y-auto focus:ring-0 placeholder:text-gray-500",
          className
        ),
      },
    },
    extensions,
    content: "",
    onUpdate: ({ editor }) => {
      onUpdate(editor.getText());
    },
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      // Store the onSubmit callback in the editor's storage for the extension to access
      if (!editor.storage.submitExtension) {
        editor.storage.submitExtension = {};
      }
      editor.storage.submitExtension.onSubmit = onSubmit;
    },
  });

  useEffect(() => {
    editor?.commands.insertContent(marked(content));
  }, [editor, content]);

  // Update the onSubmit callback in storage when it changes
  useEffect(() => {
    if (editor) {
      if (!editor.storage.submitExtension) {
        editor.storage.submitExtension = {};
      }
      editor.storage.submitExtension.onSubmit = onSubmit;
    }
  }, [editor, onSubmit]);

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
};

export default CosmicEditor;
