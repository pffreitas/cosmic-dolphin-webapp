import { createClient } from "@/utils/supabase/server";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchNote(noteId: string, token: string) {
  const response = await fetch(`${API_URL}/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

interface PageProps {
  params: {
    noteId: string;
  };
}

export default async function Index({ params }: PageProps) {
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
