import React from 'react';
import { List } from 'lucide-react';
import { cn } from '../../../app/utils/cn';

interface Heading {
    level: number;
    text: string;
    id: string;
}

interface TableOfContentsProps {
    content: string;
    className?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content, className }) => {
    const headings = React.useMemo(() => {
        const lines = content.split('\n');
        const extracted: Heading[] = [];

        for (const line of lines) {
            const match = line.match(/^(#{1,6})\s+(.+)$/);
            if (match) {
                const text = match[2].trim();
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                extracted.push({ level: match[1].length, text, id });
            }
        }
        return extracted;
    }, [content]);

    if (headings.length === 0) return null;

    return (
        <aside className={cn("flex flex-col gap-4 py-4", className)}>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">
                <List className="h-4 w-4" />
                Document Map
            </div>
            <nav className="space-y-1">
                {headings.map((h, i) => (
                    <a
                        key={i}
                        href={`#${h.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(h.id);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className={cn(
                            "block py-1.5 px-3 rounded-lg text-sm font-medium smooth-transition hover:bg-slate-50",
                            h.level === 1 ? "text-slate-900 font-bold" : "text-slate-500",
                            h.level === 2 && "pl-6",
                            h.level === 3 && "pl-9",
                            h.level >= 4 && "pl-12"
                        )}
                    >
                        {h.text}
                    </a>
                ))}
            </nav>
        </aside>
    );
};
