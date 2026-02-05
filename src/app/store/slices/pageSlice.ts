import { createSlice } from '@reduxjs/toolkit';

export interface Folder {
  _id: string;
  workspaceId: string;
  parentId?: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  children?: Folder[];
  permissions?: { userId: string; role: 'EDITOR' | 'VIEWER' }[];
}

export interface Page {
  _id: string;
  workspaceId: string;
  folderId?: string;
  title: string;
  contentMarkdown: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  permissions?: { userId: string; role: 'EDITOR' | 'VIEWER' }[];
}

interface PageState {
  folderTree: Folder[];
  pages: Page[];
  currentPage: Page | null;
  loading: boolean;
}

const initialState: PageState = {
  folderTree: [],
  pages: [],
  currentPage: null,
  loading: false,
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setFolderTree: (state, action: { payload: Folder[] }) => {
      state.folderTree = action.payload;
    },
    setPages: (state, action: { payload: Page[] }) => {
      state.pages = action.payload;
    },
    setCurrentPage: (state, action: { payload: Page }) => {
      state.currentPage = action.payload;
    },
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
    setLoading: (state, action: { payload: boolean }) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setFolderTree,
  setPages,
  setCurrentPage,
  clearCurrentPage,
  setLoading,
} = pageSlice.actions;
export default pageSlice.reducer;
