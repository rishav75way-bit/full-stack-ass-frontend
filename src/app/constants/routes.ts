export const ROUTES = {
  HOME: '/',
  LOGIN: '/',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  WORKSPACES: '/workspaces',
  WORKSPACE: '/w/:workspaceId',
  PAGE: '/w/:workspaceId/pages/:pageId',
  PAGE_EDIT: '/w/:workspaceId/pages/:pageId/edit',
  SEARCH: '/w/:workspaceId/search',
  ACTIVITY: '/w/:workspaceId/activity',
} as const;
