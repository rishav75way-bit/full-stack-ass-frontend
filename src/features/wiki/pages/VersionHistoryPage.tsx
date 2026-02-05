import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCompare, History, Clock, User, ChevronDown, Sparkles } from 'lucide-react';
import { AppLayout } from '../../../app/layouts/AppLayout';
import { Button } from '../../../app/components/Button';
import { Card } from '../../../app/components/Card';
import { getVersions, compareVersions } from '../../../app/api/version.api';
import type { Version } from '../../../app/api/version.api';
import { diff_match_patch } from 'diff-match-patch';

export const VersionHistoryPage = () => {
  const { workspaceId, pageId } = useParams<{ workspaceId: string; pageId: string }>();
  const navigate = useNavigate();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareFrom, setCompareFrom] = useState<number | null>(null);
  const [compareTo, setCompareTo] = useState<number | null>(null);
  const [diffContent, setDiffContent] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    if (workspaceId && pageId) {
      (async () => {
        try {
          setLoading(true);
          const data = await getVersions(workspaceId, pageId);
          setVersions(data);
        } catch (err) {
          console.error('Failed to load versions:', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [workspaceId, pageId]);

  const handleCompare = async () => {
    if (!workspaceId || !pageId || compareFrom == null || compareTo == null) return;
    setIsComparing(true);
    const [from, to] = compareFrom <= compareTo ? [compareFrom, compareTo] : [compareTo, compareFrom];
    try {
      const result = await compareVersions(workspaceId, pageId, from, to);
      const dmp = new diff_match_patch();
      const fromContent = 'content' in result.from ? result.from.content : (result.from as Version).contentSnapshot;
      const toContent = 'content' in result.to ? result.to.content : (result.to as Version).contentSnapshot;
      const diff = dmp.diff_main((fromContent as string) ?? '', (toContent as string) ?? '');
      dmp.diff_cleanupSemantic(diff);
      setDiffContent(dmp.diff_prettyHtml(diff));
    } catch (err) {
      console.error('Compare failed:', err);
      setDiffContent('<div class="p-8 bg-red-50 text-red-600 font-bold rounded-2xl flex items-center gap-3">Failure to generate comparison analysis.</div>');
    } finally {
      setIsComparing(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="h-full flex flex-col items-center justify-center p-20 animate-pulse">
          <div className="w-16 h-16 bg-slate-200 rounded-full mb-4 shadow-sm"></div>
          <div className="h-4 w-48 bg-slate-200 rounded-full mb-2"></div>
          <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-8 py-12 animate-fade-in relative min-h-full">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(`/w/${workspaceId}/pages/${pageId}`)}
              className="p-2 hover:bg-white text-slate-400 hover:text-slate-900 rounded-xl smooth-transition shadow-sm ring-1 ring-slate-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-xs">
              <History className="w-4 h-4" />
              Archive Control
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
            Version <span className="text-primary-600">Timeline</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl text-lg mt-4">
            Review the evolution of this document, compare changes between any two points in time, and audit transformations.
          </p>
        </header>

        {versions.length === 0 ? (
          <div className="py-24 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 animate-fade-in">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <History className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Genesis Page</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">This document is in its first iteration. Create changes to initialize the version history.</p>
          </div>
        ) : (
          <div className="space-y-12 pb-20">
            {}
            <Card className="p-8 lg:p-10 border border-slate-200 bg-white rounded-xl group">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-800 group-hover:text-white smooth-transition">
                  <GitCompare className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Differential Analysis</h2>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-5 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="flex-1 w-full relative">
                  <select
                    className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary-500 smooth-transition appearance-none shadow-sm"
                    value={compareFrom ?? ''}
                    onChange={(e) => setCompareFrom(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">Baseline Version</option>
                    {versions.map((v) => (
                      <option key={v._id} value={v.versionNumber}>
                        v{v.versionNumber} — {new Date(v.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compare To</span>

                <div className="flex-1 w-full relative">
                  <select
                    className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary-500 smooth-transition appearance-none shadow-sm"
                    value={compareTo ?? ''}
                    onChange={(e) => setCompareTo(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">Target Version</option>
                    {versions.map((v) => (
                      <option key={v._id} value={v.versionNumber}>
                        v{v.versionNumber} — {new Date(v.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                <Button
                  onClick={handleCompare}
                  disabled={compareFrom == null || compareTo == null || isComparing}
                  loading={isComparing}
                  className="w-full md:w-auto px-8"
                >
                  Analyze Diff
                </Button>
              </div>

              {diffContent && (
                <div className="mt-10 space-y-4 animate-scale-in">
                  <div className="flex items-center gap-2 text-[10px] font-black text-primary-400 uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    Comparison Result
                  </div>
                  <div
                    className="prose prose-slate prose-sm lg:prose-base max-w-none rounded-xl bg-slate-50 p-8 lg:p-12 overflow-x-auto border border-slate-200 font-medium leading-relaxed
                               [&_ins]:bg-emerald-100 [&_ins]:text-emerald-800 [&_ins]:no-underline [&_ins]:px-1 [&_ins]:rounded
                               [&_del]:bg-red-100 [&_del]:text-red-800 [&_del]:no-underline [&_del]:px-1 [&_del]:rounded
                               text-slate-600"
                    dangerouslySetInnerHTML={{ __html: diffContent }}
                  />
                </div>
              )}
            </Card>

            {}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                  Audit Trail Archive
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {versions.map((v) => (
                  <Card key={v._id} className="p-0 border border-slate-200 bg-white hover:border-primary-200 overflow-hidden group smooth-transition">
                    <div className="flex flex-col sm:flex-row items-center">
                      <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center gap-6">
                        {}
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 smooth-transition translate-y-0 group-hover:-translate-y-1">
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-primary-400 uppercase leading-none">V-ID</span>
                          <span className="text-xl font-black text-slate-900 group-hover:text-primary-600">{v.versionNumber}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-extrabold text-slate-900 mb-1 group-hover:text-primary-600 smooth-transition truncate">
                            {v.titleSnapshot}
                          </h3>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(v.createdAt).toLocaleString()}
                            </div>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-slate-600 smooth-transition">
                              <User className="w-3.5 h-3.5" />
                              {typeof v.createdBy === 'object' && v.createdBy
                                ? `${v.createdBy.firstName} ${v.createdBy.lastName}`
                                : 'System'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-4 sm:py-0 sm:h-20 flex sm:items-center justify-end sm:justify-center bg-slate-50/50 sm:bg-transparent border-t sm:border-t-0 sm:border-l border-slate-100 w-full sm:w-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-400 group-hover:text-primary-600"
                          onClick={() => {
                            setCompareTo(v.versionNumber);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          Select Version
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout >
  );
};
