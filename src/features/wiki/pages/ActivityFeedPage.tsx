import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity as ActivityIcon, Layers, FileEdit, CheckCircle, PlusCircle, MessageCircle, Clock, Trash2 } from 'lucide-react';
import { AppLayout } from '../../../app/layouts/AppLayout';
import { getActivities } from '../../../app/api/activity.api';
import type { Activity as ActivityType } from '../../../app/api/activity.api';
import { Card } from '../../../app/components/Card';

const getActivityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'create':
    case 'page_created':
    case 'folder_created':
      return <PlusCircle className="w-5 h-5 text-emerald-500" />;
    case 'update':
    case 'page_updated':
    case 'folder_updated':
      return <FileEdit className="w-5 h-5 text-blue-500" />;
    case 'publish':
    case 'page_published':
      return <CheckCircle className="w-5 h-5 text-indigo-500" />;
    case 'comment':
    case 'comment_added':
      return <MessageCircle className="w-5 h-5 text-amber-500" />;
    case 'delete':
    case 'page_deleted':
    case 'folder_deleted':
      return <Trash2 className="w-5 h-5 text-red-500" />;
    default: return <Layers className="w-5 h-5 text-slate-500" />;
  }
};

export const ActivityFeedPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workspaceId) {
      (async () => {
        try {
          setLoading(true);
          const data = await getActivities(workspaceId, 50);
          setActivities(data);
        } catch (err) {
          console.error('Failed to load activity:', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [workspaceId]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-8 py-12 relative min-h-full">
        { }

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(`/w/${workspaceId}`)}
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl smooth-transition border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-xs">
              <ActivityIcon className="w-4 h-4" />
              Pulse Monitoring
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
            Real-time <span className="text-primary-600">Activity Feed</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl text-lg mt-4">
            Keep track of all transformations, discussions, and updates happening within your workspace.
          </p>
        </header>

        <section className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-white border border-slate-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="py-24 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <ActivityIcon className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Calm Workspace</h3>
              <p className="text-slate-500 font-medium max-w-xs mx-auto">There's no activity to report yet. Start documenting to see the pulse of your team.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-8 top-8 bottom-0 w-px bg-slate-200/60 hidden sm:block"></div>

              <div className="space-y-6">
                {activities.map((a, idx) => (
                  <div key={a._id} className="relative pl-0 sm:pl-16 group animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="absolute left-[26px] top-6 w-3 h-3 rounded-full bg-white border-2 border-primary-400 z-10 hidden sm:block shadow-[0_0_0_4px_white]"></div>

                    <Card className="hover:border-primary-200 smooth-transition overflow-visible">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 smooth-transition border border-slate-100">
                          {getActivityIcon(a.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-slate-900 tracking-tight">
                                {typeof a.actorId === 'object' && a.actorId
                                  ? `${a.actorId.firstName} ${a.actorId.lastName}`
                                  : 'System Event'}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                {a.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(a.createdAt).toLocaleString()}
                            </div>
                          </div>

                          <p className="text-slate-600 text-sm font-medium leading-relaxed">
                            {a.metadata && (a.metadata as any).pageTitle ? (
                              <>Performed action on <span className="text-primary-600 font-bold px-1.5 py-0.5 rounded-md bg-primary-50">"{(a.metadata as any).pageTitle}"</span></>
                            ) : a.metadata && (a.metadata as any).folderName ? (
                              <>Performed action on folder <span className="text-primary-600 font-bold px-1.5 py-0.5 rounded-md bg-primary-50">"{(a.metadata as any).folderName}"</span></>
                            ) : (
                              <>Initiated a workspace transformation.</>
                            )}
                          </p>

                          {a.metadata && Object.keys(a.metadata).length > 1 && (
                            <div className="mt-4 p-3 bg-slate-900 rounded-xl overflow-x-auto">
                              <pre className="text-[10px] text-emerald-400 font-mono">
                                {JSON.stringify(a.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};
