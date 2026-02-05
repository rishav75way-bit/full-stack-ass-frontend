import { createSlice } from '@reduxjs/toolkit';

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

interface WorkspaceState {
  workspaces: WorkspaceMembership[];
  currentWorkspace: Workspace | null;
  currentRole: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  currentRole: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspaces: (state, action: { payload: WorkspaceMembership[] }) => {
      state.workspaces = action.payload;
    },
    setCurrentWorkspace: (
      state,
      action: { payload: { workspace: Workspace; role: string } }
    ) => {
      state.currentWorkspace = action.payload.workspace;
      state.currentRole = action.payload.role;
    },
    clearCurrentWorkspace: (state) => {
      state.currentWorkspace = null;
      state.currentRole = null;
    },
  },
});

export const { setWorkspaces, setCurrentWorkspace, clearCurrentWorkspace } =
  workspaceSlice.actions;
export default workspaceSlice.reducer;
