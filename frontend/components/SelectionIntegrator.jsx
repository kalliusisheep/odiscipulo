// frontend/components/SelectionIntegrator.jsx
import React from 'react';
import useSelectionFloatingMenu from '../hooks/useSelectionFloatingMenu';
import SelectionFloatingMenu from './SelectionFloatingMenu';
import { apiFetch } from '../lib/api';

export default function SelectionIntegrator({ contentId, contentType, children }){
  const { selection, rect, showMenu, setShowMenu, clearSelection } = useSelectionFloatingMenu();

  async function onSaveNote(){
    try{
      // Generate a short title via AI later; for now create note with a temp title
      const payload = {
        title: selection.slice(0, 60) + (selection.length > 60 ? '...' : ''),
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: selection }] }] },
        source_type: 'selecao_texto',
        source_content_id: contentId,
        source_content_title: null
      };
      await apiFetch('/api/notes', { method: 'POST', body: JSON.stringify(payload) });
      alert('Nota salva');
      clearSelection();
    }catch(e){
      alert('Erro ao salvar nota: '+e.message);
    }
  }

  async function onCreateImage(){
    try{
      // call existing image generator endpoint (assumed) /api/image-gen with text
      const res = await fetch('/api/image-gen', { method: 'POST', body: JSON.stringify({ text: selection }), headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      // expecting { image_url }
      window.open(data.image_url, '_blank');
      clearSelection();
    }catch(e){
      alert('Erro ao gerar imagem: '+e.message);
    }
  }

  async function onHighlight(){
    try{
      // For simplicity, compute offsets on the client if possible; here we send highlight_text only
      await apiFetch('/api/highlights', { method: 'POST', body: JSON.stringify({ content_id: contentId, content_type: contentType, start_offset: 0, end_offset: 0, highlighted_text: selection, color: 'yellow' }) });
      alert('Trecho marcado');
      clearSelection();
    }catch(e){
      alert('Erro ao marcar: '+e.message);
    }
  }

  return (
    <div>
      {children}
      {showMenu && rect && (
        <SelectionFloatingMenu rect={rect} onSaveNote={onSaveNote} onCreateImage={onCreateImage} onHighlight={onHighlight} />
      )}
    </div>
  );
}
