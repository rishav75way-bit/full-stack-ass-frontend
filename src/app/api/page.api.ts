import { api } from './axios';
import type { Page } from '../store/slices/pageSlice';

export interface CreatePagePayload {
  title: string;
  contentMarkdown?: string;
  folderId?: string;
}

export interface UpdatePagePayload {
  title?: string;
  contentMarkdown?: string;
  folderId?: string | null;
}

export const createPage = async (
  workspaceId: string,
  payload: CreatePagePayload
): Promise<Page> => {
  const { data } = await api.post<Page>(`/w/${workspaceId}/pages`, payload);
  return data;
};

export const getPages = async (
  workspaceId: string,
  folderId?: string,
  status?: string
): Promise<Page[]> => {
  const params = new URLSearchParams();
  if (folderId !== undefined) params.append('folderId', folderId);
  if (status) params.append('status', status);

  const { data } = await api.get<Page[]>(
    `/w/${workspaceId}/pages?${params.toString()}`
  );
  return data;
};

export const getPageById = async (
  workspaceId: string,
  pageId: string
): Promise<Page> => {
  const { data } = await api.get<Page>(`/w/${workspaceId}/pages/${pageId}`);
  return data;
};

export const updatePage = async (
  workspaceId: string,
  pageId: string,
  payload: UpdatePagePayload
): Promise<Page> => {
  const { data } = await api.patch<Page>(
    `/w/${workspaceId}/pages/${pageId}`,
    payload
  );
  return data;
};

export const publishPage = async (
  workspaceId: string,
  pageId: string
): Promise<Page> => {
  const { data } = await api.post<Page>(
    `/w/${workspaceId}/pages/${pageId}/publish`
  );
  return data;
};

export const unpublishPage = async (
  workspaceId: string,
  pageId: string
): Promise<Page> => {
  const { data } = await api.post<Page>(
    `/w/${workspaceId}/pages/${pageId}/unpublish`
  );
  return data;
};

export const deletePage = async (
  workspaceId: string,
  pageId: string
): Promise<void> => {
  await api.delete(`/w/${workspaceId}/pages/${pageId}`);
};

export const updatePagePermissions = async (
  workspaceId: string,
  pageId: string,
  permissions: { userId: string; role: 'EDITOR' | 'VIEWER' }[]
): Promise<Page> => {
  const { data } = await api.patch<Page>(
    `/w/${workspaceId}/pages/${pageId}/permissions`,
    { permissions }
  );
  return data;
};
