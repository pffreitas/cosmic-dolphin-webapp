"use client";
import { Bookmark } from "@cosmic-dolphin/api";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export const BookmarkBody = ({ bookmark }: { bookmark: Bookmark }) => {
  const supabase = createClient();
  useEffect(() => {
    supabase
      .channel("bookmarks")
      .on("broadcast", { event: "update" }, (payload) => console.log(payload))
      .subscribe((status, error) =>
        console.log(
          "Subscription to bookmarks channel established",
          status,
          error
        )
      );
  }, [bookmark, supabase]);

  return <div>{bookmark.title}</div>;
};
