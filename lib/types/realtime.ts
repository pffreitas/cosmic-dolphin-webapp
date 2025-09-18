import { Bookmark } from "@cosmic-dolphin/api";

export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "reconnecting"
  | "error";

export interface Task {
  taskID: string;
  name: string;
  status: "running" | "completed" | "error" | "pending";
  subTasks: Record<string, Task>;
}

export type RealtimeEventType =
  | "bookmark.updated"
  | "task.started"
  | "task.completed"
  | "task.updated"
  | "task.error";

export interface RealtimeEvent {
  type: RealtimeEventType;
  data: any;
  timestamp?: number;
}

export interface BookmarkUpdatedEvent {
  type: "bookmark.updated";
  data: Bookmark;
}

export interface TaskStartedEvent {
  type: "task.started";
  data: {
    taskID: string;
    name: string;
  };
}

export interface TaskCompletedEvent {
  type: "task.completed";
  data: {
    taskID: string;
    subTasks: Record<string, Task>;
  };
}

export interface TaskUpdatedEvent {
  type: "task.updated";
  data: {
    taskID: string;
    subTasks: Record<string, Task>;
  };
}

export interface TaskErrorEvent {
  type: "task.error";
  data: {
    taskID: string;
    subTasks: Record<string, Task>;
    error?: string;
  };
}

export type RealtimeEventPayload =
  | BookmarkUpdatedEvent
  | TaskStartedEvent
  | TaskCompletedEvent
  | TaskUpdatedEvent
  | TaskErrorEvent;

export interface ConnectionState {
  status: ConnectionStatus;
  attempts: number;
  lastConnected: number | null;
  lastError: string | null;
  isOnline: boolean;
}

export interface RealtimeConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  heartbeatInterval: number;
  connectionTimeout: number;
}

export const DEFAULT_REALTIME_CONFIG: RealtimeConfig = {
  maxRetries: 10,
  baseDelay: 1000,
  maxDelay: 30000,
  heartbeatInterval: 30000,
  connectionTimeout: 30000,
};
