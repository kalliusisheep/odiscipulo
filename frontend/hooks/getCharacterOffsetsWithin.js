// frontend/hooks/getCharacterOffsetsWithin.js
// Given a container element and a Selection/Range, compute character offsets
// relative to the concatenated text content of the container. Returns { start, end }

function getCharacterOffsetsWithin(container, range) {
  if (!container || !range) return null;

  const treeWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  let node;
  while ((node = treeWalker.nextNode())) {
    // skip empty
    if (!node.nodeValue) continue;
    textNodes.push(node);
  }

  // accumulate lengths
  let charCount = 0;
  const nodeRanges = textNodes.map((n) => {
    const length = n.nodeValue.length;
    const start = charCount;
    const end = charCount + length;
    charCount = end;
    return { node: n, start, end };
  });

  const getOffsetFor = (posNode, posOffset) => {
    let acc = 0;
    for (let i = 0; i < nodeRanges.length; i++) {
      const nr = nodeRanges[i];
      if (nr.node === posNode) {
        return nr.start + posOffset;
      }
    }
    return null;
  };

  const startNode = range.startContainer;
  const startNodeOffset = range.startOffset;
  const endNode = range.endContainer;
  const endNodeOffset = range.endOffset;

  const start = getOffsetFor(startNode, startNodeOffset);
  const end = getOffsetFor(endNode, endNodeOffset);

  if (start === null || end === null) {
    // If selection includes nodes outside container, fall back to searching text
    const selectedText = range.toString();
    const fullText = nodeRanges.map((n) => n.node.nodeValue).join('');
    const idx = fullText.indexOf(selectedText);
    if (idx === -1) return null;
    return { start: idx, end: idx + selectedText.length };
  }

  return { start, end };
}

export default getCharacterOffsetsWithin;
