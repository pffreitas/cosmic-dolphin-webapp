"use client";

import { EditorContent, EditorProvider, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Extension } from "@tiptap/core";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ExpandableMark } from "./extensions/ExpandableMark";
import ExpandableDropdown from "./ExpandableDropdown";

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
      "Mod-Y": () => {
        console.log("Mod-Y");
        this.editor.commands.insertContent(
          marked(
            "![Image 5](https://semaphore.io/wp-content/uploads/2025/04/technical_debt-1056x255.png)"
          )
        );
        return true;
      },
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
  const [dropdownState, setDropdownState] = useState<{
    isOpen: boolean;
    position: { x: number; y: number } | null;
    content: string;
  }>({
    isOpen: false,
    position: null,
    content: "",
  });

  const extensions = [
    StarterKit,
    Highlight,
    Placeholder,
    Typography,
    SubmitExtension,
    ExpandableMark,
    Image,
  ];

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn(
          "focus:outline-none min-h-[75px] overflow-y-auto focus:ring-0 placeholder:text-gray-500",
          className
        ),
      },
      handleClick: (view, pos, event) => {
        const target = event.target as HTMLElement;
        
        // Check if clicked element is an expandable mark
        if (target.hasAttribute('data-expandable')) {
          const content = target.getAttribute('data-content') || target.textContent || '';
          const rect = target.getBoundingClientRect();
          
          setDropdownState({
            isOpen: true,
            position: {
              x: rect.left,
              y: rect.bottom + window.scrollY,
            },
            content,
          });
          
          return true; // Mark event as handled
        }
        
        // Close dropdown if clicking elsewhere
        setDropdownState(prev => ({ ...prev, isOpen: false }));
        return false;
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

  const handleExpandClick = (content: string) => {
    console.log("Expand on:", content);
    // Future implementation: trigger expand functionality
  };

  const handleDropdownClose = () => {
    setDropdownState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="relative">
      <EditorContent editor={editor} />
      <ExpandableDropdown
        isOpen={dropdownState.isOpen}
        position={dropdownState.position}
        content={dropdownState.content}
        onClose={handleDropdownClose}
        onExpandClick={handleExpandClick}
      />
    </div>
  );
};

export default CosmicEditor;
