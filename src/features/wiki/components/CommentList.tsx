import { useState, useMemo } from 'react';
import { MessageSquare, Send, Clock, Edit2, Trash2, X, Check, CornerDownRight } from 'lucide-react';
import { Button } from '../../../app/components/Button';
import { ConfirmationModal } from '../../../app/components/ConfirmationModal';
import type { Comment as WikiComment } from '../../../app/api/comment.api';
import { updateComment, deleteComment } from '../../../app/api/comment.api';
import { useAppSelector } from '../../../app/store/hooks';

interface CommentListProps {
  workspaceId: string;
  pageId: string;
  comments: WikiComment[];
  onCommentAdded: () => void;
  createComment: (wsId: string, pId: string, payload: { content: string; parentId?: string }) => Promise<WikiComment>;
}

export const CommentList = ({
  workspaceId,
  pageId,
  comments,
  onCommentAdded,
  createComment,
}: CommentListProps) => {
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    try {
      setSubmitting(true);
      await createComment(workspaceId, pageId, { content: newContent.trim() });
      setNewContent('');
      onCommentAdded();
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent.trim()) return;
    try {
      setReplySubmitting(true);
      await createComment(workspaceId, pageId, {
        content: replyContent.trim(),
        parentId
      });
      setReplyContent('');
      setReplyingTo(null);
      onCommentAdded();
    } catch (err) {
      console.error('Failed to add reply:', err);
    } finally {
      setReplySubmitting(false);
    }
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const handleUpdate = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
      await updateComment(workspaceId, pageId, commentId, { content: editContent });
      setEditingId(null);
      onCommentAdded();
    } catch (err) {
      console.error('Update comment failed:', err);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    try {
      setDeleting(true);
      await deleteComment(workspaceId, pageId, commentToDelete);
      setCommentToDelete(null);
      onCommentAdded();
    } catch (err) {
      console.error('Delete comment failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  
  const commentTree = useMemo(() => {
    const topLevel: WikiComment[] = [];
    const repliesMap = new Map<string, WikiComment[]>();

    comments.forEach(comment => {
      if (!comment.parentId) {
        topLevel.push(comment);
      } else {
        const replies = repliesMap.get(comment.parentId) || [];
        replies.push(comment);
        repliesMap.set(comment.parentId, replies);
      }
    });

    return { topLevel, repliesMap };
  }, [comments]);

  const renderComment = (c: WikiComment, depth: number = 0) => {
    const replies = commentTree.repliesMap.get(c._id) || [];
    const isOwner = user && (typeof c.userId === 'object' ? c.userId._id === user.id : c.userId === user.id);
    const maxDepth = 3; 

    return (
      <div key={c._id} className={depth > 0 ? 'ml-8 mt-4' : ''}>
        <div className="group flex gap-4 p-5 rounded-3xl bg-white border border-slate-100 hover:border-primary-100 hover:shadow-md smooth-transition">
          {depth > 0 && (
            <div className="absolute -left-6 top-0 bottom-0 w-px bg-slate-200"></div>
          )}

          <div className="shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black shadow-sm group-hover:from-primary-500 group-hover:to-indigo-500 group-hover:text-white smooth-transition">
              {typeof c.userId === 'object' && c.userId ? c.userId.firstName.charAt(0) : 'U'}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-900 tracking-tight">
                {typeof c.userId === 'object' && c.userId
                  ? `${c.userId.firstName} ${c.userId.lastName}`
                  : 'Unknown Collaborator'}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3" />
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>

                {isOwner && (
                  <div className="flex items-center gap-1 opacity-10 sm:opacity-0 group-hover:opacity-100 smooth-transition">
                    <button
                      onClick={() => {
                        setEditingId(c._id);
                        setEditContent(c.content);
                      }}
                      className="p-1 text-slate-400 hover:text-primary-600 smooth-transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCommentToDelete(c._id)}
                      className="p-1 text-slate-400 hover:text-red-500 smooth-transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {editingId === c._id ? (
              <div className="space-y-3 pt-2 animate-scale-in">
                <textarea
                  className="w-full p-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 smooth-transition"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg smooth-transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUpdate(c._id)}
                    className="p-1.5 bg-primary-500 text-white rounded-lg shadow-glow shadow-primary-200 smooth-transition"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {c.content}
                </p>

                {depth < maxDepth && (
                  <button
                    onClick={() => setReplyingTo(c._id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary-600 smooth-transition mt-2"
                  >
                    <CornerDownRight className="w-3 h-3" />
                    Reply
                  </button>
                )}

                {replyingTo === c._id && (
                  <div className="mt-4 space-y-3 animate-scale-in">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 smooth-transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:bg-white min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        loading={replySubmitting}
                        disabled={!replyContent.trim()}
                        onClick={() => handleReplySubmit(c._id)}
                      >
                        <Send className="h-3.5 w-3.5 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {}
        {replies.length > 0 && (
          <div className="relative">
            {replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Collaboration & Feedback</h2>
        </div>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{comments.length} Comments</span>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Share your thoughts or suggest changes..."
          className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 smooth-transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:bg-white min-h-[100px] resize-none"
        />
        <div className="absolute bottom-3 right-3">
          <Button
            type="submit"
            size="sm"
            loading={submitting}
            disabled={!newContent.trim()}
            className="rounded-xl shadow-md"
          >
            <Send className="h-4 w-4" />
            Post Comment
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <MessageSquare className="h-8 w-8 text-slate-200" />
            </div>
            <p className="text-slate-500 font-bold text-sm">No discussions yet</p>
            <p className="text-slate-400 text-xs mt-1">Be the first to share your perspective.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {commentTree.topLevel.map(comment => renderComment(comment, 0))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete Comment"
        loading={deleting}
      />
    </div>
  );
};
