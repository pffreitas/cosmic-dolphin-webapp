"use client";
import { Bookmark } from "@cosmic-dolphin/api";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export const BookmarkBody = ({ bookmark }: { bookmark: Bookmark }) => {
  const [body, setBody] = useState(bookmark.content);

  const supabase = createClient();
  useEffect(() => {
    supabase
      .channel("bookmarks")
      .on("broadcast", { event: "update" }, (payload) => {
        console.log(payload);
        setBody(payload.payload.data.output);
      })
      .subscribe((status, error) =>
        console.log(
          "Subscription to bookmarks channel established",
          status,
          error
        )
      );
  }, [bookmark, supabase]);

  return (
    <div>
      <h1>{bookmark.title}</h1>
      <div>{body}</div>
    </div>
  );
};
