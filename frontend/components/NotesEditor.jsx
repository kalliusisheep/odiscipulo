// frontend/components/NotesEditor.jsx
// Basic Tiptap setup skeleton. Install @tiptap/react and @tiptap/starter-kit in your project.

import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';

export default function NotesEditor({ content, onUpdate }) {
  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onUpdate && onUpdate(json);
    }
  });

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        {/* Add font size and highlight color controls as needed */}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
