import { BookmarksAPI } from "@/lib/api/bookmarks";
import { Bookmark } from "@cosmic-dolphin/api";
import Link from "next/link";
import { Suspense } from "react";

const NoteCard = ({ bookmark }: { bookmark: Bookmark }) => {
  return (
    <Link href={`/bookmarks/${bookmark.id}`}>
      <div className="p-4">
        <div className="grow default font-sans text-base font-medium text-textMain dark:text-textMainDark selection:bg-super/50 selection:text-textMain dark:selection:bg-superDuper/10 dark:selection:text-superDark">
          <div className="line-clamp-1 break-all transition duration-300 md:group-hover:text-super md:dark:group-hover:text-superDark">
            {bookmark.title}
          </div>
        </div>
        <div className="break-word mt-two line-clamp-2 text-balance light font-sans text-sm text-textOff dark:text-textOffDark selection:bg-super/50 selection:text-textMain dark:selection:bg-superDuper/10 dark:selection:text-superDark">
          {bookmark.summary}
        </div>
      </div>
    </Link>
  );
};

async function BookmarksList() {
  const bookmarks = await BookmarksAPI.list();

  return (
    <div className="flex gap-2 flex-col">
      {bookmarks?.map((bookmark: Bookmark) => (
        <div key={bookmark.id}>
          <NoteCard bookmark={bookmark} />
          <div className="border-b border-gray-300" />
        </div>
      ))}
    </div>
  );
}

const LoadingBookmarks = () => (
  <div className="flex gap-2 flex-col">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="p-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mt-1"></div>
        </div>
        <div className="border-b border-gray-300" />
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
