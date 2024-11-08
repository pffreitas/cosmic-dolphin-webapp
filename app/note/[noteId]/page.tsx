import { createClient } from "@/utils/supabase/server";
import { useEffect, useState } from "react";

async function fetchNote(noteId: string, token: string) {
  const response = await fetch(`http://localhost:8080/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export default async function Index({ params }: { params: { noteId: string } }) {
  const supabase = await createClient();
  const { noteId } = await params;
  const { data: { session } } = await supabase.auth.getSession();

  const note = await fetchNote(noteId, session?.access_token || '');

  return (
    <>
      <h1>{note.title}</h1>
      {note && <p>{note.summary}</p>}
      {note.sections.map(s => (
        <div key={s.id}>
          <h2>{s.content.title}</h2>
          <p>{s.content.text}</p>
        </div>
      ))}
    </>
  );
}
