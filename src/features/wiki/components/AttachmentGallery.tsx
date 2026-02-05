import React, { useState, useEffect } from 'react';
import { Paperclip, Upload, FileText, Image as ImageIcon, Download, Trash2, File } from 'lucide-react';
import { getAttachments, uploadAttachment, deleteAttachment } from '../../../app/api/attachment.api';
import type { Attachment } from '../../../app/api/attachment.api';
import { cn } from '../../../app/utils/cn';
import { ConfirmationModal } from '../../../app/components/ConfirmationModal';

interface AttachmentGalleryProps {
    workspaceId: string;
    pageId: string;
    currentRole: string;
}

export const AttachmentGallery: React.FC<AttachmentGalleryProps> = ({
    workspaceId,
    pageId,
    currentRole,
}) => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState<{ id: string; name: string } | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadAttachments();
    }, [pageId]);

    const loadAttachments = async () => {
        setLoading(true);
        try {
            const data = await getAttachments(workspaceId, pageId);
            setAttachments(data);
        } catch (error) {
            console.error('Failed to load attachments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const newAttachment = await uploadAttachment(workspaceId, pageId, file);
            setAttachments(prev => [newAttachment, ...prev]);
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!attachmentToDelete) return;
        try {
            setDeleting(true);
            await deleteAttachment(workspaceId, pageId, attachmentToDelete.id);
            setAttachments(prev => prev.filter(a => a._id !== attachmentToDelete.id));
            setAttachmentToDelete(null);
        } catch (error) {
            console.error('Delete failed', error);
        } finally {
            setDeleting(false);
        }
    };

    const getFileIcon = (mime: string) => {
        if (mime.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
        if (mime.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
        return <File className="w-5 h-5 text-slate-400" />;
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-slate-400" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Attachments</h3>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{attachments.length}</span>
                </div>
                {currentRole !== 'VIEWER' && (
                    <label className="cursor-pointer group/upload">
                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl smooth-transition shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
                            uploading && "opacity-60 cursor-not-allowed hover:scale-100"
                        )}>
                            <Upload className={cn("w-4 h-4", uploading && "animate-pulse")} />
                        </div>
                    </label>
                )}
            </div>

            <div className="p-4">
                {loading ? (
                    <div className="py-8 flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scanning...</p>
                    </div>
                ) : attachments.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-3 text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-100">
                            <Paperclip className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500">No attachments yet</p>
                            <p className="text-[10px] text-slate-400 font-medium">Upload PDFs, images, or documents.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {attachments.map(att => (
                            <div key={att._id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 smooth-transition">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                        {getFileIcon(att.mimeType)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate" title={att.filename}>{att.filename}</p>
                                        <p className="text-[10px] text-slate-400 font-medium tracking-tight">{(att.size / 1024).toFixed(1)} KB • {new Date(att.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 smooth-transition">
                                    <a
                                        href={`http://localhost:5000${att.path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-primary-600 smooth-transition"
                                        title="Download"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                    </a>
                                    {currentRole !== 'VIEWER' && (
                                        <button
                                            onClick={() => setAttachmentToDelete({ id: att._id, name: att.filename })}
                                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-red-600 smooth-transition"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={!!attachmentToDelete}
                onClose={() => setAttachmentToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Attachment"
                message={`Are you sure you want to delete "${attachmentToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete Attachment"
                loading={deleting}
            />
        </div>
    );
};
