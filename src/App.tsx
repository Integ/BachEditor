import { useCallback, useRef } from 'react';
import Editor, { EditorHandle } from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import { useEditorStore } from './store/editorStore';
import { audioEngine } from './lib/audioEngine';

const aiTemplates: Record<string, string> = {
  system: '\n\n### System\n请在回答前先确认需求边界，再输出可执行步骤。\n',
  user: '\n\n### User\n请帮我补全这个任务，并给出清晰的代码修改建议。\n',
  assistant: '\n\n### Assistant\n好的，我会先给结论，再给变更点和完整代码。\n',
  promptTemplate:
    '\n\n## Prompt 模板\n### Role\n你是一位资深工程师。\n\n### Goal\n- 明确要达成的结果\n\n### Constraints\n- 保持现有技术栈\n- 不引入破坏性变更\n\n### Output Format\n1. 先给结论\n2. 再给步骤\n3. 最后给代码\n',
};

export default function App() {
  const { isPreviewVisible, togglePreview, content, resetContent } = useEditorStore();
  const editorRef = useRef<EditorHandle>(null);

  const insertAtSelection = useCallback((insertText: string, cursorOffset = 0) => {
    const view = editorRef.current?.getEditorView();
    if (!view) return;

    const selection = view.state.selection.main;
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

  const handleFormat = useCallback(
    (type: string) => {
      const view = editorRef.current?.getEditorView();
      if (!view) return;

      const selection = view.state.selection.main;
      const selectedText = view.state.sliceDoc(selection.from, selection.to);

      let insertText = '';
      let cursorOffset = 0;

      switch (type) {
        case 'bold':
          insertText = `**${selectedText || '重点内容'}**`;
          cursorOffset = selectedText ? 0 : 2;
          break;
        case 'italic':
          insertText = `*${selectedText || '补充说明'}*`;
          cursorOffset = selectedText ? 0 : 1;
          break;
        case 'h1':
          insertText = `# ${selectedText || '一级标题'}`;
          break;
        case 'h2':
          insertText = `## ${selectedText || '二级标题'}`;
          break;
        case 'h3':
          insertText = `### ${selectedText || '三级标题'}`;
          break;
        case 'ul':
          insertText = `- ${selectedText || '列表项'}`;
          break;
        case 'ol':
          insertText = `1. ${selectedText || '列表项'}`;
          break;
        case 'quote':
          insertText = `> ${selectedText || '引用内容'}`;
          break;
        case 'code':
          insertText = selectedText ? `\n\`\`\`\n${selectedText}\n\`\`\`\n` : '`代码`';
          cursorOffset = selectedText ? 0 : 1;
          break;
        case 'link':
          insertText = `[${selectedText || '链接文本'}](https://example.com)`;
          cursorOffset = 20;
          break;
        case 'image':
          insertText = `![${selectedText || '图片描述'}](https://example.com/image.png)`;
          cursorOffset = 26;
          break;
        default:
          break;
      }

      if (insertText) {
        insertAtSelection(insertText, cursorOffset);
      }
    },
    [insertAtSelection],
  );

  const handleAiAction = useCallback(
    async (type: string) => {
      await audioEngine.initialize();
      if (type === 'togglePreview') {
        togglePreview();
        return;
      }

      if (type === 'copyMarkdown') {
        await navigator.clipboard.writeText(content);
        return;
      }

      if (type === 'downloadMarkdown') {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-dialogue-${new Date().toISOString().slice(0, 10)}.md`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      if (type === 'clear') {
        const ok = window.confirm('确定要重置为默认 AI 对话模板吗？');
        if (ok) {
          resetContent();
        }
        return;
      }

      if (aiTemplates[type]) {
        insertAtSelection(aiTemplates[type]);
      }
    },
    [content, insertAtSelection, resetContent, togglePreview],
  );

  return (
    <div className="editor-container">
      <Toolbar onFormat={handleFormat} onAiAction={handleAiAction} />
      <div className="editor-split">
        <section className={`editor-pane ${isPreviewVisible ? '' : 'editor-pane-full'}`}>
          <div className="pane-title">对话草稿</div>
          <Editor ref={editorRef} />
        </section>
        {isPreviewVisible && (
          <section className="preview-pane-wrap">
            <div className="pane-title">渲染预览</div>
            <Preview />
          </section>
        )}
      </div>
      <footer className="app-footer">Enter 换行，使用 Toolbar 快速插入 System / User / Assistant 区块。</footer>
    </div>
  );
}
