// frontend/components/SelectionFloatingMenu.jsx
// Renders a floating toolbar near the selection rect with actions: Save Note, Create Image, Highlight

import React from 'react';

export default function SelectionFloatingMenu({ rect, onSaveNote, onCreateImage, onHighlight }) {
  if (!rect) return null;
  const style = {
    position: 'absolute',
    top: rect.top - 40 + window.scrollY,
    left: rect.left + window.scrollX,
    background: 'white',
    border: '1px solid rgba(0,0,0,0.1)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    borderRadius: 8,
    padding: '6px 8px',
    zIndex: 9999,
    display: 'flex',
    gap: 8,
  };

  return (
    <div style={style}>
      <button onClick={onSaveNote}>Salvar em Minhas Notas</button>
      <button onClick={onCreateImage}>Criar Imagem</button>
      <button onClick={onHighlight}>Marcar</button>
    </div>
  );
}
