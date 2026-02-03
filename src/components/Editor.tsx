import { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { search } from '@codemirror/search';
import { autocompletion } from '@codemirror/autocomplete';
import { useEditorStore } from '../store/editorStore';
import { audioEngine } from '../lib/audioEngine';

interface EditorProps {
  className?: string;
}

export default function Editor({ className }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { content, setContent, isSoundEnabled, soundType } = useEditorStore();
  const keyIndexRef = useRef(0);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const isSoundEnabledRef = useRef(isSoundEnabled);
  const soundTypeRef = useRef(soundType);

  useEffect(() => {
    isSoundEnabledRef.current = isSoundEnabled;
  }, [isSoundEnabled]);

  useEffect(() => {
    soundTypeRef.current = soundType;
  }, [soundType]);

  const handleKeystroke = (event: KeyboardEvent) => {
    if (!audioInitialized) {
      audioEngine.initialize();
      setAudioInitialized(true);
    }

    if (!isSoundEnabledRef.current) return;
    if (event.key === 'Backspace' || event.key === 'Delete') return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const currentSoundType = soundTypeRef.current;

    if (event.key === ' ') {
      audioEngine.playSpaceTone();
    } else if (event.key.length === 1) {
      const charCode = event.key.charCodeAt(0);

      switch (currentSoundType) {
        case 'piano':
          audioEngine.playPentatonic(charCode);
          break;
        case 'marimba':
          audioEngine.playMarimba(charCode);
          break;
        case 'typing':
          audioEngine.playTypingTone(charCode);
          break;
      }

      keyIndexRef.current++;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const view = new EditorView({
      doc: content,
      extensions: [
        basicSetup,
        markdown(),
        oneDark,
        keymap.of(defaultKeymap),
        search(),
        autocompletion(),
        EditorView.theme({
          '&': {
            fontSize: '16px',
          },
          '.cm-content': {
            fontFamily: '"Fira Code", monospace',
            padding: '1rem',
          },
          '.cm-scroller': {
            overflow: 'auto',
          },
          '.cm-editor': {
            height: '100%',
          },
        }),
        EditorView.updateListener.of((update: any) => {
          if (update.docChanged) {
            setContent(view.state.doc.toString());
          }
        }),
        EditorView.domEventHandlers({
          keydown: (event: any) => {
            handleKeystroke(event);
            return false;
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
}
