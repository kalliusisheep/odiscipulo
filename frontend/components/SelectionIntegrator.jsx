import React from 'react';
import useSelectionFloatingMenu from '../hooks/useSelectionFloatingMenu';
import SelectionFloatingMenu from './SelectionFloatingMenu';
import { apiFetch } from '../lib/api';
// Reuse the existing client-side image generator from the main app
import { generateShareImage } from '../../src/lib/share-image';
import getCharacterOffsetsWithin from '../hooks/getCharacterOffsetsWithin';

export default function SelectionIntegrator({ contentId, contentType, children }){
  const { selection, rect, showMenu, setShowMenu, clearSelection } = useSelectionFloatingMenu();

  async function onSaveNote(){
    try{
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
      const title = '';
      const backgroundSrc = '/share-bg-cross.jpg';
      const blob = await generateShareImage({ title, bodyText: selection, backgroundSrc });
      const fileName = 'selection.jpg';
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      const nav = navigator;
      if (nav.share && nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: selection.slice(0,60) });
          clearSelection();
          return;
        } catch (shareError) {
          console.error('navigator.share failed, falling back to download', shareError);
        }
      }

      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      clearSelection();
    }catch(e){
      alert('Erro ao gerar imagem: '+(e.message || e));
    }
  }

  async function onHighlight(){
    try{
      // get DOM selection and range
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        alert('Seleção vazia');
        return;
      }
      const range = sel.getRangeAt(0);

      // find the container that holds the content text.
      // Ensure content container has attribute: data-content-id="{contentId}"
      const container = document.querySelector(`[data-content-id="${contentId}"]`);
      let start_offset = 0;
      let end_offset = 0;
      if (container) {
        const off = getCharacterOffsetsWithin(container, range);
        if (off) {
          start_offset = off.start;
          end_offset = off.end;
        } else {
          // fallback: send zero offsets but include highlighted_text (server will try to realign)
          start_offset = 0;
          end_offset = 0;
        }
      } else {
        // no container found => send highlighted_text only
        start_offset = 0;
        end_offset = 0;
      }

      const payload = {
        content_id: contentId,
        content_type: contentType,
        start_offset,
        end_offset,
        highlighted_text: sel.toString(),
        color: 'yellow'
      };

      await apiFetch('/api/highlights', { method: 'POST', body: JSON.stringify(payload) });
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
