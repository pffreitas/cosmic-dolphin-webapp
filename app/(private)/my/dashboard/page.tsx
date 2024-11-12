import { fetchNotes } from "@/lib/repository/repo"
import { Note } from "@cosmic-dolphin/api";
import Link from "next/link";


const NoteCard = ({ note }: { note: Note }) => {
    return (
        <Link href={`/notes/${note.id}`}>
            <div className="shadow-md p-4 rounded-lg h-[200px]">
                <h2>{note.title}</h2>
            </div>
        </Link>
    )
}

export default async function Index() {

    const notes = await fetchNotes();
    console.log({ notes });

    return (
        <div>
            <div className="grid grid-cols-4 gap-4 ">
                {notes.map((note: Note) => (<NoteCard key={note.id} note={note} />))}
            </div>
        </div>
    )
}