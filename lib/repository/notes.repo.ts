import { Configuration, NotesApi, Note, NoteType } from "@cosmic-dolphin/api";
import { API_BASE_URL } from "./base";

export async function fetchNote(
  accessToken: string,
  noteId: number
): Promise<Note | null> {
  const notesApi = new NotesApi(
    new Configuration({ basePath: API_BASE_URL, accessToken })
  );

  try {
    const note = await notesApi.notesFindById({ id: String(noteId) });
    return note || null;
  } catch (error) {
    console.error("Error fetching note", error);
    return null;
  }
}

export async function createNote(
  accessToken: string,
  body: string,
  noteType: NoteType
): Promise<Note> {
  const notesApi = new NotesApi(
    new Configuration({ basePath: API_BASE_URL, accessToken })
  );

  const note = await notesApi.notesCreate({
    createNoteRequest: { body, type: noteType },
  });
  return note;
}
