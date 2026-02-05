import { api } from './axios';
import type { Folder } from '../store/slices/pageSlice';

export interface CreateFolderPayload {
  name: string;
  parentId?: string;
}

export const createFolder = async (
  workspaceId: string,
  payload: CreateFolderPayload
): Promise<Folder> => {
  const { data } = await api.post<Folder>(
    `/w/${workspaceId}/folders`,
    payload
  );
  return data;
};

export const getFolderTree = async (workspaceId: string): Promise<Folder[]> => {
  const { data } = await api.get<Folder[]>(`/w/${workspaceId}/folders/tree`);
  return data;
};

export const deleteFolder = async (
  workspaceId: string,
  folderId: string
): Promise<void> => {
  await api.delete(`/w/${workspaceId}/folders/${folderId}`);
};

export const updateFolderPermissions = async (
  workspaceId: string,
  folderId: string,
  permissions: { userId: string; role: 'EDITOR' | 'VIEWER' }[]
): Promise<Folder> => {
  const { data } = await api.patch<Folder>(
    `/w/${workspaceId}/folders/${folderId}/permissions`,
    { permissions }
  );
  return data;
};
