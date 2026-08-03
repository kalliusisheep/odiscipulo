import React from 'react';

// frontend/components/SelectionFloatingMenu.jsx — extended to support remove action
export default function SelectionFloatingMenu({ rect, onSaveNote, onCreateImage, onHighlight, onRemoveHighlight, showRemove }) {
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
      {!showRemove && <button onClick={onHighlight}>Marcar</button>}
      {showRemove && <button onClick={onRemoveHighlight} style={{ color: 'red' }}>Remover marcação</button>}
    </div>
  );
}
