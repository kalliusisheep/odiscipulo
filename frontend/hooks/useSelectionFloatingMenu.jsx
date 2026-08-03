// frontend/hooks/useSelectionFloatingMenu.jsx
// Hook to detect text selection and provide bounding rect for a floating menu.
// Usage: const { selection, rect, showMenu, clearSelection } = useSelectionFloatingMenu();

import { useState, useEffect } from 'react';

export default function useSelectionFloatingMenu() {
  const [selection, setSelection] = useState(null);
  const [rect, setRect] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    function onMouseUp() {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const r = range.getBoundingClientRect();
        setSelection(sel.toString());
        setRect(r);
        setShowMenu(true);
      } else {
        clearSelection();
      }
    }

    function onScrollOrResize() {
      clearSelection();
    }

    document.addEventListener('mouseup', onMouseUp);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  function clearSelection() {
    setSelection(null);
    setRect(null);
    setShowMenu(false);
    try { window.getSelection().removeAllRanges(); } catch (e) {}
  }

  return { selection, rect, showMenu, setShowMenu, clearSelection };
}
