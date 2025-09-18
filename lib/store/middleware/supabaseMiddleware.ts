import { Middleware } from "@reduxjs/toolkit";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import {
  setConnectionStatus,
  incrementConnectionAttempts,
  setConnectionError,
  setOnlineStatus,
  resetConnection,
  updateBookmarkFromApi,
  setLoadingState,
  addTask,
  updateTaskStatus,
  updateTaskSubTasks,
  queueEvent,
  processEventQueue,
} from "../slices/realtimeSlice";
import {
  RealtimeConfig,
  DEFAULT_REALTIME_CONFIG,
  RealtimeEventPayload,
} from "@/lib/types/realtime";
import { RootState } from "../index";

class SupabaseRealtimeManager {
  private channel: RealtimeChannel | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private dispatch: any;
  private getState: () => RootState;
  private config: RealtimeConfig;
  private supabase: ReturnType<typeof createClient>;
  private isDestroyed = false;

  constructor(
    dispatch: any,
    getState: () => RootState,
    config: RealtimeConfig = DEFAULT_REALTIME_CONFIG
  ) {
    this.dispatch = dispatch;
    this.getState = getState;
    this.config = config;
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Monitor online/offline status
    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);
    }
  }

  private handleOnline = () => {
    this.dispatch(setOnlineStatus(true));
    if (this.getState().realtime.connection.status === "disconnected") {
      this.connect();
    }
  };

  private handleOffline = () => {
    this.dispatch(setOnlineStatus(false));
    this.disconnect();
  };

  public connect = () => {
    if (this.isDestroyed) return;

    const state = this.getState().realtime.connection;

    // Don't attempt if already connected or if offline
    if (state.status === "connected" || !state.isOnline) return;

    // Check retry limits
    if (state.attempts >= this.config.maxRetries) {
      this.dispatch(
        setConnectionError(`Max retries (${this.config.maxRetries}) exceeded`)
      );
      return;
    }

    this.dispatch(setConnectionStatus("reconnecting"));
    this.dispatch(incrementConnectionAttempts());

    // Clear existing timers
    this.clearTimers();

    try {
      // Create new channel
      this.channel = this.supabase.channel("bookmarks");

      // Set connection timeout
      this.connectionTimeout = setTimeout(() => {
        this.handleConnectionTimeout();
      }, this.config.connectionTimeout);

      // Setup event handlers
      this.channel
        .on("broadcast", { event: "update" }, this.handleRealtimeEvent)
        .subscribe((status, error) => {
          this.clearConnectionTimeout();

          if (status === "SUBSCRIBED") {
            this.handleConnectionSuccess();
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            this.handleConnectionError(
              error?.message || `Connection failed: ${status}`
            );
          } else if (status === "CLOSED") {
            this.handleConnectionClosed();
          }
        });
    } catch (error) {
      this.handleConnectionError((error as Error).message);
    }
  };

  private handleConnectionSuccess = () => {
    this.dispatch(setConnectionStatus("connected"));
    this.dispatch(resetConnection());
    this.startHeartbeat();
    this.processQueuedEvents();
    console.log("Supabase realtime connection established");
  };

  private handleConnectionError = (error: string) => {
    console.error("Supabase connection error:", error);
    this.dispatch(setConnectionError(error));
    this.scheduleReconnect();
  };

  private handleConnectionTimeout = () => {
    console.warn("Supabase connection timeout");
    this.disconnect();
    this.dispatch(setConnectionError("Connection timeout"));
    this.scheduleReconnect();
  };

  private handleConnectionClosed = () => {
    console.warn("Supabase connection closed");
    this.dispatch(setConnectionStatus("disconnected"));
    this.stopHeartbeat();
    this.scheduleReconnect();
  };

  private handleRealtimeEvent = (payload: any) => {
    if (this.isDestroyed) return;

    try {
      const event: RealtimeEventPayload = payload.payload;

      // If disconnected, queue the event
      if (this.getState().realtime.connection.status !== "connected") {
        this.dispatch(queueEvent(event));
        return;
      }

      // Process the event
      this.processEvent(event);
    } catch (error) {
      console.error("Error processing realtime event:", error);
    }
  };

  private processEvent = (event: RealtimeEventPayload) => {
    console.log(event.type, event.data);
    switch (event.type) {
      case "bookmark.updated":
        this.dispatch(setLoadingState(true));
        this.dispatch(updateBookmarkFromApi(event.data));
        break;

      case "task.started":
        this.dispatch(
          addTask({
            taskID: event.data.taskID,
            name: event.data.name,
          })
        );
        break;

      case "task.completed":
        this.dispatch(
          updateTaskStatus({
            taskID: event.data.taskID,
            status: "completed",
            subTasks: event.data.subTasks,
          })
        );
        break;

      case "task.updated":
        this.dispatch(
          updateTaskSubTasks({
            taskID: event.data.taskID,
            subTasks: event.data.subTasks,
          })
        );
        break;

      case "task.error":
        this.dispatch(
          updateTaskStatus({
            taskID: event.data.taskID,
            status: "error",
            subTasks: event.data.subTasks,
          })
        );
        break;
    }
  };

  private processQueuedEvents = () => {
    this.dispatch(processEventQueue());
  };

  private scheduleReconnect = () => {
    if (this.isDestroyed || this.reconnectTimer) return;

    const state = this.getState().realtime.connection;
    if (state.attempts >= this.config.maxRetries) return;

    // Exponential backoff with jitter
    const delay = Math.min(
      this.config.baseDelay * Math.pow(2, state.attempts) +
        Math.random() * 1000,
      this.config.maxDelay
    );

    console.log(
      `Scheduling reconnect in ${Math.round(delay)}ms (attempt ${state.attempts + 1})`
    );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.isDestroyed && this.getState().realtime.connection.isOnline) {
        this.connect();
      }
    }, delay);
  };

  private startHeartbeat = () => {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.isDestroyed) return;

      // Send a simple ping to check connection health
      if (
        this.channel &&
        this.getState().realtime.connection.status === "connected"
      ) {
        try {
          this.channel.send({
            type: "broadcast",
            event: "ping",
            payload: { timestamp: Date.now() },
          });
        } catch (error) {
          console.error("Heartbeat failed:", error);
          this.handleConnectionError("Heartbeat failed");
        }
      }
    }, this.config.heartbeatInterval);
  };

  private stopHeartbeat = () => {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  };

  private clearTimers = () => {
    this.clearConnectionTimeout();
    this.clearReconnectTimer();
    this.stopHeartbeat();
  };

  private clearConnectionTimeout = () => {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  };

  private clearReconnectTimer = () => {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  };

  public disconnect = () => {
    this.clearTimers();

    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }

    if (!this.isDestroyed) {
      this.dispatch(setConnectionStatus("disconnected"));
    }
  };

  public destroy = () => {
    this.isDestroyed = true;
    this.disconnect();

    // Remove event listeners
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline);
      window.removeEventListener("offline", this.handleOffline);
    }
  };
}

// Singleton instance
let realtimeManager: SupabaseRealtimeManager | null = null;

export const createSupabaseMiddleware = (
  config?: Partial<RealtimeConfig>
): Middleware => {
  const finalConfig = { ...DEFAULT_REALTIME_CONFIG, ...config };

  return (store) => (next) => (action: unknown) => {
    const result = next(action);

    // Initialize connection on first action
    if (!realtimeManager && typeof window !== "undefined") {
      realtimeManager = new SupabaseRealtimeManager(
        store.dispatch,
        store.getState,
        finalConfig
      );

      // Auto-connect if online
      if (navigator.onLine) {
        realtimeManager.connect();
      }
    }

    // Handle specific actions
    if (typeof action === "object" && action !== null && "type" in action) {
      const typedAction = action as { type: string };
      if (typedAction.type === "realtime/resetConnection") {
        realtimeManager?.connect();
      }
    }

    return result;
  };
};

// Cleanup function for app shutdown
export const destroySupabaseConnection = () => {
  if (realtimeManager) {
    realtimeManager.destroy();
    realtimeManager = null;
  }
};
