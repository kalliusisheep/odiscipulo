// frontend/pages/minhas-notas.jsx
// Page skeleton for listing notes and opening editor.

import React, { useState, useEffect } from 'react';
import NotesEditor from '../components/NotesEditor';

export default function MinhasNotasPage() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      // TODO: fetch /api/notes
      setNotes([]);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Minhas Notas</h1>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ width: 360 }}>
          <button onClick={() => setSelected({ title: '', content: '<p></p>' })}>+ Nova nota</button>
          <ul>
            {notes.map(n => (
              <li key={n.id} onClick={() => setSelected(n)}>
                <strong>{n.title}</strong>
                <div style={{ fontSize: 12 }}>{n.source_content_title}</div>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          {selected ? (
            <NotesEditor content={selected.content} onUpdate={(c) => console.log('updated', c)} />
          ) : (
            <div>Selecione uma nota</div>
          )}
        </div>
      </div>
    </div>
  );
}
