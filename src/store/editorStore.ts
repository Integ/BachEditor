import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultContent = `# AI 对话工作区

> 用这个页面组织 System / User / Assistant 的上下文，让 AI 更稳定输出。

### System
你是资深前端工程师，请优先给出可执行方案。

### User
我想优化 markdown 编辑器，让它更适合和 AI 协作。

### Assistant
当然。先明确目标，再分功能与样式两部分改造。`;

interface EditorStore {
  content: string;
  setContent: (content: string) => void;
  resetContent: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isPreviewVisible: boolean;
  togglePreview: () => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      content: defaultContent,
      setContent: (content) => set({ content }),
      resetContent: () => set({ content: defaultContent }),
      isSoundEnabled: true,
      toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
      volume: 0.3,
      setVolume: (volume) => set({ volume }),
      isPreviewVisible: true,
      togglePreview: () => set((state) => ({ isPreviewVisible: !state.isPreviewVisible })),
    }),
    {
      name: 'bach-editor-state-v3',
      partialize: (state) => ({
        content: state.content,
        isSoundEnabled: state.isSoundEnabled,
        volume: state.volume,
        isPreviewVisible: state.isPreviewVisible,
      }),
    },
  ),
);
