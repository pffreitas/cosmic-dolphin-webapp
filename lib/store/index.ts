import { configureStore } from "@reduxjs/toolkit";
import bookmarksReducer from "./slices/bookmarksSlice";

export const store = configureStore({
  reducer: {
    bookmarks: bookmarksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
