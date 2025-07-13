import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Note, NoteType } from "@cosmic-dolphin/api";
import { createNote, fetchNote } from "@/lib/repository/notes.repo";
import { streamKnowledge } from "@/lib/repository/knowledge.repo";

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  isStreaming: boolean;
  streamStatus: string;
  streamError: string | null;
  pendingPrompt: string | null;
  streamingTokens: string[];
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
  streamingTokens: [],
};

// Helper function to serialize Date objects to ISO strings
const serializeNote = (note: Note): Note => {
  return {
    ...note,
    createdAt:
      note.createdAt instanceof Date
        ? note.createdAt.toISOString()
        : note.createdAt,
  } as unknown as Note;
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

// Async thunk for streaming knowledge
export const streamNoteKnowledge = createAsyncThunk(
  "notes/streamKnowledge",
  async (
    {
      accessToken,
      noteId,
      prompt,
    }: {
      accessToken: string;
      noteId: number;
      prompt: string;
    },
    { dispatch }
  ) => {
    const streamResponse = await streamKnowledge(accessToken, noteId, prompt);

    const reader = streamResponse.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body reader available");
    }

    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const eventData = line.substring(6);
              if (eventData.trim()) {
                const data = JSON.parse(eventData);
                dispatch(handleStreamEvent(data));
              }
            } catch (parseError) {
              console.error("Error parsing SSE data:", parseError);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return { success: true };
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setCurrentNote: (state, action) => {
      state.currentNote = action.payload ? serializeNote(action.payload) : null;
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
      state.pendingPrompt = action.payload;
    },
    clearPendingPrompt: (state) => {
      state.pendingPrompt = null;
    },
    setStreamStatus: (state, action) => {
      state.streamStatus = action.payload;
    },
    handleStreamEvent: (state, action) => {
      const data = action.payload;

      switch (data.event) {
        case "note_updated":
          state.currentNote = data.note ? serializeNote(data.note) : null;
          break;
        case "pipeline_status":
          state.streamStatus = data.status;
          break;
        case "pipeline_complete":
          state.streamStatus = "Processing complete";
          break;
        case "content":
          state.streamingTokens.push(data.content);
          break;
        default:
          console.log("Unknown stream event:", data);
      }
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
        const serializedNote = serializeNote(action.payload);
        state.currentNote = serializedNote;
        console.log("Created note", action.payload);
        state.notes.push(serializedNote);
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
        state.currentNote = action.payload
          ? serializeNote(action.payload)
          : null;
      })
      .addCase(fetchNoteById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch note";
      })
      .addCase(streamNoteKnowledge.pending, (state) => {
        state.isStreaming = true;
        state.streamError = null;
        state.streamStatus = "Processing your request...";
      })
      .addCase(streamNoteKnowledge.fulfilled, (state) => {
        state.isStreaming = false;
        state.streamStatus = "";
      })
      .addCase(streamNoteKnowledge.rejected, (state, action) => {
        state.isStreaming = false;
        state.streamError =
          action.error.message || "Failed to stream knowledge";
        state.streamStatus = "";
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
