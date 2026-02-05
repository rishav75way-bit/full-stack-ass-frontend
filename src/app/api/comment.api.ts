import { api } from './axios';

export interface Comment {
  _id: string;
  pageId: string;
  workspaceId: string;
  userId: { _id: string; firstName: string; lastName: string; email: string };
  parentId?: string;
  content: string;
  createdAt: string;
}

export const getComments = async (
  workspaceId: string,
  pageId: string
): Promise<Comment[]> => {
  const { data } = await api.get<Comment[]>(
    `/w/${workspaceId}/pages/${pageId}/comments`
  );
  return data;
};

export const createComment = async (
  workspaceId: string,
  pageId: string,
  payload: { content: string; parentId?: string }
): Promise<Comment> => {
  const { data } = await api.post<Comment>(
    `/w/${workspaceId}/pages/${pageId}/comments`,
    payload
  );
  return data;
};

export const updateComment = async (
  workspaceId: string,
  pageId: string,
  commentId: string,
  payload: { content: string }
): Promise<Comment> => {
  const { data } = await api.patch<Comment>(
    `/w/${workspaceId}/pages/${pageId}/comments/${commentId}`,
    payload
  );
  return data;
};


export const deleteComment = async (
  workspaceId: string,
  pageId: string,
  commentId: string
): Promise<void> => {
  await api.delete(`/w/${workspaceId}/pages/${pageId}/comments/${commentId}`);
};
