import { useMemo } from 'react';
import { useEditorStore } from '../store/editorStore';
import { audioEngine } from '../lib/audioEngine';

interface ToolbarProps {
  onFormat: (type: string) => void;
  onAiAction: (type: string) => void;
}

export default function Toolbar({ onFormat, onAiAction }: ToolbarProps) {
  const { isSoundEnabled, toggleSound, volume, setVolume, isPreviewVisible, content } = useEditorStore();

  const formatButtons = [
    { type: 'bold', label: '粗体' },
    { type: 'italic', label: '斜体' },
    { type: 'h2', label: 'H2' },
    { type: 'ul', label: '列表' },
    { type: 'quote', label: '引用' },
    { type: 'code', label: '代码' },
    { type: 'link', label: '链接' },
  ];

  const aiButtons = [
    { type: 'system', label: 'System' },
    { type: 'user', label: 'User' },
    { type: 'assistant', label: 'Assistant' },
    { type: 'promptTemplate', label: '提示词模板' },
    { type: 'copyMarkdown', label: '复制 Markdown' },
    { type: 'downloadMarkdown', label: '下载 .md' },
    { type: 'clear', label: '清空重置' },
  ];

  const stats = useMemo(() => {
    const chars = content.length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const estimatedTokens = Math.ceil(chars / 4);
    return { chars, words, estimatedTokens };
  }, [content]);

  const handleFormat = async (type: string) => {
    await audioEngine.initialize();
    if (isSoundEnabled) {
      audioEngine.playMarimba();
    }
    onFormat(type);
  };

  return (
    <header className="app-toolbar">
      <div className="toolbar-main">
        <div className="brand-block">
          <h1>AI Markdown Studio</h1>
          <p>面向提示词编排与 AI 对话记录</p>
        </div>

        <div className="stats-block">
          <span>{stats.words} 词</span>
          <span>{stats.chars} 字符</span>
          <span>~{stats.estimatedTokens} tokens</span>
        </div>
      </div>

      <div className="toolbar-row">
        <div className="button-group" aria-label="markdown-format">
          {formatButtons.map((button) => (
            <button
              key={button.type}
              className="toolbar-button"
              onClick={() => handleFormat(button.type)}
              type="button"
            >
              {button.label}
            </button>
          ))}
        </div>

        <div className="button-group" aria-label="ai-actions">
          {aiButtons.map((button) => (
            <button
              key={button.type}
              className="toolbar-button toolbar-button-ai"
              onClick={() => onAiAction(button.type)}
              type="button"
            >
              {button.label}
            </button>
          ))}

          <button
            className="toolbar-button"
            type="button"
            onClick={() => onAiAction('togglePreview')}
          >
            {isPreviewVisible ? '隐藏预览' : '显示预览'}
          </button>
        </div>

        <div className="audio-controls">
          <label htmlFor="volume">音量</label>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setVolume(newVolume);
              audioEngine.setVolume(newVolume);
            }}
          />
          <button
            className={`toolbar-button ${isSoundEnabled ? 'sound-on' : 'sound-off'}`}
            onClick={async () => {
              await audioEngine.initialize();
              toggleSound();
            }}
            type="button"
          >
            {isSoundEnabled ? '声音开' : '声音关'}
          </button>
        </div>
      </div>
    </header>
  );
}
