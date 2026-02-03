import { useEditorStore } from '../store/editorStore';
import { audioEngine } from '../lib/audioEngine';

interface ToolbarProps {
  onFormat: (type: string) => void;
}

export default function Toolbar({ onFormat }: ToolbarProps) {
  const { isSoundEnabled, toggleSound, volume, setVolume } = useEditorStore();

  const formatButtons = [
    { type: 'bold', label: 'B', title: '加粗 (Ctrl+B)' },
    { type: 'italic', label: 'I', title: '斜体 (Ctrl+I)' },
    { type: 'divider' },
    { type: 'h1', label: 'H1', title: '一级标题' },
    { type: 'h2', label: 'H2', title: '二级标题' },
    { type: 'h3', label: 'H3', title: '三级标题' },
    { type: 'divider' },
    { type: 'ul', label: '•', title: '无序列表' },
    { type: 'ol', label: '1.', title: '有序列表' },
    { type: 'divider' },
    { type: 'quote', label: '>', title: '引用' },
    { type: 'code', label: '</>', title: '代码块' },
    { type: 'divider' },
    { type: 'link', label: '🔗', title: '链接' },
    { type: 'image', label: '🖼️', title: '图片' },
  ];

  const handleFormat = async (type: string) => {
    await audioEngine.initialize();
    if (isSoundEnabled) {
      audioEngine.playMarimba();
    }
    onFormat(type);
  };

  return (
    <div className="editor-toolbar">
      <div className="flex items-center flex-wrap gap-1">
        <h1 className="text-xl font-bold text-white mr-4">Bach's Editor</h1>

        {formatButtons.map((button, index) => {
          if (button.type === 'divider') {
            return <div key={`divider-${index}`} className="toolbar-divider" />;
          }
          return (
            <button
              key={button.type}
              className="toolbar-button"
              title={button.title}
              onClick={() => handleFormat(button.type)}
            >
              {button.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-white text-sm">音量:</label>
          <input
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
            className="w-20"
          />
        </div>

        <button
          className={`sound-toggle ${isSoundEnabled ? 'active' : ''}`}
          onClick={async () => {
            await audioEngine.initialize();
            toggleSound();
          }}
        >
          {isSoundEnabled ? '🔊 声音开' : '🔇 声音关'}
        </button>
      </div>
    </div>
  );
}
