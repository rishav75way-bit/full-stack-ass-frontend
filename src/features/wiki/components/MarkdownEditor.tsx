import { useState } from 'react';
import { Save, Globe, Eye, Maximize2, Columns } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '../../../app/components/Button';
import { TextArea } from '../../../app/components/TextArea';
import { cn } from '../../../app/utils/cn';

interface MarkdownEditorProps {
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  saving?: boolean;
  publishing?: boolean;
}

export const MarkdownEditor = ({
  title,
  content,
  status,
  onTitleChange,
  onContentChange,
  onSave,
  onPublish,
  onUnpublish,
  saving,
  publishing,
}: MarkdownEditorProps) => {
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden relative">
      { }
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 sticky top-0 shadow-sm">
        <div className="flex-1 max-w-2xl">
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Document Title"
            className="w-full text-2xl font-black text-slate-800 bg-transparent border-0 focus:ring-0 px-0 placeholder:text-slate-300 smooth-transition"
          />
        </div>

        <div className="flex items-center gap-2">
          { }
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 mr-4">
            <button
              onClick={() => setViewMode('editor')}
              className={cn(
                "p-2 rounded-lg smooth-transition",
                viewMode === 'editor' ? "bg-white shadow-sm text-primary-600" : "text-slate-500 hover:text-slate-800"
              )}
              title="Editor View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={cn(
                "p-2 rounded-lg smooth-transition",
                viewMode === 'split' ? "bg-white shadow-sm text-primary-600" : "text-slate-500 hover:text-slate-800"
              )}
              title="Split View"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={cn(
                "p-2 rounded-lg smooth-transition",
                viewMode === 'preview' ? "bg-white shadow-sm text-primary-600" : "text-slate-500 hover:text-slate-800"
              )}
              title="Preview View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 mr-2"></div>

          <div className="flex items-center gap-3">
            <span className={cn(
              "hidden sm:inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
              status === 'PUBLISHED' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            )}>
              {status}
            </span>

            <Button
              onClick={onSave}
              loading={saving}
              variant="outline"
              className="bg-white border-2 border-slate-200 hover:border-primary-500 hover:text-primary-600"
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>

            {status === 'DRAFT' ? (
              <Button
                onClick={onPublish}
                loading={publishing}
                size="sm"
              >
                <Globe className="h-4 w-4 mr-2" />
                Publish
              </Button>
            ) : (
              <Button
                onClick={onUnpublish}
                loading={publishing}
                variant="outline"
                className="border-amber-200 text-amber-600 hover:bg-amber-50"
                size="sm"
              >
                <Globe className="h-4 w-4 mr-2 opacity-50" />
                Revert to Draft
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        { }

        { }
        {viewMode !== 'preview' && (
          <div className={cn(
            "flex-1 p-6 lg:p-10 animate-fade-in",
            viewMode === 'split' ? "border-r border-slate-100" : ""
          )}>
            <div className="h-full bg-white rounded-3xl shadow-sm border border-slate-200/60 p-4 lg:p-8 flex flex-col group hover:shadow-md smooth-transition">
              <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-300 uppercase tracking-widest px-2">
                <Columns className="w-3.5 h-3.5" />
                Markdown Editor
              </div>
              <TextArea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                placeholder="# Let's begin writing...
Try using markdown headers, lists, and code blocks."
                className="w-full h-full border-0 focus:ring-0 p-0 text-lg font-medium font-mono text-slate-700 bg-transparent"
              />
            </div>
          </div>
        )}

        { }
        {viewMode !== 'editor' && (
          <div className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar">
            <div className="max-w-4xl mx-auto py-12 px-8 lg:px-16">
              <div className="flex items-center gap-2 mb-8 text-[10px] font-black text-primary-400 uppercase tracking-widest">
                <Eye className="w-4 w-4" />
                Live Preview
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-10 tracking-tight leading-tight">
                {title || 'Untitled Document'}
              </h1>
              <div className="prose prose-slate prose-lg lg:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-600 prose-p:font-medium prose-a:text-primary-600 prose-strong:text-slate-900 prose-code:bg-slate-100 prose-code:p-1 prose-code:rounded-md prose-img:rounded-3xl">
                <ReactMarkdown>{content || '*Document is currently empty. Start writing to see the preview.*'}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
