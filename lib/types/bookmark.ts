export interface BookmarkMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  type?: string;
  url?: string;
  [key: string]: any;
}

export interface Bookmark {
  id: string;
  user_id: string;
  source_url: string;
  title: string | null;
  metadata: BookmarkMetadata | null;
  body: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
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
