import { cosmicGet } from "./base";
import { Configuration, Note, NotesApi } from "@pffreitas/cosmic-dolphin-apispec";
import { createClient } from "@/utils/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchNotes() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token || '';

    const notesApi = new NotesApi(new Configuration({ basePath: API_URL, accessToken }));
    const notes = await notesApi.notesList();
    console.log({ notes });

    // const data = await cosmicGet(`/notes`, (n) => {
    //     const nt: Note = null;
    //     console.log(">>>>>>>> notes", { n })
    //     return n;
    // });
    return notes;
}


export async function submitPrompt(text: string) {

}