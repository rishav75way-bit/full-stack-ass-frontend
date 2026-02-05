import { api } from './axios';

export interface Attachment {
    _id: string;
    pageId: string;
    workspaceId: string;
    userId: any;
    filename: string;
    mimeType: string;
    size: number;
    path: string;
    createdAt: string;
}

export const getAttachments = async (
    workspaceId: string,
    pageId: string
): Promise<Attachment[]> => {
    const { data } = await api.get<Attachment[]>(
        `/w/${workspaceId}/pages/${pageId}/attachments`
    );
    return data;
};

export const uploadAttachment = async (
    workspaceId: string,
    pageId: string,
    file: File
): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<Attachment>(
        `/w/${workspaceId}/pages/${pageId}/attachments`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return data;
};

export const deleteAttachment = async (
    workspaceId: string,
    pageId: string,
    attachmentId: string
): Promise<void> => {
    await api.delete(
        `/w/${workspaceId}/pages/${pageId}/attachments/${attachmentId}`
    );
};
