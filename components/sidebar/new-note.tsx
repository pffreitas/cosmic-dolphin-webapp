"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBookmark, clearErrors } from "@/lib/store/slices/bookmarksSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

interface NewNoteButtonProps {}

export default function NewNoteButton({}: NewNoteButtonProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [url, setUrl] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const createLoading = useAppSelector(
    (state) => state.bookmarks.createLoading
  );
  const createError = useAppSelector((state) => state.bookmarks.createError);

  const handleCreateBookmark = async () => {
    dispatch(clearErrors()); // Clear any previous errors
    const result = await dispatch(
      createBookmark({
        sourceUrl: url,
      })
    );

    if (createBookmark.fulfilled.match(result)) {
      setShowOverlay(false);
      setUrl("");
      router.push(`/bookmarks/${result.payload.id}`);
    }
  };

  const handleNewNote = () => {
    setShowOverlay(true);
  };

  const handleOverlayClick = () => {
    setShowOverlay(false);
    dispatch(clearErrors()); // Clear errors when closing overlay
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
            <div className="absolute w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {createLoading && (
                <div className="absolute w-full h-full blur rounded-lg bg-gradient-to-br from-pink-500 via-violet-500 to-cyan-500 animate-tilt"></div>
              )}
              <div className="relative bg-white rounded-lg p-4 shadow-2xl shadow-teal-300">
                <input
                  type="text"
                  className="w-full p-2 focus:outline-none "
                  value={url}
                  autoFocus={true}
                  disabled={createLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !createLoading) {
                      handleCreateBookmark();
                    }
                  }}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="URL"
                />

                {createError && (
                  <div className="text-red-600 p-2 text-sm">{createError}</div>
                )}
              </div>
            </div>
            {/* <div className="absolute w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur rounded-lg bg-gradient-to-br from-pink-500 via-violet-500 to-cyan-500 animate-tilt">
              <div className=" bg-white p-4 rounded-lg flex gap-2">
               
              </div>
            </div> */}
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
        <div className="flex-1 mx-2">New Bookmark</div>
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
