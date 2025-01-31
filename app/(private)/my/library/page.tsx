import { fetchNotes } from "@/lib/repository/repo"
import { Note } from "@cosmic-dolphin/api";
import Link from "next/link";

const NoteCard = ({ note }: { note: Note }) => {
    return (
        <Link href={`/notes/${note.id}`}>
            <div className="p-4">
                <div className="grow default font-sans text-base font-medium text-textMain dark:text-textMainDark selection:bg-super/50 selection:text-textMain dark:selection:bg-superDuper/10 dark:selection:text-superDark">
                    <div className="line-clamp-1 break-all transition duration-300 md:group-hover:text-super md:dark:group-hover:text-superDark">{note.title}</div>
                </div>
                <div className="break-word mt-two line-clamp-2 text-balance light font-sans text-sm text-textOff dark:text-textOffDark selection:bg-super/50 selection:text-textMain dark:selection:bg-superDuper/10 dark:selection:text-superDark">{note.summary}</div>
            </div>
        </Link>
    )
}

export default async function Index() {
    const notes = await fetchNotes();

    return (
        <div>
            <div className="flex gap-2 flex-col">
                {notes?.map((note: Note) => (
                    <>
                        <NoteCard key={note.id} note={note} />
                        <div className="border-b border-gray-300"></div>
                    </>
                ))}
            </div>
        </div>
    )
}