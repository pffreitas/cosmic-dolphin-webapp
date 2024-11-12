import { fetchNotes } from "@/lib/repository/repo"
import { Note } from "@cosmic-dolphin/api";


export default async function Index() {

    const notes = await fetchNotes();
    console.log({ notes });

    return (
        <div>
            <h1>Dashboard {notes && notes.length}</h1>
            <div>
                {notes.map((note: Note) => (
                    <div key={note.id}>
                        <h2>{note.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}