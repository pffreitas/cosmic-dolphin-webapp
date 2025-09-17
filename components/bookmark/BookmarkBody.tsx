"use client";
import { Bookmark } from "@cosmic-dolphin/api";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import CosmicMarkdown from "../markdown/CosmicMarkdown";
import OpenGraphWebpage from "../opengraph/OpenGraphWebpage";
import CosmicLoading from "../loading/CosmicLoading";
import {
  Task as TaskComponent,
  TaskItemFile,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from "../ai-elements/task";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Task = {
  taskID: string;
  name: string;
  status: "running" | "completed" | "error";
  subTasks: Record<string, Task>;
};

export const BookmarkBody = (props: { bookmark: Bookmark }) => {
  const [bookmark, setBookmark] = useState(props.bookmark);
  const [currentTask, setCurrentTask] = useState<Task[]>([
    {
      taskID: "1",
      name: "Task 1",
      status: "running",
      subTasks: {
        "1": {
          taskID: "1",
          name: "Sub Task 1",
          status: "running",
          subTasks: {},
        },
        "2": {
          taskID: "2",
          name: "Sub Task 2",
          status: "completed",
          subTasks: {},
        },
        "3": {
          taskID: "3",
          name: "Sub Task 3",
          status: "error",
          subTasks: {},
        },
      },
    },
    {
      taskID: "2",
      name: "Task 2",
      status: "completed",
      subTasks: {},
    },
    {
      taskID: "3",
      name: "Task 3",
      status: "error",
      subTasks: {},
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .channel("bookmarks")
      .on("broadcast", { event: "update" }, (payload) => {
        setIsLoading(true);
        if (payload.payload.type === "bookmark.updated") {
          setIsLoading(false);
          setBookmark(payload.payload.data as Bookmark);
        }

        if (payload.payload.type === "task.started") {
          console.log("task.started", currentTask);
          setCurrentTask([
            ...currentTask,
            {
              taskID: payload.payload.data.taskID,
              name: payload.payload.data.name,
              status: "running",
              subTasks: {},
            },
          ]);
        }
        if (payload.payload.type === "task.completed") {
          console.log("task.completed", currentTask);
          setCurrentTask(
            currentTask.map((task) =>
              task.taskID === payload.payload.data.taskID
                ? {
                    ...task,
                    status: "completed",
                    subTasks: payload.payload.data.subTasks as Record<
                      string,
                      Task
                    >,
                  }
                : task
            )
          );
          console.log("task.completed", currentTask);
        }

        if (payload.payload.type === "task.updated") {
          console.log("task.updated", currentTask);
          setCurrentTask(
            currentTask.map((task) =>
              task.taskID === payload.payload.data.taskID
                ? {
                    ...task,
                    subTasks: payload.payload.data.subTasks as Record<
                      string,
                      Task
                    >,
                  }
                : task
            )
          );
          console.log("task.updated", currentTask);
        }

        if (payload.payload.type === "task.error") {
          console.log("task.error", currentTask);
          setCurrentTask(
            currentTask.map((task) =>
              task.taskID === payload.payload.data.taskID
                ? {
                    ...task,
                    status: "error",
                    subTasks: payload.payload.data.subTasks as Record<
                      string,
                      Task
                    >,
                  }
                : task
            )
          );
        }
      })
      .subscribe((status, error) =>
        console.log(
          "Subscription to bookmarks channel established",
          status,
          error
        )
      );
  }, [supabase, currentTask, isLoading, bookmark]);

  console.log("currentTask", currentTask);
  return (
    <div className="flex flex-col gap-8">
      {bookmark.metadata?.openGraph && (
        <OpenGraphWebpage
          title={bookmark.metadata.openGraph.title || ""}
          description={bookmark.metadata.openGraph.description || ""}
          image={bookmark.metadata.openGraph.image || ""}
          url={bookmark.metadata.openGraph.url || ""}
        />
      )}
      {true && <div className="flex justify-center items-center"></div>}

      {currentTask.length > 0 && (
        <Card>
          <CardContent>
            <div className="flex flex-col gap-2 mt-6">
              {currentTask.map((task) => (
                <TaskComponent
                  key={task.taskID}
                  className="w-full sss"
                  open={task.status === "running"}
                >
                  <TaskTrigger title={task.name} status={task.status} />
                  <TaskContent>
                    {Object.values(task.subTasks).map((subTask) => (
                      <TaskItem key={subTask.taskID}>
                        {subTask.name} - {subTask.status}
                      </TaskItem>
                    ))}
                  </TaskContent>
                </TaskComponent>
              ))}
              <CosmicLoading />
            </div>
          </CardContent>
        </Card>
      )}

      {bookmark.summary && <CosmicMarkdown body={bookmark.summary} />}
    </div>
  );
};
