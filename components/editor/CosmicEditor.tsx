"use client";

import { EditorContent, EditorProvider, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import { marked } from "marked";
import { useEffect } from "react";

const extensions = [StarterKit, Highlight, Placeholder, Typography];

interface CosmicEditorProps {
  content: string;
}

const CosmicEditor = ({ content }: CosmicEditorProps) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "focus:outline-none  focus:ring-0",
      },
    },
    extensions,
    content: "",
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
  });

  useEffect(() => {
    editor?.commands.insertContent(marked(content));
  }, [editor, content]);

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
};

export default CosmicEditor;
