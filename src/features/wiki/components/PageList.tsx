import { FileText, Clock, User, ArrowRight, FileCheck, FileClock } from 'lucide-react';
import type { Page } from '../../../app/store/slices/pageSlice';
import { cn } from '../../../app/utils/cn';
import { Card } from '../../../app/components/Card';

interface PageListProps {
  pages: Page[];
  onSelectPage: (pageId: string) => void;
  selectedPageId?: string;
}

export const PageList = ({ pages, onSelectPage, selectedPageId }: PageListProps) => {
  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 bg-white/40 backdrop-blur-md rounded-3xl border border-dashed border-slate-200 text-center animate-fade-in group hover:border-primary-200 smooth-transition">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 smooth-transition group-hover:bg-primary-50">
          <FileText className="h-10 w-10 text-slate-300 group-hover:text-primary-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No pages found in this folder</h3>
        <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm">
          It looks like this folder is empty. Create your first page to start documenting.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 animate-fade-in">
      {pages.map((page) => (
        <Card
          key={page._id}
          hover
          onClick={() => onSelectPage(page._id)}
          className={cn(
            'smooth-transition group overflow-hidden border-2',
            selectedPageId === page._id
              ? 'border-primary-500 ring-4 ring-primary-50 bg-white'
              : 'border-transparent bg-white/60 hover:bg-white hover:border-primary-200'
          )}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            { }
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm smooth-transition group-hover:shadow-glow",
              page.status === 'PUBLISHED'
                ? "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white"
                : "bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white"
            )}>
              {page.status === 'PUBLISHED' ? <FileCheck className="w-6 h-6" /> : <FileClock className="w-6 h-6" />}
            </div>

            { }
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-extrabold text-slate-900 truncate group-hover:text-primary-600 smooth-transition">
                  {page.title}
                </h3>
                <span className={cn(
                  'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border',
                  page.status === 'PUBLISHED'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                    : 'bg-amber-50 border-amber-100 text-amber-600'
                )}>
                  {page.status}
                </span>
              </div>

              <p className="text-sm text-slate-500 font-medium line-clamp-1 opacity-80 group-hover:opacity-100 smooth-transition">
                {page.contentMarkdown.length > 0
                  ? page.contentMarkdown.replace(/[#*`]/g, '').substring(0, 120)
                  : 'Welcome to this new page. Start writing content...'}
              </p>
            </div>

            <div className="flex flex-row md:flex-col md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100/50 pt-4 md:pt-0 md:pl-6 gap-2">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg group-hover:text-slate-600 smooth-transition">
                  <User className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[80px]">
                    {page.updatedBy.firstName}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-primary-600 group-hover:translate-x-1 smooth-transition">
                Read More <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
