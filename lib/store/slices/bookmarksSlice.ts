import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Bookmark, CreateBookmarkRequest } from "@cosmic-dolphin/api";
import { BookmarksClientAPI } from "@/lib/api/bookmarks-client";

interface BookmarksState {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
}

const initialState: BookmarksState = {
  bookmarks: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
};

export const createBookmark = createAsyncThunk(
  "bookmarks/create",
  async (bookmarkData: CreateBookmarkRequest, { rejectWithValue }) => {
    try {
      const response = await BookmarksClientAPI.create(bookmarkData);
      return response.bookmark;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create bookmark");
    }
  },
);

export const fetchBookmarks = createAsyncThunk(
  "bookmarks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const bookmarks = await BookmarksClientAPI.list();
      return bookmarks;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch bookmarks");
    }
  },
);

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create bookmark
      .addCase(createBookmark.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(
        createBookmark.fulfilled,
        (state, action: PayloadAction<Bookmark>) => {
          state.createLoading = false;
          state.bookmarks.unshift(action.payload);
        },
      )
      .addCase(createBookmark.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      })
      // Fetch bookmarks
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBookmarks.fulfilled,
        (state, action: PayloadAction<Bookmark[]>) => {
          state.loading = false;
          state.bookmarks = action.payload;
        },
      )
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
