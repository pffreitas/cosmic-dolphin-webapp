"use client";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setCurrentBookmarkFromApi } from "@/lib/store/slices/realtimeSlice";
import { Bookmark, ResourceType } from "@cosmic-dolphin/api";
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
import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselContent,
  CarouselPrevious,
} from "../ui/carousel";
import OpenGraphImage from "../notes/OpenGraphImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const BookmarkBody = (props: { bookmark: Bookmark }) => {
  const dispatch = useAppDispatch();
  const { currentBookmark } = useAppSelector((state) => state.realtime);
  const [isImageGaleryDialogOpen, setIsImageGaleryDialogOpen] = useState(false);

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
        <div className="flex flex-row flex-wrap gap-2">
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

      {bookmark.cosmicImages && (
        <div className="w-full">
          <Carousel className="w-full max-w-full">
            <CarouselContent className="-ml-1">
              {bookmark.cosmicImages.map((image, index) => (
                <CarouselItem key={index} className="pl-1 basis-full">
                  <div className="p-1">
                    <OpenGraphImage
                      imageUrl={image.url}
                      title={image.title}
                      description={image.description}
                      onClick={() => setIsImageGaleryDialogOpen(true)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>

          <Dialog
            open={isImageGaleryDialogOpen}
            onOpenChange={setIsImageGaleryDialogOpen}
          >
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>Image Gallery</DialogTitle>
              </DialogHeader>
              <div className="relative flex justify-center overflow-hidden">
                <Carousel className="w-full max-w-3xl">
                  <CarouselContent>
                    {bookmark.cosmicImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="h-full flex flex-col items-center p-1 gap-2 sm:gap-4">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="flex-1 w-full max-h-[60vh] sm:max-h-[70vh] object-contain"
                          />

                          <div className="mt-auto flex flex-col gap-1 px-2">
                            {image.title && (
                              <h4 className="text-sm font-medium text-gray-900 mb-1 text-center">
                                {image.title}
                              </h4>
                            )}
                            {image.description && (
                              <p className="text-xs text-gray-600 line-clamp-2 text-center">
                                {image.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
