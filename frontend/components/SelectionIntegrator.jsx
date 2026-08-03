import React from 'react';
import useSelectionFloatingMenu from '../hooks/useSelectionFloatingMenu';
import SelectionFloatingMenu from './SelectionFloatingMenu';
import { apiFetch } from '../lib/api';
// Reuse the existing client-side image generator from the main app
import { generateShareImage } from '../../src/lib/share-image';

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
      // Use the same image generator used elsewhere in the app (client-side Canvas)
      const title = '';
      const backgroundSrc = '/share-bg-cross.jpg';
      const blob = await generateShareImage({ title, bodyText: selection, backgroundSrc });
      const fileName = 'selection.jpg';
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      const nav = navigator as any;
      if (nav.share && nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: selection.slice(0,60) });
          clearSelection();
          return;
        } catch (shareError) {
          // fallthrough to download
          console.error('navigator.share failed, falling back to download', shareError);
        }
      }

      const url = URL.createObjectURL(blob);
      // Open preview in a new tab (user can download from there)
      window.open(url, '_blank');
      clearSelection();
    }catch(e){
      alert('Erro ao gerar imagem: '+(e.message || e));
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
