import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { BookmarkRepository } from "@/lib/repository/bookmark.repo";
import {
  CreateBookmarkRequest,
  BookmarkListResponse,
} from "@/lib/types/bookmark";

const bookmarkRepo = new BookmarkRepository();

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const { bookmarks, total } = await bookmarkRepo.getBookmarks(user.id, {
      limit,
      offset,
    });

    const response: BookmarkListResponse = {
      bookmarks,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateBookmarkRequest = await request.json();

    if (!body.source_url) {
      return NextResponse.json(
        { error: "source_url is required" },
        { status: 400 },
      );
    }

    try {
      new URL(body.source_url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    const bookmark = await bookmarkRepo.createBookmark(user.id, body);

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
