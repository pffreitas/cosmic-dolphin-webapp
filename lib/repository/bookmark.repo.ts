import { createClient } from "@/utils/supabase/server";
import {
  Bookmark,
  CreateBookmarkRequest,
  BookmarkListParams,
} from "@/lib/types/bookmark";

export class BookmarkRepository {
  async createBookmark(
    userId: string,
    data: CreateBookmarkRequest,
  ): Promise<Bookmark> {
    const supabase = await createClient();

    const { data: bookmark, error } = await supabase
      .from("bookmarks")
      .insert({
        user_id: userId,
        source_url: data.source_url,
        title: data.title || null,
        metadata: data.metadata || null,
        body: data.body || null,
        summary: data.summary || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create bookmark: ${error.message}`);
    }

    return bookmark;
  }

  async getBookmarks(
    userId: string,
    params: BookmarkListParams = {},
  ): Promise<{ bookmarks: Bookmark[]; total: number }> {
    const supabase = await createClient();
    const { limit = 20, offset = 0 } = params;

    const { count } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const { data: bookmarks, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch bookmarks: ${error.message}`);
    }

    return {
      bookmarks: bookmarks || [],
      total: count || 0,
    };
  }

  async getBookmarkById(userId: string, id: string): Promise<Bookmark | null> {
    const supabase = await createClient();

    const { data: bookmark, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch bookmark: ${error.message}`);
    }

    return bookmark;
  }

  async updateBookmark(
    userId: string,
    id: string,
    data: Partial<CreateBookmarkRequest>,
  ): Promise<Bookmark> {
    const supabase = await createClient();

    const { data: bookmark, error } = await supabase
      .from("bookmarks")
      .update({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.metadata !== undefined && { metadata: data.metadata }),
        ...(data.body !== undefined && { body: data.body }),
        ...(data.summary !== undefined && { summary: data.summary }),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update bookmark: ${error.message}`);
    }

    return bookmark;
  }

  async deleteBookmark(userId: string, id: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete bookmark: ${error.message}`);
    }
  }
}
