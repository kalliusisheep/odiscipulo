import React from 'react';

// frontend/components/SelectionFloatingMenu.jsx
// Extended floating menu with color palette for highlights and optional remove action
export default function SelectionFloatingMenu({ rect, onSaveNote, onCreateImage, onHighlight, onRemoveHighlight, showRemove, selectedColor, onColorSelect }) {
  if (!rect) return null;
  const style = {
    position: 'absolute',
    top: rect.top - 48 + window.scrollY,
    left: rect.left + window.scrollX,
    background: 'white',
    border: '1px solid rgba(0,0,0,0.08)',
    boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
    borderRadius: 10,
    padding: '8px',
    zIndex: 9999,
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  };

  const palette = [
    { key: 'yellow', color: '#FFF59D' },
    { key: 'green', color: '#A5D6A7' },
    { key: 'blue', color: '#90CAF9' },
    { key: 'pink', color: '#F8BBD0' },
    { key: 'orange', color: '#FFAB91' }
  ];

  return (
    <div style={style} role="dialog" aria-label="Selection menu">
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={onSaveNote}>Salvar em Minhas Notas</button>
        <button onClick={onCreateImage}>Criar Imagem</button>
      </div>

      <div style={{ width: 1, height: 28, background: 'rgba(0,0,0,0.06)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {!showRemove && (
          <button onClick={onHighlight} title="Marcar seleção">Marcar</button>
        )}
        {showRemove && (
          <button onClick={onRemoveHighlight} style={{ color: 'red' }}>Remover marcação</button>
        )}

        <div style={{ display: 'flex', gap: 6, marginLeft: 8 }} aria-hidden>
          {palette.map((p) => (
            <button
              key={p.key}
              onClick={() => onColorSelect && onColorSelect(p.color)}
              title={p.key}
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                border: selectedColor === p.color ? '2px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.08)',
                background: p.color,
                padding: 0,
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
