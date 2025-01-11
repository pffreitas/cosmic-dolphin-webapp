import { Configuration, Note, NotesApi, NoteType } from "@cosmic-dolphin/api";
import { createClient } from "@/utils/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchNotes() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token || '';

    const notesApi = new NotesApi(new Configuration({ basePath: API_URL, accessToken }));

    try {
        const notes = await notesApi.notesList();
        return notes;
    } catch (error) {
        console.error('Error fetching notes', error);

    }
    return [];
}


export async function createNote(body: string, noteType: NoteType): Promise<Note> {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token || '';

    const notesApi = new NotesApi(new Configuration({ basePath: API_URL, accessToken }));

    const note = await notesApi.notesCreate({ createNoteRequest: { body, type: noteType } });
    return note;
}