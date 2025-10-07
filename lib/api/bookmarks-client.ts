import {
  Configuration,
  BookmarksApi,
  Bookmark,
  CreateBookmarkRequest,
  CreateBookmarkResponse,
} from "@cosmic-dolphin/api";
import { createClient } from "@/utils/supabase/client";

export namespace BookmarksClientAPI {
  async function getApiInstance(): Promise<BookmarksApi> {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token || "";

    return new BookmarksApi(
      new Configuration({
        basePath: process.env.NEXT_PUBLIC_API_URL,
        accessToken,
      })
    );
  }

  export async function list(): Promise<Bookmark[]> {
    const bookmarksApi = await getApiInstance();

    try {
      const response = await bookmarksApi.bookmarksList();
      return response.bookmarks || [];
    } catch (error) {
      console.error("Error fetching bookmarks", error);
      return [];
    }
  }

  export async function create(
    bookmarkData: CreateBookmarkRequest
  ): Promise<string> {
    const bookmarksApi = await getApiInstance();

    try {
      const response = await bookmarksApi.bookmarksCreate({
        createBookmarkRequest: bookmarkData,
      });
      return response.bookmark.id;
    } catch (error: any) {
      if (error?.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  export async function findById(id: string): Promise<Bookmark | null> {
    const bookmarksApi = await getApiInstance();

    try {
      const response = await bookmarksApi.bookmarksFindById({ id });
      return response;
    } catch (error) {
      console.error("Error fetching bookmark by id", error);
      return null;
    }
  }
}
