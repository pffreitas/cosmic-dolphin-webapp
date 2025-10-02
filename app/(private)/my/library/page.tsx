import { BookmarksAPI } from "@/lib/api/bookmarks";
import { Bookmark } from "@cosmic-dolphin/api";
import Link from "next/link";
import { Suspense } from "react";

const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  return (
    <div className="w-full min-w-48 sm:w-64 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200 p-3">
      <Link href={`/bookmarks/${bookmark.id}`}>
        <div className="flex flex-col gap-2">
          <div className="h-10 line-clamp-2 break-words transition duration-300 font-medium text-sm leading-tight">
            {bookmark.title}
          </div>
          {bookmark.metadata?.openGraph?.image && (
            <img
              src={bookmark.metadata.openGraph.image}
              alt={bookmark.title}
              className="w-full h-24 object-cover rounded-md border border-teal-300"
            />
          )}
          {bookmark.cosmicSummary ? (
            <div className="h-12 line-clamp-3 text-xs text-textOff leading-4">
              {bookmark.cosmicSummary}
            </div>
          ) : (
            <div className="h-12"></div>
          )}
        </div>
      </Link>
    </div>
  );
};

async function BookmarksList() {
  const bookmarks = await BookmarksAPI.list();

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {bookmarks?.map((bookmark: Bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}

const LoadingBookmarks = () => (
  <div className="flex flex-wrap gap-4 p-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="max-w-48 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse"
      >
        <div className="h-24 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function Index() {
  return (
    <Suspense fallback={<LoadingBookmarks />}>
      <BookmarksList />
    </Suspense>
  );
}
