import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, LayoutGrid, Calendar, ArrowRight, Settings, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { setWorkspaces, setCurrentWorkspace } from '../../../app/store/slices/workspaceSlice';
import { getUserWorkspaces, createWorkspace } from '../../../app/api/workspace.api';
import { Card } from '../../../app/components/Card';
import { Button } from '../../../app/components/Button';
import { Input } from '../../../app/components/Input';
import { Modal } from '../../../app/components/Modal';
import { Alert } from '../../../app/components/Alert';
import { ConfirmationModal } from '../../../app/components/ConfirmationModal';
import { deleteWorkspace } from '../../../app/api/workspace.api';
import { STORAGE_KEYS } from '../../../app/constants/localStorage';
import { AppLayout } from '../../../app/layouts/AppLayout';

const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
});

type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;

export const WorkspacesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workspaces } = useAppSelector((state) => state.workspace);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      const data = await getUserWorkspaces();
      dispatch(setWorkspaces(data));
    } catch (err) {
      setError('Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: CreateWorkspaceFormValues) => {
    try {
      setLoading(true);
      setError('');
      const workspace = await createWorkspace(values);
      const workspaceData = { workspace, role: 'OWNER' as const };
      dispatch(setCurrentWorkspace(workspaceData));
      localStorage.setItem(STORAGE_KEYS.CURRENT_WORKSPACE, JSON.stringify(workspaceData));
      setIsModalOpen(false);
      reset();
      navigate(`/w/${workspace._id}`);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!workspaceToDelete) return;
    try {
      setIsDeleting(true);
      await deleteWorkspace(workspaceToDelete);
      setWorkspaceToDelete(null);
      loadWorkspaces();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete workspace');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectWorkspace = (workspaceData: typeof workspaces[0]) => {
    dispatch(setCurrentWorkspace(workspaceData));
    localStorage.setItem(STORAGE_KEYS.CURRENT_WORKSPACE, JSON.stringify(workspaceData));
    navigate(`/w/${workspaceData.workspace._id}`);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto py-12 px-6 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-wider text-xs">
              <LayoutGrid className="w-4 h-4" />
              Overview
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome to <span className="text-primary-600">WikiHub</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-lg">
              Select a workspace to start collaborating with your team or create a new one to get started.
            </p>
          </div>
          <Button onClick={() => { setError(''); setIsModalOpen(true); }} size="lg">
            <Plus className="h-5 w-5" />
            Create Workspace
          </Button>
        </header>

        {error && !isModalOpen && <Alert type="error" message={error} className="mb-8" />}

        {loading && workspaces.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-slate-50 border border-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((item) => (
              <Card
                key={item.workspace._id}
                hover
                onClick={() => handleSelectWorkspace(item)}
                className="group animate-scale-in"
              >
                <div className="flex flex-col h-full bg-white -m-6 p-6 rounded-2xl border-b border-transparent group-hover:border-primary-100 smooth-transition">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold text-xl shadow-sm smooth-transition">
                      {item.workspace.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white ring-1 ring-slate-100 rounded-full shadow-sm text-xs font-bold text-slate-600">
                      <Settings className="w-3 h-3" />
                      {item.role}
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-2 truncate group-hover:text-primary-600 smooth-transition">
                    {item.workspace.name}
                  </h3>

                  <div className="flex items-center gap-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.workspace.createdAt).toLocaleDateString()}
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      {item.role === 'OWNER' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setWorkspaceToDelete(item.workspace._id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg smooth-transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <div className="flex items-center gap-1 text-sm font-bold text-primary-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 smooth-transition">
                        Open <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <button
              onClick={() => { setError(''); setIsModalOpen(true); }}
              className="group h-full min-h-[192px] rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-300 hover:bg-primary-50 smooth-transition flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-primary-600 transition-all shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center smooth-transition">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm">Add New Workspace</span>
            </button>
          </div>
        )}

        {workspaces.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border border-slate-200 text-center animate-fade-in mt-8">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <LayoutGrid className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No workspaces yet</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
              Start by creating your first workspace to begin organizing your team's knowledge.
            </p>
            <Button onClick={() => { setError(''); setIsModalOpen(true); }} size="lg">
              Create First Workspace
            </Button>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => { setError(''); setIsModalOpen(false); }}
          title="Create Workspace"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-sm text-slate-500 font-medium -mt-2">
              Workspaces are shared areas for your team to create and organize pages.
            </p>
            {error && <Alert type="error" message={error} />}
            <Input
              label="Workspace Name"
              placeholder="e.g. Engineering Team, Marketing"
              {...register('name')}
              error={errors.name?.message}
            />
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading} fullWidth>
                Create Workspace
              </Button>
            </div>
          </form>
        </Modal>

        <ConfirmationModal
          isOpen={!!workspaceToDelete}
          onClose={() => setWorkspaceToDelete(null)}
          onConfirm={handleDeleteWorkspace}
          title="Delete Workspace"
          message="Are you sure you want to delete this workspace? This action is irreversible and will purge all data."
          confirmLabel="Delete Workspace"
          loading={isDeleting}
        />
      </div>
    </AppLayout>
  );
};
