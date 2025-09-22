"use client";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setCurrentBookmarkFromApi } from "@/lib/store/slices/realtimeSlice";
import { Bookmark } from "@cosmic-dolphin/api";
import CosmicMarkdown from "../markdown/CosmicMarkdown";
import OpenGraphWebpage from "../opengraph/OpenGraphWebpage";
import CosmicLoading from "../loading/CosmicLoading";
import { ConnectionStatus } from "../realtime/ConnectionStatus";
import { Card, CardContent } from "../ui/card";
import { RefreshCcwIcon, ShareIcon, ThumbsUpIcon } from "lucide-react";
import { Action, Actions } from "../ai-elements/actions";
import { Separator } from "../ui/separator";
import { useSessionByBookmark } from "@/lib/store/realtimeSelectors";
import { Badge } from "../ui/badge";

export const BookmarkBody = (props: { bookmark: Bookmark }) => {
  const dispatch = useAppDispatch();
  const { currentBookmark } = useAppSelector((state) => state.realtime);

  const activeSession = useSessionByBookmark(props.bookmark.id);
  console.log("session for bookmark", activeSession);

  useEffect(() => {
    if (
      props.bookmark &&
      (!currentBookmark || currentBookmark.id !== props.bookmark.id)
    ) {
      dispatch(setCurrentBookmarkFromApi(props.bookmark));
    }
  }, [props.bookmark, currentBookmark, dispatch]);

  const bookmark = currentBookmark || props.bookmark;

  return (
    <div className="flex flex-col gap-8">
      <ConnectionStatus />

      {activeSession?.isLoading && (
        <Card>
          <CardContent className="px-5 py-2">
            <div className="flex flex-row gap-6 h-8 items-stretch">
              <div className="w-[180px] flex">
                <CosmicLoading />
              </div>
              <Separator orientation="vertical" className="w-px" />
              <div className="flex-1 flex align-center"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {bookmark.metadata?.openGraph && (
        <OpenGraphWebpage
          title={bookmark.metadata.openGraph.title || ""}
          description={bookmark.metadata.openGraph.description || ""}
          image={bookmark.metadata.openGraph.image || ""}
          url={bookmark.metadata.openGraph.url || ""}
        />
      )}

      {bookmark.cosmicTags && (
        <div className="flex flex-row gap-2">
          {bookmark.cosmicTags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {bookmark.cosmicSummary && (
        <CosmicMarkdown body={bookmark.cosmicSummary} />
      )}
      <div className="flex">
        <Actions>
          <Action label="Like">
            <RefreshCcwIcon className="size-4" />
          </Action>
          <Action label="Like">
            <ThumbsUpIcon className="size-4" />
          </Action>
          <Action label="Share">
            <ShareIcon className="size-4" />
          </Action>
        </Actions>
      </div>
    </div>
  );
};
