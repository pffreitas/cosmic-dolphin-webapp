import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Note, NoteType } from "@cosmic-dolphin/api";
import { createNote, fetchNote } from "@/lib/repository/notes.repo";
import {
  StreamingTask,
  StreamEvent,
  defaultStreamRegistry,
  createStreamParser,
} from "@/lib/stream";

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  isStreaming: boolean;
  streamStatus: string;
  streamError: string | null;
  pendingPrompt: string | null;
  pendingPromptTargetNoteId: number | null;
  streamingTokens: string[];
  streamingTasks: StreamingTask[];
}

const initialState: NotesState = {
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  isStreaming: false,
  streamStatus: "",
  streamError: null,
  pendingPrompt: null,
  pendingPromptTargetNoteId: null,
  streamingTokens: [],
  streamingTasks: [],
};

// Async thunk for creating a new note
export const createNewNote = createAsyncThunk(
  "notes/createNote",
  async ({
    accessToken,
    body,
    noteType,
  }: {
    accessToken: string;
    body: string;
    noteType: NoteType;
  }) => {
    const note = await createNote(accessToken, body, noteType);
    return note;
  }
);

// Async thunk for fetching a note by ID
export const fetchNoteById = createAsyncThunk(
  "notes/fetchNoteById",
  async ({ accessToken, noteId }: { accessToken: string; noteId: number }) => {
    const note = await fetchNote(accessToken, noteId);
    return note;
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setCurrentNote: (state, action) => {
      state.currentNote = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearStreamError: (state) => {
      state.streamError = null;
    },
    clearStreaming: (state) => {
      state.isStreaming = false;
      state.streamStatus = "";
      state.streamError = null;
      state.streamingTokens = [];
    },
    setPendingPrompt: (state, action) => {
      state.pendingPrompt = action.payload.prompt;
      state.pendingPromptTargetNoteId = action.payload.targetNoteId;
    },
    clearPendingPrompt: (state) => {
      state.pendingPrompt = null;
      state.pendingPromptTargetNoteId = null;
    },
    setStreamStatus: (state, action) => {
      state.streamStatus = action.payload;
    },
    handleStreamEvent: (state, action) => {
      const event: StreamEvent = action.payload;

      // Use the new stream event registry to process the event
      defaultStreamRegistry.process(event, state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentNote = action.payload;
        state.notes.push(state.currentNote);
      })
      .addCase(createNewNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create note";
      })
      .addCase(fetchNoteById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentNote = action.payload;
      })
      .addCase(fetchNoteById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch note";
      });
  },
});

export const {
  setCurrentNote,
  clearError,
  clearStreamError,
  setPendingPrompt,
  clearPendingPrompt,
  setStreamStatus,
  handleStreamEvent,
  clearStreaming,
} = notesSlice.actions;

export default notesSlice.reducer;
