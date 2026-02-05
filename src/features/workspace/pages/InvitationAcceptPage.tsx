import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../app/components/Button';
import { useAuth } from '../../../app/providers/AuthContext';
import { api } from '../../../app/api/axios';

interface InvitationData {
    _id: string;
    email: string;
    role: string;
    workspaceId: {
        _id: string;
        name: string;
    };
    expiresAt: string;
}

export const InvitationAcceptPage = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [invitation, setInvitation] = useState<InvitationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadInvitation();
    }, [token]);

    const loadInvitation = async () => {
        if (!token) {
            setError('Invalid invitation link');
            setLoading(false);
            return;
        }

        try {
            const data = await api.get(`/workspaces/public/invitations/${token}`);
            setInvitation(data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid or expired invitation');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!token || !user) {
            navigate(`/login?redirect=/invite/${token}`);
            return;
        }

        try {
            setAccepting(true);
            await api.post(`/workspaces/public/invitations/${token}/accept`, {});
            setSuccess(true);
            setTimeout(() => {
                navigate(`/w/${invitation?.workspaceId._id}`);
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to accept invitation');
        } finally {
            setAccepting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Loading invitation...</p>
                </div>
            </div>
        );
    }

    if (error) {
        const isAlreadyMember = error.toLowerCase().includes('already a member');
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-red-100 p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-3">
                        {isAlreadyMember ? 'Already a Member' : 'Invalid Invitation'}
                    </h1>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <div className="flex flex-col gap-3">
                        {isAlreadyMember && invitation?.workspaceId._id ? (
                            <Button onClick={() => navigate(`/w/${invitation.workspaceId._id}`)} className="rounded-xl">
                                Go to Workspace
                            </Button>
                        ) : (
                            <Button onClick={() => navigate('/workspaces')} className="rounded-xl">
                                Go to Workspaces
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-green-100 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-3">Welcome Aboard!</h1>
                    <p className="text-slate-600 mb-2">You've successfully joined</p>
                    <p className="text-xl font-bold text-primary-600 mb-6">{invitation?.workspaceId.name}</p>
                    <p className="text-sm text-slate-500">Redirecting to workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">You're Invited!</h1>
                    <p className="text-white/90 font-medium">Join your team on WikiHub</p>
                </div>

                <div className="p-8">
                    <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <span className="text-2xl font-black text-primary-600">
                                    {invitation?.workspaceId.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900">{invitation?.workspaceId.name}</h2>
                                <p className="text-sm text-slate-500 font-medium">Workspace</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">Invited: {invitation?.email}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">
                                Role: <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold uppercase ml-2">{invitation?.role}</span>
                            </span>
                        </div>
                    </div>

                    {!user ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
                            <p className="text-sm font-medium text-amber-800 mb-4">
                                You need to sign in or create an account to accept this invitation.
                            </p>
                            <Button
                                onClick={() => navigate(`/?redirect=/invite/${token}`)}
                                className="w-full rounded-xl"
                            >
                                Sign In to Accept
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-slate-600 font-medium text-center">
                                Click below to join this workspace and start collaborating!
                            </p>
                            <Button
                                onClick={handleAccept}
                                loading={accepting}
                                className="w-full rounded-xl py-4 text-lg font-bold shadow-lg"
                            >
                                Accept Invitation
                            </Button>
                        </div>
                    )}

                    <p className="text-xs text-slate-400 text-center mt-6">
                        This invitation expires on {new Date(invitation?.expiresAt || '').toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
};
