import { Configuration, NotesApi, Note } from "@cosmic-dolphin/api";
import { API_BASE_URL } from "./base";

export async function fetchNote(accessToken: string, noteId: number): Promise<Note | null> {
    const notesApi = new NotesApi(new Configuration({ basePath: API_BASE_URL, accessToken }));

    try {
        const note = await notesApi.notesFindById({ id: String(noteId) });
        return note;
    } catch (error) {
        console.error('Error fetching pipelines', error);

    }
    return null;
}