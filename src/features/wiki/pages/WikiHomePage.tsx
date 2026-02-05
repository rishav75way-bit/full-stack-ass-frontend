import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search as SearchIcon, Activity, LayoutGrid, FolderPlus, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { setFolderTree, setPages } from '../../../app/store/slices/pageSlice';
import { getFolderTree, createFolder, deleteFolder as apiDeleteFolder } from '../../../app/api/folder.api';
import { getPages, createPage } from '../../../app/api/page.api';
import { AppLayout } from '../../../app/layouts/AppLayout';
import { FolderTree } from '../components/FolderTree';
import { PageList } from '../components/PageList';
import { AccessControlModal } from '../components/AccessControlModal';
import { updateFolderPermissions } from '../../../app/api/folder.api';
import { Button } from '../../../app/components/Button';
import { Modal } from '../../../app/components/Modal';
import { Input } from '../../../app/components/Input';
import { ConfirmationModal } from '../../../app/components/ConfirmationModal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../../../app/utils/cn';

const createPageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
});

const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(100),
});

type CreatePageFormValues = z.infer<typeof createPageSchema>;
type CreateFolderFormValues = z.infer<typeof createFolderSchema>;

export const WikiHomePage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { folderTree, pages } = useAppSelector((state) => state.page);
  const { currentRole } = useAppSelector((state) => state.workspace);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | undefined>();
  const [isCreatePageModalOpen, setIsCreatePageModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [createFolderParentId, setCreateFolderParentId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [folderLoading, setFolderLoading] = useState(false);
  const [isFolderAccessModalOpen, setIsFolderAccessModalOpen] = useState(false);
  const [folderIdForAccess, setFolderIdForAccess] = useState<string | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [deletingFolder, setDeletingFolder] = useState(false);

  const pageForm = useForm<CreatePageFormValues>({
    resolver: zodResolver(createPageSchema),
  });
  const folderForm = useForm<CreateFolderFormValues>({
    resolver: zodResolver(createFolderSchema),
  });

  useEffect(() => {
    if (workspaceId) {
      loadFolders();
      loadPages();
    }
  }, [workspaceId]);

  useEffect(() => {
    if (workspaceId) {
      loadPages();
    }
  }, [selectedFolderId]);

  const loadFolders = async () => {
    if (!workspaceId) return;
    try {
      const data = await getFolderTree(workspaceId);
      dispatch(setFolderTree(data));
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  const loadPages = async () => {
    if (!workspaceId) return;
    try {
      setLoading(true);
      const data = await getPages(
        workspaceId,
        selectedFolderId === null ? undefined : selectedFolderId
      );
      dispatch(setPages(data));
    } catch (error) {
      console.error('Failed to load pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (values: CreatePageFormValues) => {
    if (!workspaceId) return;
    try {
      setLoading(true);
      const page = await createPage(workspaceId, {
        title: values.title,
        contentMarkdown: '',
        folderId: selectedFolderId || undefined,
      });
      setIsCreatePageModalOpen(false);
      pageForm.reset();
      navigate(`/w/${workspaceId}/pages/${page._id}/edit`);
    } catch (error) {
      console.error('Failed to create page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPage = (pageId: string) => {
    setSelectedPageId(pageId);
    navigate(`/w/${workspaceId}/pages/${pageId}`);
  };

  const openCreateFolderModal = (parentId?: string) => {
    setCreateFolderParentId(parentId);
    folderForm.reset({ name: '' });
    setIsCreateFolderModalOpen(true);
  };

  const handleCreateFolder = async (values: CreateFolderFormValues) => {
    if (!workspaceId) return;
    try {
      setFolderLoading(true);
      await createFolder(workspaceId, {
        name: values.name,
        parentId: createFolderParentId,
      });
      setIsCreateFolderModalOpen(false);
      folderForm.reset();
      loadFolders();
    } catch (error) {
      console.error('Failed to create folder:', error);
    } finally {
      setFolderLoading(false);
    }
  };

  const handleDeleteFolder = async () => {
    if (!workspaceId || !folderToDelete) return;
    try {
      setDeletingFolder(true);
      await apiDeleteFolder(workspaceId, folderToDelete);
      if (selectedFolderId === folderToDelete) setSelectedFolderId(null);
      setFolderToDelete(null);
      loadFolders();
    } catch (err: any) {
      console.error('Failed to delete folder:', err);
      
      
    } finally {
      setDeletingFolder(false);
    }
  };

  const handleOpenFolderPermissions = (folderId: string) => {
    setFolderIdForAccess(folderId);
    setIsFolderAccessModalOpen(true);
  };

  const findFolderInTree = (tree: any[], folderId: string): any => {
    for (const folder of tree) {
      if (folder._id === folderId) return folder;
      if (folder.children) {
        const found = findFolderInTree(folder.children, folderId);
        if (found) return found;
      }
    }
    return null;
  };

  const sidebar = (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary-100 rounded-xl">
            <LayoutGrid className="w-4 h-4 text-primary-600" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-slate-800">Knowledge Hub</span>
        </div>

        {currentRole !== 'VIEWER' && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setIsCreatePageModalOpen(true)}
              size="sm"
              className="flex-1 text-xs py-2.5 rounded-xl shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Page
            </Button>
            <Button
              onClick={() => openCreateFolderModal()}
              size="sm"
              variant="outline"
              className="flex-1 text-xs py-2.5 rounded-xl shadow-sm bg-white"
            >
              <FolderPlus className="h-4 w-4 mr-1" />
              Folder
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <FolderTree
          folders={folderTree}
          onSelectFolder={setSelectedFolderId}
          onCreateFolder={openCreateFolderModal}
          onPermissionsFolder={currentRole !== 'VIEWER' ? handleOpenFolderPermissions : undefined}
          onDeleteFolder={currentRole !== 'VIEWER' ? (folderId) => setFolderToDelete(folderId) : undefined}
          selectedFolderId={selectedFolderId}
          currentRole={currentRole || 'VIEWER'}
        />

        <div className="p-4 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs font-bold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl px-4 border-2 border-slate-200 hover:border-primary-300 bg-white shadow-sm"
            onClick={() => workspaceId && navigate(`/w/${workspaceId}/activity`)}
          >
            <Activity className="h-4 w-4 mr-3" />
            Recent Activity
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout sidebar={sidebar}>
      <div className="max-w-6xl mx-auto px-8 py-12 min-h-full flex flex-col">
        {}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-slate-200 ring-2 ring-white flex items-center justify-center overflow-hidden">
                    <div className={cn("w-full h-full", i === 1 ? "bg-indigo-500" : i === 2 ? "bg-emerald-500" : "bg-amber-500")}></div>
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Live Collaboration</span>
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-primary-600" />
              {selectedFolderId
                ? folderTree.find(f => f._id === selectedFolderId)?.name || 'Folder Contents'
                : 'Workspace Explorer'}
            </h1>

            <p className="text-slate-500 font-medium max-w-2xl text-lg">
              {selectedFolderId
                ? 'Organize and manage documentation within this specific directory.'
                : 'Welcome to your team wiki. Browse all pages, search for content, or create something new.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-slate-400 group-within:text-primary-500 smooth-transition" />
              </div>
              <input
                type="text"
                placeholder="Find anything..."
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold w-64 focus:outline-none focus:border-primary-500 smooth-transition shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {}
        <div className="flex-1">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-28 bg-white border border-slate-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                  {pages.length} Pages Available
                </h2>
              </div>
              <PageList
                pages={pages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))}
                onSelectPage={handleSelectPage}
                selectedPageId={selectedPageId}
              />
            </div>
          )}
        </div>

        {}
        {!loading && pages.length > 0 && (
          <div className="mt-12 py-8 text-center text-slate-400 border-t border-slate-50 italic text-sm font-medium">
            End of documentation library. Use search or structure tree to navigate further.
          </div>
        )}
      </div>

      {}
      <Modal
        isOpen={isCreatePageModalOpen}
        onClose={() => setIsCreatePageModalOpen(false)}
        title="Create New Page"
      >
        <form onSubmit={pageForm.handleSubmit(handleCreatePage)} className="space-y-6">
          <p className="text-sm text-slate-500 font-medium -mt-2">
            Give your new documentation page a clear and descriptive title.
          </p>
          <Input
            label="Page Title"
            {...pageForm.register('title')}
            error={pageForm.formState.errors.title?.message}
            placeholder="e.g. Project Specs, Onboarding Guide..."
            className="text-lg"
          />
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreatePageModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} fullWidth>
              Create Page
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        title="Create New Folder"
      >
        <form onSubmit={folderForm.handleSubmit(handleCreateFolder)} className="space-y-6">
          <p className="text-sm text-slate-500 font-medium -mt-2">
            Folders help you organize related pages and sub-directories.
          </p>
          <Input
            label="Folder Name"
            {...folderForm.register('name')}
            error={folderForm.formState.errors.name?.message}
            placeholder="e.g. Design Docs, API Refs..."
          />
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateFolderModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button type="submit" loading={folderLoading} fullWidth>
              Create Folder
            </Button>
          </div>
        </form>
      </Modal>
      <AccessControlModal
        isOpen={isFolderAccessModalOpen}
        onClose={() => {
          setIsFolderAccessModalOpen(false);
          setFolderIdForAccess(null);
        }}
        workspaceId={workspaceId!}
        itemType="folder"
        currentPermissions={folderIdForAccess ? findFolderInTree(folderTree, folderIdForAccess)?.permissions || [] : []}
        onUpdatePermissions={async (permissions) => {
          if (folderIdForAccess) {
            await updateFolderPermissions(workspaceId!, folderIdForAccess, permissions);
            loadFolders();
          }
        }}
      />

      <ConfirmationModal
        isOpen={!!folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={handleDeleteFolder}
        title="Delete Folder"
        message="Are you sure you want to delete this folder? Note: The folder must be empty (no pages or subfolders) to be deleted."
        confirmLabel="Delete Folder"
        loading={deletingFolder}
      />
    </AppLayout>
  );
};
