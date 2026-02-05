import { api } from './axios';

export interface CreateWorkspacePayload {
  name: string;
}

export interface Workspace {
  _id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMembership {
  workspace: Workspace;
  role: string;
  membershipId: string;
}

export const createWorkspace = async (
  payload: CreateWorkspacePayload
): Promise<Workspace> => {
  const { data } = await api.post<Workspace>('/workspaces', payload);
  return data;
};

export const getUserWorkspaces = async (): Promise<WorkspaceMembership[]> => {
  const { data } = await api.get<WorkspaceMembership[]>('/workspaces');
  return data;
};

export const getWorkspaceById = async (
  workspaceId: string
): Promise<{ workspace: Workspace; role: string }> => {
  const { data } = await api.get<{ workspace: Workspace; role: string }>(
    `/workspaces/${workspaceId}`
  );
  return data;
};
export const updateWorkspace = async (
  workspaceId: string,
  payload: Partial<CreateWorkspacePayload>
): Promise<Workspace> => {
  const { data } = await api.patch<Workspace>(`/workspaces/${workspaceId}`, payload);
  return data;
};

export const deleteWorkspace = async (workspaceId: string): Promise<void> => {
  await api.delete(`/workspaces/${workspaceId}`);
};

export const getWorkspaceMembers = async (
  workspaceId: string
): Promise<any[]> => {
  const { data } = await api.get<any[]>(`/workspaces/${workspaceId}/members`);
  return data;
};

export const inviteMember = async (
  workspaceId: string,
  payload: { email: string; role: string }
): Promise<{ invitation: any; invitationLink: string }> => {
  const { data } = await api.post(`/workspaces/${workspaceId}/invitations`, payload);
  return data;
};

export const updateMemberRole = async (
  workspaceId: string,
  membershipId: string,
  role: string
): Promise<void> => {
  await api.patch(`/workspaces/${workspaceId}/members/${membershipId}`, { role });
};

export const removeMember = async (
  workspaceId: string,
  membershipId: string
): Promise<void> => {
  await api.delete(`/workspaces/${workspaceId}/members/${membershipId}`);
};

export const getPendingInvitations = async (
  workspaceId: string
): Promise<any[]> => {
  const { data } = await api.get(`/workspaces/${workspaceId}/invitations`);
  return data;
};

