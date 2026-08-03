import React, { useEffect, useState } from 'react';
import useSelectionFloatingMenu from '../hooks/useSelectionFloatingMenu';
import SelectionFloatingMenu from './SelectionFloatingMenu';
import { apiFetch } from '../lib/api';
// Reuse the existing client-side image generator from the main app
import { generateShareImage } from '../../src/lib/share-image';
import getCharacterOffsetsWithin from '../hooks/getCharacterOffsetsWithin';

export default function SelectionIntegrator({ contentId, contentType, children }){
  const { selection, rect, showMenu, setShowMenu, clearSelection } = useSelectionFloatingMenu();

  // state for highlight click (when user clicks an existing mark)
  const [currentHighlightId, setCurrentHighlightId] = useState(null);
  const [menuRect, setMenuRect] = useState(null);
  const [menuShowRemove, setMenuShowRemove] = useState(false);
  const [menuSelectionText, setMenuSelectionText] = useState('');

  useEffect(() => {
    function onHighlightClicked(e) {
      const { id, rect: r, highlighted_text } = e.detail || {};
      if (!r) return;
      // open the menu over the highlight with remove option
      setCurrentHighlightId(id || null);
      setMenuRect(r);
      setMenuShowRemove(true);
      setMenuSelectionText(highlighted_text || '');
      setShowMenu(true);
    }
    function onHighlightsRefresh() {
      // keep it simple: close menu when highlights changed
      setCurrentHighlightId(null);
      setMenuShowRemove(false);
      setMenuSelectionText('');
      clearSelection();
    }
    window.addEventListener('app:highlight:clicked', onHighlightClicked);
    window.addEventListener('app:highlights:refresh', onHighlightsRefresh);
    return () => {
      window.removeEventListener('app:highlight:clicked', onHighlightClicked);
      window.removeEventListener('app:highlights:refresh', onHighlightsRefresh);
    };
  }, [setShowMenu, clearSelection]);

  async function onSaveNote(){
    try{
      const payload = {
        title: (menuSelectionText || selection || '').slice(0, 60) + ((menuSelectionText || selection || '').length > 60 ? '...' : ''),
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: menuSelectionText || selection }] }] },
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
      const bodyText = menuSelectionText || selection || '';
      const blob = await generateShareImage({ title, bodyText, backgroundSrc });
      const fileName = 'selection.jpg';
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      const nav = navigator;
      if (nav.share && nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: bodyText.slice(0,60) });
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
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        alert('Seleção vazia');
        return;
      }
      const range = sel.getRangeAt(0);
      const container = document.querySelector(`[data-content-id="${contentId}"]`);
      let start_offset = 0;
      let end_offset = 0;
      if (container) {
        const off = getCharacterOffsetsWithin(container, range);
        if (off) {
          start_offset = off.start;
          end_offset = off.end;
        } else {
          start_offset = 0;
          end_offset = 0;
        }
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
      // notify highlights wrapper to refresh
      window.dispatchEvent(new CustomEvent('app:highlights:refresh'));
      alert('Trecho marcado');
      clearSelection();
    }catch(e){
      alert('Erro ao marcar: '+e.message);
    }
  }

  async function onRemoveHighlight(){
    try {
      if (!currentHighlightId) return;
      await apiFetch(`/api/highlights/${currentHighlightId}`, { method: 'DELETE' });
      // ask content wrapper to refresh highlights
      window.dispatchEvent(new CustomEvent('app:highlights:refresh'));
      setCurrentHighlightId(null);
      setMenuShowRemove(false);
      clearSelection();
    } catch (err) {
      alert('Erro ao remover marcação: ' + err.message);
    }
  }

  // choose which rect & showRemove to pass to menu:
  const activeRect = menuRect || rect;
  const activeShowRemove = menuShowRemove || false;

  return (
    <div>
      {children}
      { (showMenu || activeShowRemove) && activeRect && (
        <SelectionFloatingMenu
          rect={activeRect}
          onSaveNote={onSaveNote}
          onCreateImage={onCreateImage}
          onHighlight={onHighlight}
          onRemoveHighlight={onRemoveHighlight}
          showRemove={activeShowRemove}
        />
      )}
    </div>
  );
}
