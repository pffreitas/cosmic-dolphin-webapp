import { Bookmark } from "@cosmic-dolphin/api";

export interface BookmarkMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  type?: string;
  url?: string;
  [key: string]: any;
}

export interface CreateBookmarkRequest {
  source_url: string;
  title?: string;
  metadata?: BookmarkMetadata;
  body?: string;
  summary?: string;
}

export interface BookmarkListResponse {
  bookmarks: Bookmark[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

export interface BookmarkListParams {
  limit?: number;
  offset?: number;
}
