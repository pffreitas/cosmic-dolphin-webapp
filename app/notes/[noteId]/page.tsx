import CosmicEditor from "@/components/editor/CosmicEditor";
import Note from "@/components/notes/notes";
import { fetchNote } from "@/lib/repository/notes.repo";
import { createClient } from "@/utils/supabase/server";
import _ from "lodash";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    noteId: string;
  }>;
}

export default async function Index({ params }: PageProps) {
  const supabase = await createClient();
  const { noteId } = await params;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token || "";

  const note = await fetchNote(accessToken, Number(noteId));

  if (!note || !note.id) {
    return <div>Note not found</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Note initialNote={note} noteId={note.id} accessToken={accessToken} />
    </Suspense>
  );
}
