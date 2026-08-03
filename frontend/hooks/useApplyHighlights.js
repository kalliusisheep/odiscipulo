import { useEffect } from 'react';

// applyHighlights(containerElement, highlights)
// highlights: [{ id, start_offset, end_offset, highlighted_text, color }]

function clearHighlights(container) {
  if (!container) return;
  const existing = container.querySelectorAll('.applied-highlight');
  existing.forEach((el) => {
    const parent = el.parentNode;
    if (!parent) return;
    // unwrap: replace el with its text content
    const textNode = document.createTextNode(el.textContent);
    parent.replaceChild(textNode, el);
    parent.normalize();
  });
}

function applyHighlightsToContainer(container, highlights) {
  if (!container) return;
  // First clear previously applied highlights
  clearHighlights(container);

  // Collect all text nodes inside the container
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    // skip script/style
    if (node.parentElement && (node.parentElement.tagName === 'SCRIPT' || node.parentElement.tagName === 'STYLE')) continue;
    textNodes.push(node);
  }

  // Build a single concatenated string with mapping to nodes
  const nodesMeta = textNodes.map((n) => ({ node: n, text: n.textContent || '' }));
  const fullText = nodesMeta.map((m) => m.text).join('');

  // For each highlight, find the corresponding range in the text nodes and wrap
  highlights.forEach((h) => {
    const start = h.start_offset;
    const end = h.end_offset;
    if (typeof start !== 'number' || typeof end !== 'number' || start >= end) return;

    // Walk nodes to find start and end positions
    let acc = 0;
    let startNodeIndex = -1;
    let endNodeIndex = -1;
    let startNodeOffset = 0;
    let endNodeOffset = 0;

    for (let i = 0; i < nodesMeta.length; i++) {
      const len = nodesMeta[i].text.length;
      if (startNodeIndex === -1 && acc + len > start) {
        startNodeIndex = i;
        startNodeOffset = start - acc;
      }
      if (endNodeIndex === -1 && acc + len >= end) {
        endNodeIndex = i;
        endNodeOffset = end - acc;
        break;
      }
      acc += len;
    }

    if (startNodeIndex === -1 || endNodeIndex === -1) {
      // fallback: try to find by searching highlighted_text in fullText
      const snippet = (h.highlighted_text || '').trim();
      if (!snippet) return;
      const idx = fullText.indexOf(snippet);
      if (idx === -1) return;
      // compute positions again
      let acc2 = 0;
      for (let i = 0; i < nodesMeta.length; i++) {
        const len = nodesMeta[i].text.length;
        if (startNodeIndex === -1 && acc2 + len > idx) {
          startNodeIndex = i;
          startNodeOffset = idx - acc2;
        }
        if (endNodeIndex === -1 && acc2 + len >= idx + snippet.length) {
          endNodeIndex = i;
          endNodeOffset = idx + snippet.length - acc2;
          break;
        }
        acc2 += len;
      }
    }

    if (startNodeIndex === -1 || endNodeIndex === -1) return;

    const startNode = nodesMeta[startNodeIndex].node;
    const endNode = nodesMeta[endNodeIndex].node;

    // If start and end are in the same node
    if (startNode === endNode) {
      const text = startNode.textContent || '';
      const before = text.slice(0, startNodeOffset);
      const mid = text.slice(startNodeOffset, endNodeOffset);
      const after = text.slice(endNodeOffset);

      const parent = startNode.parentNode;
      const frag = document.createDocumentFragment();
      if (before) frag.appendChild(document.createTextNode(before));
      const mark = document.createElement('mark');
      mark.className = 'applied-highlight';
      mark.dataset.highlightId = h.id || '';
      mark.style.backgroundColor = h.color || 'rgba(255,235,59,0.6)';
      mark.textContent = mid;
      frag.appendChild(mark);
      if (after) frag.appendChild(document.createTextNode(after));
      parent.replaceChild(frag, startNode);
    } else {
      // Split start node
      const sText = startNode.textContent || '';
      const sBefore = sText.slice(0, startNodeOffset);
      const sAfter = sText.slice(startNodeOffset);
      const sParent = startNode.parentNode;
      const sAfterNode = document.createTextNode(sAfter);
      if (sBefore) sParent.insertBefore(document.createTextNode(sBefore), startNode);
      sParent.insertBefore(sAfterNode, startNode);
      sParent.removeChild(startNode);

      // Adjust nodesMeta for indices because we mutated DOM; instead, re-run walker for the range nodes
      const range = document.createRange();
      range.setStart(sAfterNode, 0);
      range.setEnd(endNode, endNodeOffset);

      const mark = document.createElement('mark');
      mark.className = 'applied-highlight';
      mark.dataset.highlightId = h.id || '';
      mark.style.backgroundColor = h.color || 'rgba(255,235,59,0.6)';

      // Extract contents of range and put inside mark
      const extracted = range.extractContents();
      mark.appendChild(extracted);
      range.insertNode(mark);
      range.detach();
    }

    // Add click listener to mark to emit event for removal/menu
  });

  // Attach click handlers to marks
  const marks = container.querySelectorAll('.applied-highlight');
  marks.forEach((m) => {
    m.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const rect = m.getBoundingClientRect();
      const detail = {
        id: m.dataset.highlightId,
        highlighted_text: m.textContent,
        rect: { top: rect.top + window.scrollY, left: rect.left + window.scrollX, width: rect.width, height: rect.height }
      };
      const e = new CustomEvent('highlight:clicked', { detail });
      container.dispatchEvent(e);
    });
  });
}

export { applyHighlightsToContainer, clearHighlights };
