import { useEffect, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useAuth } from '../providers/AuthContext';
import { LogOut, Sparkles, Settings } from 'lucide-react';
import { useNavigate, Link, useParams } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export const AppLayout = ({ children, sidebar }: AppLayoutProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const { currentWorkspace, currentRole } = useAppSelector((state) => state.workspace);
  const { logout } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  useEffect(() => {
    if (workspaceId && (!currentWorkspace || currentWorkspace._id !== workspaceId)) {
      
      import('../api/workspace.api').then(api => {
        api.getWorkspaceById(workspaceId).then(data => {
          import('../store/slices/workspaceSlice').then(slice => {
            dispatch(slice.setCurrentWorkspace(data));
          });
        });
      });
    }
  }, [workspaceId, currentWorkspace, dispatch]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col bg-white font-sans text-slate-900">
      {}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 sticky top-0">
        <div className="flex items-center gap-6">
          <Link to="/workspaces" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-primary-600 rounded-lg group-hover:bg-primary-700 smooth-transition">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">WikiHub</h1>
          </Link>

          {workspaceId && currentWorkspace && (
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white font-bold text-xs">
                {currentWorkspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workspace</span>
                <div className="flex items-center gap-1 group">
                  <span className="text-sm font-bold text-slate-900 leading-none">
                    {currentWorkspace.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>


        {}
        <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900 leading-none">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {user?.email}
            </span>
          </div>
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer hover:bg-slate-200 smooth-transition">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>

            {}
            <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 smooth-transition z-50">
              {workspaceId && currentRole === 'OWNER' && (
                <Link
                  to={`/w/${workspaceId}/settings`}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl smooth-transition mb-1"
                >
                  <Settings className="h-4 w-4" />
                  Workspace Settings
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl smooth-transition"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {sidebar && (
          <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col">
            {sidebar}
          </aside>
        )}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-white">
          {children}
        </main>
      </div>
    </div >
  );
};
