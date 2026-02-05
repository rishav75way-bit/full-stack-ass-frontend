import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, Plus, FileText, FolderPlus, Trash2, Shield } from 'lucide-react';
import type { Folder as FolderType } from '../../../app/store/slices/pageSlice';
import { cn } from '../../../app/utils/cn';

interface FolderTreeProps {
  folders: FolderType[];
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (parentId?: string) => void;
  onDeleteFolder?: (folderId: string) => void;
  onPermissionsFolder?: (folderId: string) => void;
  selectedFolderId: string | null;
  currentRole: string;
}

export const FolderTree = ({
  folders,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  onPermissionsFolder,
  selectedFolderId,
  currentRole,
}: FolderTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderFolder = (folder: FolderType, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder._id);
    const hasChildren = folder.children && folder.children.length > 0;
    const isSelected = selectedFolderId === folder._id;

    return (
      <div key={folder._id} className="select-none">
        <div
          className={cn(
            'group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer smooth-transition mx-1',
            isSelected
              ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100'
              : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900',
            level > 0 && 'ml-4'
          )}
          onClick={() => onSelectFolder(folder._id)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder._id);
                }}
                className="p-1 rounded-md hover:bg-slate-200/50 smooth-transition text-slate-400 group-hover:text-slate-600"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <Folder className={cn(
              "h-4 w-4 shrink-0 smooth-transition",
              isSelected ? "text-primary-500" : "text-slate-400 group-hover:text-amber-500"
            )} />
            <span className="text-sm font-bold truncate tracking-tight">{folder.name}</span>
          </div>

          {currentRole !== 'VIEWER' && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 smooth-transition">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateFolder(folder._id);
                }}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-primary-600 smooth-transition"
                title="New Subfolder"
              >
                <FolderPlus className="h-3.5 w-3.5" />
              </button>
              {onPermissionsFolder && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPermissionsFolder(folder._id);
                  }}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-indigo-600 smooth-transition"
                  title="Folder Permissions"
                >
                  <Shield className="h-3.5 w-3.5" />
                </button>
              )}
              {onDeleteFolder && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder._id);
                  }}
                  className="p-1.5 hover:bg-red-50 hover:shadow-sm rounded-lg text-slate-400 hover:text-red-500 smooth-transition"
                  title="Delete Folder"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1 animate-slide-down">
            {folder.children?.map((child) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1 py-4">
      <div className="px-4 mb-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Structure</h3>
      </div>

      <div
        className={cn(
          'group flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer smooth-transition mx-2 mb-2',
          selectedFolderId === null
            ? 'bg-gradient-primary text-white shadow-glow'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        )}
        onClick={() => onSelectFolder(null)}
      >
        <FileText className={cn("h-5 w-5", selectedFolderId === null ? "text-white" : "text-slate-400")} />
        <span className="text-sm font-bold tracking-tight">Root Directory</span>
        {selectedFolderId === null && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow"></div>}
      </div>

      <div className="space-y-1">
        {folders.map((folder) => renderFolder(folder))}
      </div>

      {currentRole !== 'VIEWER' && (
        <div className="mt-4 px-2">
          <button
            onClick={() => onCreateFolder()}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-primary-600 hover:bg-primary-50 rounded-xl w-full smooth-transition group"
          >
            <div className="p-1 bg-primary-100 rounded-lg group-hover:bg-primary-600 group-hover:text-white smooth-transition">
              <Plus className="h-3.5 w-3.5" />
            </div>
            <span>Create New Folder</span>
          </button>
        </div>
      )}
    </div>
  );
};
