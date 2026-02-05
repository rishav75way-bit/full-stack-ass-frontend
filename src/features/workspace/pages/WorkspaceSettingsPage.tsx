import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Settings,
    Users,
    Shield,
    ArrowLeft,
    X,
    Plus,
    Mail
} from 'lucide-react';
import { AppLayout } from '../../../app/layouts/AppLayout';
import { Button } from '../../../app/components/Button';
import { Card } from '../../../app/components/Card';
import { Input } from '../../../app/components/Input';
import { Modal } from '../../../app/components/Modal';
import {
    getWorkspaceById,
    updateWorkspace,
    getWorkspaceMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
    getPendingInvitations
} from '../../../app/api/workspace.api';
import { useAppSelector } from '../../../app/store/hooks';

export const WorkspaceSettingsPage = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const navigate = useNavigate();
    const { currentRole } = useAppSelector((state) => state.workspace);

    const [workspaceName, setWorkspaceName] = useState('');
    const [members, setMembers] = useState<any[]>([]);
    const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successEmail, setSuccessEmail] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('EDITOR');
    const [inviting, setInviting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isOwner = currentRole === 'OWNER';

    useEffect(() => {
        if (workspaceId) {
            loadData();
        }
    }, [workspaceId]);

    const loadData = async () => {
        if (!workspaceId) return;
        try {
            setLoading(true);
            const [wsData, membersData, invitationsData] = await Promise.all([
                getWorkspaceById(workspaceId),
                getWorkspaceMembers(workspaceId),
                isOwner ? getPendingInvitations(workspaceId) : Promise.resolve([])
            ]);
            setWorkspaceName(wsData.workspace.name);
            setMembers(membersData);
            setPendingInvitations(invitationsData);
        } catch (err) {
            console.error('Failed to load workspace settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateName = async () => {
        if (!workspaceId || !workspaceName.trim()) return;
        try {
            setSaving(true);
            await updateWorkspace(workspaceId, { name: workspaceName });
            
        } catch (err) {
            console.error('Update failed:', err);
            setError('Failed to update workspace name.');
        } finally {
            setSaving(false);
        }
    };


    const handleInvite = async () => {
        if (!workspaceId || !inviteEmail.trim()) return;
        try {
            setInviting(true);
            await inviteMember(workspaceId, { email: inviteEmail, role: inviteRole });
            setShowInviteModal(false);
            setSuccessEmail(inviteEmail);
            setInviteEmail('');
            setShowSuccessModal(true);
            await loadData();
        } catch (err: any) {
            console.error('Invite failed:', err);
            setError(err.response?.data?.message || 'Failed to send invitation.');
        } finally {
            setInviting(false);
        }
    };

    const handleRoleUpdate = async (membershipId: string, newRole: string) => {
        if (!workspaceId) return;
        try {
            await updateMemberRole(workspaceId, membershipId, newRole);
            loadData();
        } catch (err) {
            console.error('Role update failed:', err);
        }
    };

    const handleRemoveMember = async (membershipId: string) => {
        if (!workspaceId) return;
        try {
            await removeMember(workspaceId, membershipId);
            loadData();
        } catch (err) {
            console.error('Remove member failed:', err);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="h-full flex items-center justify-center p-20 animate-pulse">
                    <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto px-8 py-12 animate-fade-in">
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate(`/w/${workspaceId}`)}
                            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl smooth-transition border border-slate-200 shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-xs">
                            <Settings className="w-4 h-4" />
                            Workspace Control
                        </div>
                    </div>

                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Settings & <span className="text-primary-600">Governance</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-4">
                        Manage your workspace identity, coordinate team access, and configure system preferences.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {}
                    <div className="lg:col-span-2 space-y-8">
                        {}
                        <Card className="p-8 border border-slate-200 bg-white rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">General Identity</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Workspace Name</label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            label=""
                                            value={workspaceName}
                                            onChange={(e) => setWorkspaceName(e.target.value)}
                                            placeholder="Enter workspace name"
                                            className="flex-1"
                                            disabled={!isOwner}
                                        />
                                        {isOwner && (
                                            <Button
                                                onClick={handleUpdateName}
                                                loading={saving}
                                                size="sm"
                                                className="h-[46px] px-6 rounded-xl whitespace-nowrap"
                                            >
                                                Save Changes
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {}
                        <Card className="p-8 border border-slate-200 bg-white rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Collaborator Network</h2>
                                </div>
                                {isOwner && (
                                    <Button size="sm" onClick={() => setShowInviteModal(true)} className="rounded-xl">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Invite
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {members.map((member) => (
                                    <div key={member._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary-100 smooth-transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 font-bold shadow-sm">
                                                {member.user?.firstName?.charAt(0) || member.user?.email?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">
                                                    {member.user ? (
                                                        `${member.user.firstName || ''} ${member.user.lastName || ''}`.trim() || member.user.email || 'Unknown User'
                                                    ) : 'Unknown User'}
                                                </div>
                                                <div className="text-xs font-medium text-slate-500">{member.user?.email || 'No email provided'}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {isOwner && member.role !== 'OWNER' ? (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        className="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                                        value={member.role}
                                                        onChange={(e) => handleRoleUpdate(member._id, e.target.value)}
                                                    >
                                                        <option value="VIEWER">Viewer</option>
                                                        <option value="EDITOR">Editor</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleRemoveMember(member._id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg smooth-transition"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black tracking-widest bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-400 uppercase">
                                                    {member.role}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {}
                                {pendingInvitations.length > 0 && (
                                    <>
                                        <div className="flex items-center gap-2 mt-6 mb-3">
                                            <div className="h-px bg-slate-200 flex-1"></div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Invitations</span>
                                            <div className="h-px bg-slate-200 flex-1"></div>
                                        </div>
                                        {pendingInvitations.map((invitation) => (
                                            <div key={invitation._id} className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 font-bold shadow-sm">
                                                        <Mail className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">
                                                            {invitation.email}
                                                        </div>
                                                        <div className="text-xs font-medium text-amber-600">Invitation sent • Pending acceptance</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black tracking-widest bg-white border border-amber-300 px-2.5 py-1 rounded-md text-amber-600 uppercase">
                                                        {invitation.role}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {}
            <Modal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                title="Invite Collaborator"
            >
                <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                        <Input
                            label="Email Address"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="collab@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Initial Permissions</label>
                        <select
                            className="w-full h-12 rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary-500 smooth-transition"
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                        >
                            <option value="VIEWER">Viewer — Can only read and comment</option>
                            <option value="EDITOR">Editor — Can modify content and folders</option>
                        </select>
                    </div>

                    {error && <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>}

                    <Button
                        className="w-full"
                        onClick={handleInvite}
                        loading={inviting}
                    >
                        Send Invitation
                    </Button>
                </div>
            </Modal>


            {}
            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title=""
            >
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">Invitation Sent!</h3>
                    <p className="text-slate-600 mb-2">
                        An email invitation has been sent to
                    </p>
                    <p className="text-lg font-bold text-primary-600 mb-4">{successEmail}</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-blue-800 font-medium">
                            📧 They will receive an email with a secure link to join this workspace.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowSuccessModal(false)}
                        className="w-full"
                    >
                        Got it!
                    </Button>
                </div>
            </Modal>
        </AppLayout>
    );
};
