import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  History,
  Trash2,
  Star,
  Printer,
  Download,
  Shield,
  Clock,
  ArrowLeft,
  Edit,
  MessageSquare
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { setCurrentPage } from '../../../app/store/slices/pageSlice';
import { getPageById, deletePage as apiDeletePage, updatePagePermissions } from '../../../app/api/page.api';
import { getComments, createComment as apiCreateComment } from '../../../app/api/comment.api';
import { addFavorite, removeFavorite, getFavorites } from '../../../app/api/favorite.api';
import { trackPageView } from '../../../app/api/recentlyViewed.api';
import { AppLayout } from '../../../app/layouts/AppLayout';
import { Button } from '../../../app/components/Button';
import { Card } from '../../../app/components/Card';
import { ConfirmationModal } from '../../../app/components/ConfirmationModal';
import { CommentList } from '../components/CommentList';
import type { Comment as WikiComment } from '../../../app/api/comment.api';
import { cn } from '../../../app/utils/cn';
import { useSocket } from '../../../app/context/SocketContext';
import { SocketEvent } from '../../../app/context/socket.types';
import type { EditingUser } from '../../../app/context/socket.types';
import { useAuth } from '../../../app/providers/AuthContext';
import { AccessControlModal } from '../components/AccessControlModal';
import { AttachmentGallery } from '../components/AttachmentGallery';


const MemberRole = {
  OWNER: 'OWNER',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER'
} as const;

export const PageViewPage = () => {
  const { workspaceId, pageId } = useParams<{ workspaceId: string; pageId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentPage } = useAppSelector((state) => state.page);
  const { currentRole } = useAppSelector((state) => state.workspace);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<WikiComment[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [collaborators, setCollaborators] = useState<EditingUser[]>([]);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { socket } = useSocket();
  const { user } = useAuth();

  const loadPage = useCallback(async () => {
    if (!workspaceId || !pageId) return;
    try {
      setLoading(true);
      const page = await getPageById(workspaceId, pageId);
      dispatch(setCurrentPage(page));
    } catch (error) {
      console.error('Failed to load page:', error);
      navigate(`/w/${workspaceId}`);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, pageId, dispatch, navigate]);

  const loadComments = useCallback(async () => {
    if (!workspaceId || !pageId) return;
    try {
      const data = await getComments(workspaceId, pageId);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  }, [workspaceId, pageId]);

  const checkFavorite = useCallback(async () => {
    if (!workspaceId || !pageId) return;
    try {
      const list = await getFavorites(workspaceId);
      setIsFavorited(
        list.some((f) =>
          typeof f.pageId === 'object' ? f.pageId._id === pageId : f.pageId === pageId
        )
      );
    } catch (err) {
      console.error('Failed to check favorite:', err);
    }
  }, [workspaceId, pageId]);

  useEffect(() => {
    if (workspaceId && pageId) {
      loadPage();
      loadComments();
      checkFavorite();
      trackPageView(workspaceId, pageId).catch(() => { });
    }
  }, [workspaceId, pageId, loadPage, loadComments, checkFavorite]);

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

  const handleFavoriteToggle = async () => {
    if (!workspaceId || !pageId || favoriteLoading) return;
    try {
      setFavoriteLoading(true);
      if (isFavorited) {
        await removeFavorite(workspaceId, pageId);
        setIsFavorited(false);
      } else {
        await addFavorite(workspaceId, pageId);
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    if (!currentPage) return;
    const blob = new Blob([currentPage.contentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!workspaceId || !pageId) return;
    try {
      setDeleting(true);
      await apiDeletePage(workspaceId, pageId);
      navigate(`/w/${workspaceId}`);
    } catch (err) {
      console.error('Failed to delete page:', err);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const canEdit = currentRole === 'OWNER' || currentRole === 'EDITOR';

  if (loading) {
    return (
      <AppLayout>
        <div className="h-full flex flex-col items-center justify-center p-20 animate-pulse">
          <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-slate-200 rounded-full mb-2"></div>
          <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
        </div>
      </AppLayout>
    );
  }

  if (!currentPage) {
    return (
      <AppLayout>
        <div className="h-full flex flex-col items-center justify-center p-20 text-center">
          <div className="p-6 bg-red-50 rounded-full mb-6">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Resource Unavailable</h2>
          <p className="text-slate-500 font-medium mb-8">This page may have been moved, deleted, or you don't have access.</p>
          <Button onClick={() => navigate(`/w/${workspaceId}`)}>Return Home</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-full bg-white">
        {/* Sub-Header ToolBar */}
        <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/w/${workspaceId}`)}
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl smooth-transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 rounded-lg">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:block">Knowledge Record</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl mr-2">
              <button
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={cn(
                  "p-2 rounded-lg smooth-transition",
                  isFavorited ? "bg-white shadow-sm text-amber-500" : "text-slate-500 hover:text-primary-600"
                )}
              >
                <Star className={cn("w-4 h-4", isFavorited && "fill-amber-400")} />
              </button>
              <button
                onClick={handleExportMarkdown}
                title="Export as Markdown"
                className="p-2 text-slate-500 hover:text-primary-600 rounded-lg hover:bg-white hover:shadow-sm smooth-transition">
                <Download className="w-4 h-4" />
              </button>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleExportPDF}
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Printer className="w-4 h-4 mr-2" />
              PDF
            </Button>

            {currentRole === MemberRole.OWNER && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAccessModalOpen(true)}
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <Shield className="w-4 h-4 mr-2" />
                Access
              </Button>
            )}

            {currentRole !== MemberRole.VIEWER && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl bg-white border border-slate-200 hidden sm:flex"
                onClick={() => workspaceId && pageId && navigate(`/w/${workspaceId}/pages/${pageId}/history`)}
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            )}

            {canEdit && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  className="rounded-xl shadow-sm ml-2"
                  onClick={() => navigate(`/w/${workspaceId}/pages/${pageId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Document
                </Button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl smooth-transition border border-transparent hover:border-red-100"
                  title="Delete Page"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-16 animate-fade-in relative">
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              {currentPage.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <Clock className="h-3.5 w-3.5" />
                Updated {new Date(currentPage.updatedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">
                <FileText className="h-3.5 w-3.5" />
                {currentPage.updatedBy.firstName} {currentPage.updatedBy.lastName}
              </span>
              <span className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border uppercase",
                currentPage.status === 'PUBLISHED' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-amber-50 border-amber-100 text-amber-600"
              )}>
                <Shield className="w-3.5 h-3.5" />
                {currentPage.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 hidden lg:flex flex-col gap-8">
              <AttachmentGallery workspaceId={workspaceId!} pageId={pageId!} currentRole={currentRole || 'VIEWER'} />
            </aside>

            <div className="flex-1 min-w-0 w-full">
              <Card className="mb-12 border border-slate-200 bg-white p-8 lg:p-12 overflow-visible rounded-xl shadow-sm">
                <div className="prose prose-slate prose-lg lg:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:font-medium prose-a:text-primary-600 prose-strong:text-slate-900 prose-code:bg-slate-50 prose-code:p-1 prose-code:rounded-md prose-img:rounded-3xl prose-img:shadow-xl">
                  <ReactMarkdown>{currentPage.contentMarkdown || '*No content available for this page. Use the editor to start writing.*'}</ReactMarkdown>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-8 border-t border-slate-100 mt-12 gap-6">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
                        {currentPage.createdBy.firstName.charAt(0)}{currentPage.createdBy.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Author</div>
                        <div className="text-sm font-bold text-slate-900">{currentPage.createdBy.firstName} {currentPage.createdBy.lastName}</div>
                      </div>
                    </div>
                  </div>

                  {collaborators.length > 0 && (
                    <div className="flex items-center gap-3 bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">
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
                      <span className="text-xs font-bold text-primary-700">Collaborating</span>
                    </div>
                  )}
                </div>
              </Card>

              <div id="comments" className="relative pt-8 mb-20">
                <div className="flex items-center gap-3 mb-8 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl inline-flex w-fit border border-slate-100">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Collaboration & Discussion
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-8 lg:p-10 shadow-sm">
                  <CommentList
                    workspaceId={workspaceId!}
                    pageId={pageId!}
                    comments={comments}
                    onCommentAdded={loadComments}
                    createComment={apiCreateComment}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AccessControlModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        workspaceId={workspaceId!}
        itemType="page"
        currentPermissions={currentPage.permissions || []}
        onUpdatePermissions={async (permissions) => {
          await updatePagePermissions(workspaceId!, pageId!, permissions);
          loadPage();
        }}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${currentPage.title}"? This action is permanent and cannot be reversed.`}
        confirmLabel="Delete Permanently"
        loading={deleting}
      />
    </AppLayout>
  );
};
