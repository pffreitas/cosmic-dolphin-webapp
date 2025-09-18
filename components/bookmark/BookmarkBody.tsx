"use client";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setCurrentBookmarkFromApi } from "@/lib/store/slices/realtimeSlice";
import { Bookmark } from "@cosmic-dolphin/api";
import CosmicMarkdown from "../markdown/CosmicMarkdown";
import OpenGraphWebpage from "../opengraph/OpenGraphWebpage";
import CosmicLoading from "../loading/CosmicLoading";
import { ConnectionStatus } from "../realtime/ConnectionStatus";
import {
  Task as TaskComponent,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from "../ai-elements/task";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { RefreshCcwIcon, ShareIcon, ThumbsUpIcon } from "lucide-react";
import { Action, Actions } from "../ai-elements/actions";
import { Separator } from "../ui/separator";
import {
  useActiveSession,
  useSessionByBookmark,
} from "@/lib/store/realtimeSelectors";

export const BookmarkBody = (props: { bookmark: Bookmark }) => {
  const dispatch = useAppDispatch();
  const { currentBookmark } = useAppSelector((state) => state.realtime);

  const activeSession = useSessionByBookmark(props.bookmark.id);
  console.log("activeSession", activeSession);

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

      <Card>
        <CardContent className="px-5 py-2">
          <div className="flex flex-row gap-6 h-8 items-stretch">
            <div className="w-[180px] flex">
              <CosmicLoading />
            </div>
            <Separator orientation="vertical" className="w-px" />
            <div className="flex-1 flex align-center">
              {/* {lastestRunningTask && (
                <TaskComponent
                  key={lastestRunningTask.taskID}
                  className="w-full"
                  open={lastestRunningTask.status === "running"}
                >
                  <TaskTrigger
                    title={lastestRunningTask.name}
                    status="running"
                  />
                  <TaskContent></TaskContent>
                </TaskComponent>
              )} */}
            </div>
          </div>
        </CardContent>
      </Card>

      {bookmark.metadata?.openGraph && (
        <OpenGraphWebpage
          title={bookmark.metadata.openGraph.title || ""}
          description={bookmark.metadata.openGraph.description || ""}
          image={bookmark.metadata.openGraph.image || ""}
          url={bookmark.metadata.openGraph.url || ""}
        />
      )}

      {bookmark.summary && <CosmicMarkdown body={bookmark.summary} />}
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
