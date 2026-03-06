import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { keymap, placeholder } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { search } from '@codemirror/search';
import { autocompletion } from '@codemirror/autocomplete';
import { useEditorStore } from '../store/editorStore';
import { audioEngine } from '../lib/audioEngine';

export interface EditorHandle {
  getEditorView: () => EditorView | null;
}

interface EditorProps {
  className?: string;
}

export default forwardRef<EditorHandle, EditorProps>(function Editor({ className }: EditorProps, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { content, setContent, isSoundEnabled } = useEditorStore();
  const [audioInitialized, setAudioInitialized] = useState(false);
  const isComposingRef = useRef(false);

  const isSoundEnabledRef = useRef(isSoundEnabled);

  useEffect(() => {
    isSoundEnabledRef.current = isSoundEnabled;
  }, [isSoundEnabled]);

  const playKeySound = () => {
    if (!audioInitialized) {
      audioEngine.initialize();
      setAudioInitialized(true);
    }

    if (!isSoundEnabledRef.current) return;

    audioEngine.playMarimba();
  };

  const handleKeystroke = (event: KeyboardEvent) => {
    if (!audioInitialized) {
      audioEngine.initialize();
      setAudioInitialized(true);
    }

    if (!isSoundEnabledRef.current) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === ' ') {
      audioEngine.playSpaceTone();
    } else {
      playKeySound();
    }
  };

  const handleInput = (event: InputEvent) => {
    if (isComposingRef.current) return;

    if (!audioInitialized) {
      audioEngine.initialize();
      setAudioInitialized(true);
    }

    if (!isSoundEnabledRef.current) return;
    if (event.inputType === 'deleteContentBackward' || event.inputType === 'deleteContentForward') return;

    playKeySound();
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
    if (!audioInitialized) {
      audioEngine.initialize();
      setAudioInitialized(true);
    }

    if (!isSoundEnabledRef.current) return;

    playKeySound();
  };

  useImperativeHandle(ref, () => ({
    getEditorView: () => viewRef.current,
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const view = new EditorView({
      doc: content,
      extensions: [
        basicSetup,
        markdown(),
        keymap.of(defaultKeymap),
        search(),
        autocompletion(),
        EditorView.lineWrapping,
        placeholder('从这里开始写你的 AI 对话上下文、需求和约束...'),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '15px',
            backgroundColor: 'transparent',
          },
          '.cm-content': {
            fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
            padding: '1rem 1.1rem 1.5rem',
            lineHeight: '1.75',
            caretColor: '#f8fafc',
          },
          '.cm-line': {
            padding: '0',
          },
          '.cm-scroller': {
            overflow: 'auto',
            fontFamily: 'inherit',
          },
          '.cm-editor': {
            height: '100%',
            borderRadius: '14px',
          },
          '.cm-gutters': {
            backgroundColor: 'transparent',
            color: '#64748b',
            border: 'none',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(148, 163, 184, 0.12)',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'transparent',
          },
          '.cm-selectionBackground': {
            backgroundColor: 'rgba(14, 165, 233, 0.25) !important',
          },
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setContent(update.state.doc.toString());
          }
        }),
        EditorView.domEventHandlers({
          keydown: (event) => {
            handleKeystroke(event as KeyboardEvent);
          },
          input: (event) => {
            handleInput(event as InputEvent);
          },
          compositionstart: () => {
            handleCompositionStart();
          },
          compositionend: () => {
            handleCompositionEnd();
          },
        }),
      ],
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== content) {
      const transaction = viewRef.current.state.update({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: content,
        },
      });
      viewRef.current.dispatch(transaction);
    }
  }, [content]);

  return <div ref={containerRef} className={className} />;
});
