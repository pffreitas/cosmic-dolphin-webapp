"use client";
import { useEffect, useRef, useState } from "react";
import type { Note } from "@cosmic-dolphin/api";
import { ResourceType } from "@cosmic-dolphin/api";
import type { StreamProgressDetail } from "@/lib/stream/types";
import {
  ArrowDown,
  CircleCheck,
  CircleDashed,
  CircleX,
  LoaderCircle,
  ChevronRight,
  Clock,
  Zap,
  MessageSquare,
  Wrench,
  Library,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setCurrentNote, clearStreaming } from "@/lib/store/slices/notesSlice";
import CosmicEditor from "../editor/CosmicEditor";
import OpenGraphWebpage from "./OpenGraphWebpage";
import OpenGraphImage from "./OpenGraphImage";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import JsonView from "@uiw/react-json-view";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface NoteProps {
  note: Note | null;
  noteId: number;
  accessToken: string;
}

// Helper function to render progress detail icons
const getProgressIcon = (type: StreamProgressDetail["type"]) => {
  switch (type) {
    case "tool_call":
      return <Wrench size={12} className="text-blue-500" />;
    case "calling_llm":
      return <Zap size={12} className="text-yellow-500" />;
    case "llm_response":
      return <MessageSquare size={12} className="text-green-500" />;
    case "info":
      return <Clock size={12} className="text-gray-500" />;
    case "error":
      return <CircleX size={12} className="text-red-500" />;
    default:
      return <Clock size={12} className="text-gray-500" />;
  }
};

// Helper function to format timestamp
const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default function Note({ note, noteId, accessToken }: NoteProps) {
  const streamRef = useRef<boolean>(false);
  const initializedRef = useRef<boolean>(false);
  const dispatch = useAppDispatch();
  const [openTasks, setOpenTasks] = useState<Set<string>>(new Set());
  const [openContentBoxes, setOpenContentBoxes] = useState<Set<string>>(
    new Set()
  );

  const toggleTask = (taskId: string) => {
    setOpenTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const toggleContentBox = (boxId: string) => {
    setOpenContentBoxes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(boxId)) {
        newSet.delete(boxId);
      } else {
        newSet.add(boxId);
      }
      return newSet;
    });
  };

  const {
    currentNote,
    pendingPrompt,
    pendingPromptTargetNoteId,
    isStreaming,
    streamStatus,
    streamError,
    streamingTokens,
    streamingTasks,
    isLoading,
  } = useAppSelector((state) => state.notes);

  // Initialize Redux store with server-side data
  useEffect(() => {
    if (note && !initializedRef.current) {
      dispatch(setCurrentNote(note));
      initializedRef.current = true;
    }
  }, [note, dispatch]);

  // Handle streaming when there's a pending prompt for this specific note
  useEffect(() => {
    if (
      pendingPrompt &&
      pendingPromptTargetNoteId === noteId &&
      !streamRef.current
    ) {
      streamRef.current = true;

      dispatch(clearStreaming());

      // dispatch(
      //   streamNoteKnowledge({
      //     accessToken,
      //     noteId: noteId, // Use the specific noteId instead of fallback logic
      //     prompt: pendingPrompt,
      //   })
      // ).then(() => {
      //   dispatch(clearPendingPrompt());
      //   // Refresh the note after streaming to get the updated content
      //   dispatch(fetchNoteById({ accessToken, noteId: noteId }));
      //   streamRef.current = false;
      // });
    }
  }, [
    isLoading,
    accessToken,
    noteId,
    pendingPrompt,
    pendingPromptTargetNoteId,
    dispatch,
  ]);

  // Use currentNote from Redux store (initialized with server-side data)
  const noteToRender = currentNote || note;

  if (!noteToRender || !noteToRender.id) {
    return <div>Note not found</div>;
  }

  return (
    <div key={noteToRender.id}>
      <div className="flex flex-col gap-4">
        {isStreaming && (
          <div className="flex gap-4">
            <p className="flex items-center gap-1 font-karla shimmer text-purple-950">
              <LoaderCircle size={16} className="animate-spin" />
              {streamStatus || "Processing your request"}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <ArrowDown size={16} className="animate-bounce" />
              {streamingTokens.length} Tokens Received
            </p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {streamingTasks.map((task) => {
            const isOpen = openTasks.has(task.id);
            return (
              <Collapsible
                key={task.id}
                open={isOpen}
                onOpenChange={() => toggleTask(task.id)}
              >
                <CollapsibleTrigger className="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 rounded transition-colors">
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-90" : "rotate-0"
                    }`}
                  />
                  {task.status === "Running" && (
                    <CircleDashed size={16} className="animate-spin" />
                  )}
                  {task.status === "Completed" && (
                    <CircleCheck size={16} className="text-green-500" />
                  )}
                  {task.status === "Error" && (
                    <CircleX size={16} className="text-red-500" />
                  )}
                  <p className="text-sm text-gray-600">{task.id}</p>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-8 pr-2 pb-2">
                  {task.progressDetails && task.progressDetails.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {task.progressDetails.map((detail) => (
                        <div
                          key={detail.id}
                          className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs"
                        >
                          <div className="mt-0.5">
                            {getProgressIcon(detail.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-700">
                                {detail.message || detail.type}
                              </span>
                              <span className="text-gray-400">
                                {formatTimestamp(detail.timestamp)}
                              </span>
                            </div>
                            {detail.data && (
                              <div className="text-gray-600">
                                {detail.type === "tool_call" &&
                                  detail.data.tool_name && (
                                    <span>Tool: {detail.data.tool_name}</span>
                                  )}
                                {detail.type === "calling_llm" && (
                                  <div className="space-y-2">
                                    {detail.data.model && (
                                      <span>Model: {detail.data.model}</span>
                                    )}
                                    {detail.data.request && (
                                      <div className="mt-2">
                                        <Collapsible
                                          open={openContentBoxes.has(
                                            `request_${detail.id}`
                                          )}
                                          onOpenChange={() =>
                                            toggleContentBox(
                                              `request_${detail.id}`
                                            )
                                          }
                                        >
                                          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                                            <ChevronRight
                                              size={12}
                                              className={`transition-transform duration-200 ${
                                                openContentBoxes.has(
                                                  `request_${detail.id}`
                                                )
                                                  ? "rotate-90"
                                                  : "rotate-0"
                                              }`}
                                            />
                                            View Request
                                          </CollapsibleTrigger>
                                          <CollapsibleContent className="mt-1">
                                            <div className="bg-gray-100 rounded p-2 h-[150px] overflow-y-auto border">
                                              <JsonView
                                                value={detail.data?.request}
                                                collapsed={true}
                                              />
                                            </div>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {detail.type === "llm_response" && (
                                  <div className="space-y-2">
                                    {detail.data.total_tokens && (
                                      <span>
                                        Tokens: {detail.data.total_tokens}
                                      </span>
                                    )}
                                    {detail.data.response && (
                                      <div className="mt-2">
                                        <Collapsible
                                          open={openContentBoxes.has(
                                            `response_${detail.id}`
                                          )}
                                          onOpenChange={() =>
                                            toggleContentBox(
                                              `response_${detail.id}`
                                            )
                                          }
                                        >
                                          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800">
                                            <ChevronRight
                                              size={12}
                                              className={`transition-transform duration-200 ${
                                                openContentBoxes.has(
                                                  `response_${detail.id}`
                                                )
                                                  ? "rotate-90"
                                                  : "rotate-0"
                                              }`}
                                            />
                                            View Response
                                          </CollapsibleTrigger>
                                          <CollapsibleContent className="mt-1">
                                            <div className="bg-green-50 rounded p-2 h-[150px] overflow-y-auto border">
                                              <JsonView
                                                value={detail.data?.response}
                                                collapsed={true}
                                              />
                                            </div>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      No detailed execution logs available for this task yet.
                    </p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>

      {streamError && (
        <div className="text-red-500 mb-4">Error: {streamError}</div>
      )}

      {!isStreaming && (
        <div className="flex flex-col gap-4" key={noteToRender.id}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/library">
                  <Library size={16} />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/notes/${noteToRender.id}`}>
                  {noteToRender.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <CosmicEditor content={noteToRender.body} onUpdate={(text) => {}} />

          <Separator />

          <div className="flex flex-wrap gap-2 my-4">
            {noteToRender.tags &&
              noteToRender.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="text-xs text-gray-500 bg-gray-100 rounded-md"
                >
                  {tag}
                </Badge>
              ))}
          </div>

          <Separator />

          {/* Image Resources Carousel - Everything else is considered an image */}
          {noteToRender.resources &&
            noteToRender.resources.filter(
              (resource) => resource.type === ResourceType.Image
            ).length > 0 && (
              <div>
                <Carousel className="w-full">
                  <CarouselContent>
                    {noteToRender.resources
                      .filter(
                        (resource) => resource.type === ResourceType.Image
                      )
                      .map((resource, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <OpenGraphImage resource={resource} />
                          </div>
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}

          {/* Resources Section */}
          {noteToRender.resources && noteToRender.resources.length > 0 && (
            <div className="flex flex-col gap-4 my-4">
              {/* Web Page Resources */}
              {noteToRender.resources &&
                noteToRender.resources.filter(
                  (resource) => resource.type === ResourceType.WebPage
                ).length > 0 && (
                  <div>
                    <div className="flex flex-col gap-2">
                      {noteToRender.resources
                        .filter(
                          (resource) => resource.type === ResourceType.WebPage
                        )
                        .map(
                          (resource) =>
                            resource.openGraph && (
                              <OpenGraphWebpage
                                key={resource.openGraph.title}
                                resource={resource}
                              />
                            )
                        )}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
