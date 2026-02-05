import { api } from './axios';

export interface Version {
  _id: string;
  pageId: string;
  workspaceId: string;
  versionNumber: number;
  titleSnapshot: string;
  contentSnapshot: string;
  createdBy: { _id: string; firstName: string; lastName: string };
  createdAt: string;
}

export interface VersionComparison {
  from: Version;
  to: Version;
  titleDiff?: string;
  contentDiff?: string;
}

export const getVersions = async (
  workspaceId: string,
  pageId: string
): Promise<Version[]> => {
  const { data } = await api.get<Version[]>(
    `/w/${workspaceId}/pages/${pageId}/versions`
  );
  return data;
};

export const getVersionByNumber = async (
  workspaceId: string,
  pageId: string,
  versionNumber: number
): Promise<Version> => {
  const { data } = await api.get<Version>(
    `/w/${workspaceId}/pages/${pageId}/versions/${versionNumber}`
  );
  return data;
};

export const compareVersions = async (
  workspaceId: string,
  pageId: string,
  from: number,
  to: number
): Promise<VersionComparison> => {
  const { data } = await api.get<VersionComparison>(
    `/w/${workspaceId}/pages/${pageId}/versions/compare`,
    { params: { from, to } }
  );
  return data;
};
