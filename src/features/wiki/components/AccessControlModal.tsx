import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { getWorkspaceMembers } from '../../../app/api/workspace.api';
import { Button } from '../../../app/components/Button';

interface AccessControlModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspaceId: string;
    itemType: 'page' | 'folder';
    currentPermissions: any[];
    onUpdatePermissions: (permissions: any[]) => Promise<void>;
}

export const AccessControlModal: React.FC<AccessControlModalProps> = ({
    isOpen,
    onClose,
    workspaceId,
    itemType,
    currentPermissions,
    onUpdatePermissions,
}) => {
    const [members, setMembers] = useState<any[]>([]);
    const [permissions, setPermissions] = useState<any[]>(currentPermissions || []);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadMembers();
            setPermissions(currentPermissions || []);
        }
    }, [isOpen, currentPermissions]);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const data = await getWorkspaceMembers(workspaceId);
            setMembers(data);
        } catch (error) {
            console.error('Failed to load members', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePermission = (userId: string, role: 'EDITOR' | 'VIEWER' | null) => {
        setPermissions(prev => {
            const filtered = prev.filter(p => p.userId !== userId);
            if (role === null) return filtered;
            return [...filtered, { userId, role }];
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onUpdatePermissions(permissions);
            onClose();
        } catch (error) {
            console.error('Failed to save permissions', error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Access Control</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manage {itemType} permissions</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg smooth-transition">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading members...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {members.map(member => {
                                const currentPerm = permissions.find(p => p.userId === member.user?._id);
                                return (
                                    <div key={member._id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                                {member.user?.firstName?.charAt(0) || 'U'}{member.user?.lastName?.charAt(0) || ''}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">
                                                    {member.user ? `${member.user.firstName || ''} ${member.user.lastName || ''}`.trim() || 'Unknown User' : 'Unknown User'}
                                                </p>
                                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{member.role} (Workspace)</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <select
                                                value={currentPerm?.role || 'VIEWER'}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (member.user?._id) {
                                                        handleTogglePermission(member.user._id, val as 'EDITOR' | 'VIEWER');
                                                    }
                                                }}
                                                className="text-xs font-bold bg-slate-50 border-slate-200 rounded-lg focus:ring-primary-500 py-1"
                                            >
                                                <option value="VIEWER">Can View</option>
                                                <option value="EDITOR">Can Edit</option>
                                            </select>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving} loading={saving}>Save Permissions</Button>
                </div>
            </div>
        </div>
    );
};
