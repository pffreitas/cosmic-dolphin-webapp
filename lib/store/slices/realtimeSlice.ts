import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bookmark } from "@cosmic-dolphin/api";
import {
  Task,
  ConnectionState,
  ConnectionStatus,
  RealtimeEventPayload,
} from "@/lib/types/realtime";

interface RealtimeState {
  currentBookmark: Bookmark | null;
  tasks: Task[];
  isLoading: boolean;
  connection: ConnectionState;
  eventQueue: RealtimeEventPayload[];
  lastEventTimestamp: number | null;
}

const initialState: RealtimeState = {
  currentBookmark: null,
  tasks: [],
  isLoading: false,
  connection: {
    status: "disconnected",
    attempts: 0,
    lastConnected: null,
    lastError: null,
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  },
  eventQueue: [],
  lastEventTimestamp: null,
};

const realtimeSlice = createSlice({
  name: "realtime",
  initialState,
  reducers: {
    // Connection management
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.connection.status = action.payload;
      if (action.payload === "connected") {
        state.connection.lastConnected = Date.now();
        state.connection.attempts = 0;
        state.connection.lastError = null;
      }
    },

    incrementConnectionAttempts: (state) => {
      state.connection.attempts += 1;
    },

    setConnectionError: (state, action: PayloadAction<string>) => {
      state.connection.status = "error";
      state.connection.lastError = action.payload;
    },

    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.connection.isOnline = action.payload;
      if (!action.payload) {
        state.connection.status = "disconnected";
      }
    },

    resetConnection: (state) => {
      state.connection.attempts = 0;
      state.connection.lastError = null;
    },

    // Bookmark management
    setCurrentBookmark: (state, action: PayloadAction<Bookmark>) => {
      state.currentBookmark = action.payload;
      state.lastEventTimestamp = Date.now();
    },

    setCurrentBookmarkFromApi: (state, action: PayloadAction<Bookmark>) => {
      console.log("setCurrentBookmarkFromApi", action.payload);
      state.currentBookmark = action.payload;
      state.lastEventTimestamp = Date.now();
    },

    updateBookmark: (state, action: PayloadAction<Bookmark>) => {
      state.currentBookmark = action.payload;
      state.isLoading = false;
      state.lastEventTimestamp = Date.now();
    },

    updateBookmarkFromApi: (state, action: PayloadAction<Bookmark>) => {
      state.currentBookmark = action.payload;
      state.isLoading = false;
      state.lastEventTimestamp = Date.now();
    },

    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Task management
    addTask: (
      state,
      action: PayloadAction<{ taskID: string; name: string }>
    ) => {
      const newTask: Task = {
        taskID: action.payload.taskID,
        name: action.payload.name,
        status: "running",
        subTasks: {},
      };
      state.tasks.push(newTask);
      state.lastEventTimestamp = Date.now();
    },

    updateTaskStatus: (
      state,
      action: PayloadAction<{
        taskID: string;
        status: Task["status"];
        subTasks?: Record<string, Task>;
      }>
    ) => {
      const taskIndex = state.tasks.findIndex(
        (task) => task.taskID === action.payload.taskID
      );
      if (taskIndex !== -1) {
        state.tasks[taskIndex].status = action.payload.status;
        if (action.payload.subTasks) {
          state.tasks[taskIndex].subTasks = action.payload.subTasks;
        }
        state.lastEventTimestamp = Date.now();
      }
    },

    updateTaskSubTasks: (
      state,
      action: PayloadAction<{
        taskID: string;
        subTasks: Record<string, Task>;
      }>
    ) => {
      const taskIndex = state.tasks.findIndex(
        (task) => task.taskID === action.payload.taskID
      );
      if (taskIndex !== -1) {
        state.tasks[taskIndex].subTasks = action.payload.subTasks;
        state.lastEventTimestamp = Date.now();
      }
    },

    // Event queue management (for offline scenarios)
    queueEvent: (state, action: PayloadAction<RealtimeEventPayload>) => {
      state.eventQueue.push(action.payload);
    },

    processEvent: (state, action: PayloadAction<RealtimeEventPayload>) => {
      const event = action.payload;
      console.log(event.type, event.data);

      switch (event.type) {
        case "bookmark.updated":
          state.isLoading = true;
          state.currentBookmark = event.data;
          state.isLoading = false;
          break;

        case "task.started":
          const newTask: Task = {
            taskID: event.data.taskID,
            name: event.data.name,
            status: "running",
            subTasks: {},
          };
          state.tasks.push(newTask);
          break;

        case "task.completed":
          const completedTaskIndex = state.tasks.findIndex(
            (task) => task.taskID === event.data.taskID
          );
          if (completedTaskIndex !== -1) {
            state.tasks[completedTaskIndex].status = "completed";
            state.tasks[completedTaskIndex].subTasks = event.data.subTasks;
          }
          break;

        case "task.updated":
          const updatedTaskIndex = state.tasks.findIndex(
            (task) => task.taskID === event.data.taskID
          );
          if (updatedTaskIndex !== -1) {
            state.tasks[updatedTaskIndex].subTasks = event.data.subTasks;
          }
          break;

        case "task.error":
          const errorTaskIndex = state.tasks.findIndex(
            (task) => task.taskID === event.data.taskID
          );
          if (errorTaskIndex !== -1) {
            state.tasks[errorTaskIndex].status = "error";
            state.tasks[errorTaskIndex].subTasks = event.data.subTasks;
          }
          break;
      }

      state.lastEventTimestamp = Date.now();
    },

    processEventQueue: (state) => {
      // Process queued events when reconnecting
      state.eventQueue.forEach((event) => {
        console.log(event.type, event.data);
        switch (event.type) {
          case "bookmark.updated":
            state.currentBookmark = event.data;
            break;
          case "task.started":
            const newTask: Task = {
              taskID: event.data.taskID,
              name: event.data.name,
              status: "running",
              subTasks: {},
            };
            if (!state.tasks.find((t) => t.taskID === event.data.taskID)) {
              state.tasks.push(newTask);
            }
            break;
          case "task.completed":
          case "task.error":
            const taskIndex = state.tasks.findIndex(
              (t) => t.taskID === event.data.taskID
            );
            if (taskIndex !== -1) {
              state.tasks[taskIndex].status =
                event.type === "task.completed" ? "completed" : "error";
              state.tasks[taskIndex].subTasks = event.data.subTasks;
            }
            break;
          case "task.updated":
            const updateIndex = state.tasks.findIndex(
              (t) => t.taskID === event.data.taskID
            );
            if (updateIndex !== -1) {
              state.tasks[updateIndex].subTasks = event.data.subTasks;
            }
            break;
        }
      });
      state.eventQueue = [];
      state.lastEventTimestamp = Date.now();
    },

    clearEventQueue: (state) => {
      state.eventQueue = [];
    },

    // Reset state
    resetRealtimeState: (state) => {
      state.currentBookmark = null;
      state.tasks = [];
      state.isLoading = false;
      state.eventQueue = [];
      state.lastEventTimestamp = null;
    },
  },
});

export const {
  setConnectionStatus,
  incrementConnectionAttempts,
  setConnectionError,
  setOnlineStatus,
  resetConnection,
  setCurrentBookmark,
  setCurrentBookmarkFromApi,
  updateBookmark,
  updateBookmarkFromApi,
  setLoadingState,
  addTask,
  updateTaskStatus,
  updateTaskSubTasks,
  queueEvent,
  processEvent,
  processEventQueue,
  clearEventQueue,
  resetRealtimeState,
} = realtimeSlice.actions;

export default realtimeSlice.reducer;
