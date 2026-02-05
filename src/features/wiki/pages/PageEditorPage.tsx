import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layout, Sparkles, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { setCurrentPage } from '../../../app/store/slices/pageSlice';
import { getPageById, updatePage, publishPage, unpublishPage } from '../../../app/api/page.api';
import { MarkdownEditor } from '../components/MarkdownEditor';
import { useSocket } from '../../../app/context/SocketContext';
import { SocketEvent } from '../../../app/context/socket.types';
import type { EditingUser } from '../../../app/context/socket.types';
import { useAuth } from '../../../app/providers/AuthContext';
import { PAGE_TEMPLATES } from '../constants/templates';
import { FilePlus } from 'lucide-react';

export const PageEditorPage = () => {
  const { workspaceId, pageId } = useParams<{ workspaceId: string; pageId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentPage } = useAppSelector((state) => state.page);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<EditingUser[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (workspaceId && pageId) {
      loadPage();
    }
  }, [workspaceId, pageId]);

  useEffect(() => {
    if (currentPage) {
      setTitle(currentPage.title);
      setContent(currentPage.contentMarkdown);
    }
  }, [currentPage]);

  
  useEffect(() => {
    if (socket && workspaceId && pageId && user) {
      
      socket.emit(SocketEvent.JOIN_WORKSPACE, workspaceId);
      socket.emit(SocketEvent.JOIN_PAGE, pageId);

      
      socket.on(SocketEvent.USER_EDITING, (editingUser: EditingUser) => {
        if (editingUser.userId !== user.id) {
          setCollaborators(prev => {
            if (prev.find(u => u.userId === editingUser.userId)) return prev;
            return [...prev, editingUser];
          });
        }
      });

      socket.on(SocketEvent.USER_STOPPED_EDITING, (data: { userId: string }) => {
        setCollaborators(prev => prev.filter(u => u.userId !== data.userId));
      });

      
      return () => {
        socket.emit(SocketEvent.LEAVE_PAGE, pageId);
        socket.off(SocketEvent.USER_EDITING);
        socket.off(SocketEvent.USER_STOPPED_EDITING);
      };
    }
  }, [socket, workspaceId, pageId, user]);

  
  useEffect(() => {
    if (socket && pageId && (title || content)) {
      socket.emit(SocketEvent.USER_EDITING, pageId);

      const timeout = setTimeout(() => {
        
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [title, content, socket, pageId]);

  const loadPage = async () => {
    if (!workspaceId || !pageId) return;
    try {
      const page = await getPageById(workspaceId, pageId);
      dispatch(setCurrentPage(page));
    } catch (error) {
      console.error('Failed to load page:', error);
      navigate(`/w/${workspaceId}`);
    }
  };

  const handleSave = async () => {
    if (!workspaceId || !pageId) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await updatePage(workspaceId, pageId, {
        title,
        contentMarkdown: content,
      });
      dispatch(setCurrentPage(updated));
    } catch (error) {
      console.error('Failed to save page:', error);
      setError('Encountered an error while saving. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };
  const handlePublish = async () => {
    if (!workspaceId || !pageId) return;
    try {
      setPublishing(true);
      setError(null);
      const published = await publishPage(workspaceId, pageId);
      dispatch(setCurrentPage(published));
    } catch (error) {
      console.error('Failed to publish page:', error);
      setError('Failed to publish the document. Try saving as draft first.');
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!workspaceId || !pageId) return;
    try {
      setPublishing(true);
      setError(null);
      const unpublished = await unpublishPage(workspaceId, pageId);
      dispatch(setCurrentPage(unpublished));
    } catch (error) {
      console.error('Failed to unpublish page:', error);
      setError('Failed to revert to draft. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  if (!currentPage) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center animate-pulse shadow-sm">
          <Layout className="w-8 h-8 text-primary-300" />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Initializing Editor Shell...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {}
      <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(`/w/${workspaceId}`)}
            className="flex items-center gap-2 group text-slate-400 hover:text-slate-900 smooth-transition"
          >
            <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 smooth-transition">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
          </button>

          <div className="h-4 w-px bg-slate-200"></div>

          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary-100 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Workspace</span>
              <span className="text-sm font-bold text-slate-800 leading-none">Creative Suite Editor</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-100 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-bold text-red-600">{error}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          {}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest smooth-transition"
            >
              <FilePlus className="w-3.5 h-3.5" />
              Templates
            </button>
            {showTemplates && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTemplates(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Starting Points</p>
                  </div>
                  <div className="p-2">
                    {PAGE_TEMPLATES.map(t => (
                      <button
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setContent(t.content);
                          setTitle(t.name);
                          setShowTemplates(false);
                        }}
                        className="w-full text-left p-3 hover:bg-primary-50 rounded-xl smooth-transition group/item"
                      >
                        <p className="text-xs font-bold text-slate-800 group-hover/item:text-primary-700">{t.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{t.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          {}
          <div className="flex items-center -space-x-2">
            {collaborators.map(u => (
              <div
                key={u.userId}
                className="w-8 h-8 rounded-full bg-primary-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                title={`${u.firstName} ${u.lastName} is editing`}
              >
                {u.firstName.charAt(0)}{u.lastName.charAt(0)}
              </div>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Synchronized
          </div>
        </div>
      </div>

      {}
      <div className="flex-1 overflow-hidden relative">
        <MarkdownEditor
          title={title}
          content={content}
          status={currentPage.status}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onSave={handleSave}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          saving={saving}
          publishing={publishing}
        />
      </div>
    </div>
  );
};
