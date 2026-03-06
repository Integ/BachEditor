import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useEditorStore } from '../store/editorStore';

function extractText(children: any): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map((item) => extractText(item?.props?.children ?? item)).join('');
  }
  if (children?.props?.children) return extractText(children.props.children);
  return '';
}

function resolveRoleClass(text: string) {
  const normalized = text.trim().toLowerCase();
  if (normalized === 'system' || normalized === '系统') return 'role-system';
  if (normalized === 'user' || normalized === '用户') return 'role-user';
  if (normalized === 'assistant' || normalized === '助手') return 'role-assistant';
  return '';
}

export default function Preview() {
  const { content } = useEditorStore();
  const [copied, setCopied] = useState<string>('');

  const meta = useMemo(() => {
    const lines = content.split('\n').length;
    const blocks = content.split(/\n\n+/).filter(Boolean).length;
    return { lines, blocks };
  }, [content]);

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(''), 1000);
  };

  return (
    <div className="preview-pane">
      <div className="preview-head">
        <span>{meta.lines} 行</span>
        <span>{meta.blocks} 段</span>
      </div>

      <div className="preview-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1({ children }) {
              return <h1 className="md-h1">{children}</h1>;
            },
            h2({ children }) {
              return <h2 className="md-h2">{children}</h2>;
            },
            h3({ children }) {
              const text = extractText(children);
              const roleClass = resolveRoleClass(text);
              return <h3 className={`md-h3 ${roleClass}`}>{children}</h3>;
            },
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const codeText = String(children).replace(/\n$/, '');

              if (!inline) {
                return (
                  <div className="code-wrap">
                    <div className="code-head">
                      <span>{match?.[1] || 'plain'}</span>
                      <button type="button" onClick={() => copyCode(codeText)}>
                        {copied === codeText ? '已复制' : '复制代码'}
                      </button>
                    </div>
                    <SyntaxHighlighter style={oneLight} language={match?.[1]} PreTag="div" {...props}>
                      {codeText}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
