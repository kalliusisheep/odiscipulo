import React, { useEffect, useRef } from 'react';
import { applyHighlightsToContainer, clearHighlights } from '../hooks/useApplyHighlights';
import { apiFetch } from '../lib/api';

export default function ContentWithHighlights({ contentId, contentType, contentHtml }){
  const ref = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try{
        const res = await apiFetch(`/api/highlights?content_id=${contentId}&content_type=${contentType}`);
        if (!mounted) return;
        const highlights = res.highlights || [];
        applyHighlightsToContainer(ref.current, highlights);
      }catch(e){
        console.error('Failed to load highlights', e);
      }
    }
    load();

    function onHighClick(e){
      const detail = e.detail; // id, highlighted_text, rect
      // Dispatch a custom event that the global selection menu can pick up
      const ev = new CustomEvent('app:highlight:clicked', { detail });
      window.dispatchEvent(ev);
    }

    const el = ref.current;
    if (el) el.addEventListener('highlight:clicked', onHighClick);

    return () => {
      mounted = false;
      if (el) el.removeEventListener('highlight:clicked', onHighClick);
      clearHighlights(ref.current);
    };
  }, [contentId, contentType]);

  return <div ref={ref} data-content-id={contentId} dangerouslySetInnerHTML={{ __html: contentHtml }} />;
}
