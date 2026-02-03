import { useCallback } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import { useEditorStore } from './store/editorStore';
import { audioEngine } from './lib/audioEngine';

export default function App() {
  const { content, setContent, isPreviewVisible, togglePreview } = useEditorStore();

  const handleFormat = useCallback((type: string) => {
    const start = 0;
    const end = content.length;
    const selectedText = '';

    let newText = content;

    switch (type) {
      case 'bold':
        newText = content.substring(0, start) + `**${selectedText || '加粗文字'}**` + content.substring(end);
        break;
      case 'italic':
        newText = content.substring(0, start) + `*${selectedText || '斜体文字'}*` + content.substring(end);
        break;
      case 'h1':
        newText = content.substring(0, start) + `# ${selectedText || '一级标题'}` + content.substring(end);
        break;
      case 'h2':
        newText = content.substring(0, start) + `## ${selectedText || '二级标题'}` + content.substring(end);
        break;
      case 'h3':
        newText = content.substring(0, start) + `### ${selectedText || '三级标题'}` + content.substring(end);
        break;
      case 'ul':
        newText = content.substring(0, start) + `- ${selectedText || '列表项'}` + content.substring(end);
        break;
      case 'ol':
        newText = content.substring(0, start) + `1. ${selectedText || '列表项'}` + content.substring(end);
        break;
      case 'quote':
        newText = content.substring(0, start) + `> ${selectedText || '引用内容'}` + content.substring(end);
        break;
      case 'code':
        if (selectedText) {
          newText = content.substring(0, start) + '```\n' + selectedText + '\n```' + content.substring(end);
        } else {
          newText = content.substring(0, start) + '`代码`' + content.substring(end);
        }
        break;
      case 'link':
        newText = content.substring(0, start) + `[${selectedText || '链接文本'}](url)` + content.substring(end);
        break;
      case 'image':
        newText = content.substring(0, start) + `![${selectedText || '图片描述'}](url)` + content.substring(end);
        break;
    }

    setContent(newText);
  }, [content, setContent]);

  return (
    <div className="editor-container">
      <Toolbar onFormat={handleFormat} />
      <div className="editor-split">
        <div className="editor-pane">
          <Editor />
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
