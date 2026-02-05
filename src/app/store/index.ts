import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';
import pageReducer from './slices/pageSlice';
import editorReducer from './slices/editorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    page: pageReducer,
    editor: editorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
