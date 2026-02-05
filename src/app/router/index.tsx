import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { Loading } from '../components/Loading';

const LoginPage = lazy(() =>
  import('../../features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('../../features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage }))
);
const VerifyEmailPage = lazy(() =>
  import('../../features/auth/pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage }))
);
const DashboardPage = lazy(() =>
  import('../../features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage }))
);
const WorkspacesPage = lazy(() =>
  import('../../features/workspace/pages/WorkspacesPage').then(m => ({ default: m.WorkspacesPage }))
);
const WorkspaceSettingsPage = lazy(() =>
  import('../../features/workspace/pages/WorkspaceSettingsPage').then(m => ({ default: m.WorkspaceSettingsPage }))
);
const WikiHomePage = lazy(() =>
  import('../../features/wiki/pages/WikiHomePage').then(m => ({ default: m.WikiHomePage }))
);
const PageViewPage = lazy(() =>
  import('../../features/wiki/pages/PageViewPage').then(m => ({ default: m.PageViewPage }))
);
const PageEditorPage = lazy(() =>
  import('../../features/wiki/pages/PageEditorPage').then(m => ({ default: m.PageEditorPage }))
);
const SearchPage = lazy(() =>
  import('../../features/wiki/pages/SearchPage').then(m => ({ default: m.SearchPage }))
);
const VersionHistoryPage = lazy(() =>
  import('../../features/wiki/pages/VersionHistoryPage').then(m => ({ default: m.VersionHistoryPage }))
);
const ActivityFeedPage = lazy(() =>
  import('../../features/wiki/pages/ActivityFeedPage').then(m => ({ default: m.ActivityFeedPage }))
);
const NotFound = lazy(() =>
  import('../../pages/NotFound').then(m => ({ default: m.NotFound }))
);
const InvitationAcceptPage = lazy(() =>
  import('../../features/workspace/pages/InvitationAcceptPage').then(m => ({ default: m.InvitationAcceptPage }))
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<Loading />}>
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <Suspense fallback={<Loading />}>
        <VerifyEmailPage />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/workspaces',
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute>
          <WorkspacesPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/w/:workspaceId',
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute>
          <WikiHomePage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/w/:workspaceId/pages/:pageId',
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute>
          <PageViewPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/w/:workspaceId/pages/:pageId/edit',
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute>
          <PageEditorPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/w/:workspaceId/search',
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/w/:workspaceId/pages/:pageId/history',
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute>
          <VersionHistoryPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/w/:workspaceId/activity',
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute>
          <ActivityFeedPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/w/:workspaceId/settings',
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute>
          <WorkspaceSettingsPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/invite/:token',
    element: (
      <Suspense fallback={<Loading />}>
        <InvitationAcceptPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    ),
  },
]);
