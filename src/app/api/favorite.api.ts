import { api } from './axios';

export interface Favorite {
  _id: string;
  workspaceId: string;
  userId: string;
  pageId: string;
  createdAt: string;
}

export interface FavoriteWithPage {
  _id: string;
  pageId: string | { _id: string; title: string };
  createdAt: string;
}

export const getFavorites = async (
  workspaceId: string
): Promise<FavoriteWithPage[]> => {
  const { data } = await api.get<FavoriteWithPage[]>(`/w/${workspaceId}/favorites`);
  return data;
};

export const addFavorite = async (
  workspaceId: string,
  pageId: string
): Promise<Favorite> => {
  const { data } = await api.post<Favorite>(
    `/w/${workspaceId}/favorites/${pageId}`
  );
  return data;
};

export const removeFavorite = async (
  workspaceId: string,
  pageId: string
): Promise<void> => {
  await api.delete(`/w/${workspaceId}/favorites/${pageId}`);
};
