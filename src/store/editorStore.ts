import { create } from 'zustand';

interface EditorStore {
  content: string;
  setContent: (content: string) => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isPreviewVisible: boolean;
  togglePreview: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  content: '# 欢迎使用 Bach\'s Editor\n\n这是一个有爱的编辑器。\n\n## 特性\n\n- 支持 Markdown 语法\n- 实时预览\n- **按键声音**\n- 代码高亮\n\n试试输入一些文字，听听声音吧！\n\n```javascript\nconsole.log("Hello, Bach\'s Editor!");\n```\n\n> 编辑愉快！',
  setContent: (content) => set({ content }),
  isSoundEnabled: true,
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
  volume: 0.3,
  setVolume: (volume) => set({ volume }),
  isPreviewVisible: true,
  togglePreview: () => set((state) => ({ isPreviewVisible: !state.isPreviewVisible })),
}));
