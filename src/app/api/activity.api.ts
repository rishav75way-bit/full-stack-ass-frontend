import { api } from './axios';

export interface Activity {
  _id: string;
  workspaceId: string;
  actorId: { _id: string; firstName: string; lastName: string };
  type: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export const getActivities = async (
  workspaceId: string,
  limit?: number
): Promise<Activity[]> => {
  const { data } = await api.get<Activity[]>(
    `/w/${workspaceId}/activities`,
    limit != null ? { params: { limit } } : undefined
  );
  return data;
};
