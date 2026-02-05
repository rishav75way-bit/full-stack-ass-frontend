import { api } from './axios';
import type { Page } from '../store/slices/pageSlice';

export const searchPages = async (
  workspaceId: string,
  q: string
): Promise<Page[]> => {
  const { data } = await api.get<Page[]>(`/w/${workspaceId}/search`, {
    params: { q },
  });
  return data;
};
