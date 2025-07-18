"use client";

import { useEffect, useState } from "react";
import ChatBox from "../chat/chat-box";

interface NewNoteButtonProps {}

export default function NewNoteButton({}: NewNoteButtonProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleNewNote = () => {
    setShowOverlay(true);
  };

  const handleOverlayClick = () => {
    setShowOverlay(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "k") {
        event.preventDefault();
        handleNewNote();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {showOverlay && (
        <div className="fixed inset-0 bg-slate-200 bg-opacity-50 backdrop-blur-sm z-50">
          <div className="fixed inset-0" onClick={handleOverlayClick}></div>
          <div>
            <div className="absolute w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
              <ChatBox
                onSubmit={() => {
                  handleOverlayClick();
                }}
              />
            </div>
          </div>
        </div>
      )}
      <button
        id="new-note-button"
        className="flex-1 rounded-full bg-white/25 px-3 py-2 font-noto text-sm font-semibold text-teal-800 ring-1 ring-black/[0.08] ring-inset hover:bg-white/50 hover:ring-black/[0.13] flex justify-between"
        onClick={() => {
          handleNewNote();
        }}
      >
        <div className="flex-1 mx-2">New Note</div>
        <div className="flex gap-1">
          <span className="flex font-thin uppercase h-5 w-5 items-center justify-center rounded border font-mono text-xs border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50  dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-transparent00">
            ⌘
          </span>
          <span className="flex font-thin uppercase h-5 w-5 items-center justify-center rounded border font-mono text-xs border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50  dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-transparent00">
            k
          </span>
        </div>
      </button>
    </>
  );
}
