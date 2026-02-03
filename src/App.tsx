import { useCallback, useRef } from 'react';
import Editor, { EditorHandle } from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import { useEditorStore } from './store/editorStore';
import { audioEngine } from './lib/audioEngine';

export default function App() {
  const { isPreviewVisible, togglePreview } = useEditorStore();
  const editorRef = useRef<EditorHandle>(null);

  const handleFormat = useCallback((type: string) => {
    if (!editorRef.current) return;

    const view = editorRef.current.getEditorView();
    if (!view) return;

    const selection = view.state.selection.main;
    const selectedText = view.state.sliceDoc(selection.from, selection.to);

    let insertText = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        insertText = `**${selectedText || '加粗文字'}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'italic':
        insertText = `*${selectedText || '斜体文字'}*`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'h1':
        insertText = `# ${selectedText || '一级标题'}`;
        cursorOffset = 0;
        break;
      case 'h2':
        insertText = `## ${selectedText || '二级标题'}`;
        cursorOffset = 0;
        break;
      case 'h3':
        insertText = `### ${selectedText || '三级标题'}`;
        cursorOffset = 0;
        break;
      case 'ul':
        insertText = `- ${selectedText || '列表项'}`;
        cursorOffset = 0;
        break;
      case 'ol':
        insertText = `1. ${selectedText || '列表项'}`;
        cursorOffset = 0;
        break;
      case 'quote':
        insertText = `> ${selectedText || '引用内容'}`;
        cursorOffset = 0;
        break;
      case 'code':
        if (selectedText) {
          insertText = '```\n' + selectedText + '\n```';
          cursorOffset = 0;
        } else {
          insertText = '`代码`';
          cursorOffset = 1;
        }
        break;
      case 'link':
        insertText = `[${selectedText || '链接文本'}](url)`;
        cursorOffset = 1 + (selectedText?.length || 4);
        break;
      case 'image':
        insertText = `![${selectedText || '图片描述'}](url)`;
        cursorOffset = 2 + (selectedText?.length || 4);
        break;
    }

    const transaction = view.state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: insertText,
      },
      selection: {
        anchor: selection.from + insertText.length - cursorOffset,
        head: selection.from + insertText.length - cursorOffset,
      },
    });

    view.dispatch(transaction);
    view.focus();
  }, []);

  return (
    <div className="editor-container">
      <Toolbar onFormat={handleFormat} />
      <div className="editor-split">
        <div className="editor-pane">
          <Editor ref={editorRef} />
        </div>
        {isPreviewVisible && <Preview />}
      </div>
      <button
        onClick={async () => {
          await audioEngine.initialize();
          togglePreview();
        }}
        className="fixed bottom-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors z-50"
      >
        {isPreviewVisible ? '隐藏预览' : '显示预览'}
      </button>
    </div>
  );
}
