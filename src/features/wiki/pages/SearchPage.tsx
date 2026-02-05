import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft, Filter, Sparkles, FileSearch } from 'lucide-react';
import { AppLayout } from '../../../app/layouts/AppLayout';
import { Button } from '../../../app/components/Button';
import { PageList } from '../components/PageList';
import { searchPages } from '../../../app/api/search.api';
import type { Page } from '../../../app/store/slices/pageSlice';

export const SearchPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Page[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || !workspaceId) return;
    try {
      setSearching(true);
      const data = await searchPages(workspaceId, query.trim());
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-8 py-12 animate-fade-in min-h-full">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(`/w/${workspaceId}`)}
              className="p-2 hover:bg-white text-slate-400 hover:text-slate-900 rounded-xl smooth-transition shadow-sm ring-1 ring-slate-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-xs">
              <SearchIcon className="w-4 h-4" />
              Global Search
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Search the <span className="gradient-text">Knowledge Base</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl text-lg">
            Access everything across your workspace with lightning speed. Search by title, content, or tags.
          </p>
        </header>

        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[32px] shadow-glass border border-white/50 mb-12 animate-slide-up ring-1 ring-slate-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400 group-within:text-primary-500 smooth-transition" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search (e.g. project roadmap, api specs)..."
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-lg font-bold focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white smooth-transition shadow-inner"
              />
            </div>
            <Button
              onClick={handleSearch}
              loading={searching}
              size="lg"
              className="px-8 shadow-glow"
            >
              Search Wiki
            </Button>
            <Button variant="outline" className="rounded-2xl bg-white border-2 border-slate-100 px-6">
              <Filter className="w-5 h-5 text-slate-400" />
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest mr-2">Quick Filters:</span>
            {['Documents', 'Guides', 'Drafts', 'Shared'].map(filter => (
              <button key={filter} className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold hover:bg-primary-50 hover:text-primary-600 smooth-transition">
                {filter}
              </button>
            ))}
          </div>
        </div>

        <section className="animate-fade-in delay-200">
          {searching ? (
            <div className="space-y-4">
              <div className="h-6 w-32 bg-slate-200 rounded-lg animate-pulse mb-6"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white/50 border border-white rounded-[32px] animate-pulse"></div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2 mb-2">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                  Found {results.length} Matching Documents
                </h2>
              </div>
              <PageList
                pages={results}
                onSelectPage={(id) => navigate(`/w/${workspaceId}/pages/${id}`)}
              />
            </div>
          ) : query ? (
            <div className="text-center py-24 bg-white/40 backdrop-blur-md rounded-[40px] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FileSearch className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No results matching "{query}"</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">Try refining your search terms or browsing through the folder categories.</p>
            </div>
          ) : (
            <div className="text-center py-24 bg-white/40 backdrop-blur-md rounded-[40px] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 mx-auto group hover:scale-110 smooth-transition">
                <Sparkles className="w-10 h-10 text-primary-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to explore?</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">Enter a search query to discover pages across your team's workspace.</p>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};
