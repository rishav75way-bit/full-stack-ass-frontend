import { api } from './axios';

export interface RecentlyViewedItem {
  _id: string;
  pageId: string;
  viewedAt: string;
  page?: { _id: string; title: string };
}

export const getRecentlyViewed = async (
  workspaceId: string
): Promise<RecentlyViewedItem[]> => {
  const { data } = await api.get<RecentlyViewedItem[]>(
    `/w/${workspaceId}/recently-viewed`
  );
  return data;
};

export const trackPageView = async (
  workspaceId: string,
  pageId: string
): Promise<void> => {
  await api.post(`/w/${workspaceId}/pages/${pageId}/view`);
};
