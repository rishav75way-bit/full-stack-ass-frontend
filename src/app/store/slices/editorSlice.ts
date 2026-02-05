import { createSlice } from '@reduxjs/toolkit';

export interface EditingUser {
  userId: string;
  firstName: string;
  lastName: string;
}

interface EditorState {
  editingUsers: EditingUser[];
  isDirty: boolean;
}

const initialState: EditorState = {
  editingUsers: [],
  isDirty: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    addEditingUser: (state, action: { payload: EditingUser }) => {
      const exists = state.editingUsers.find(
        (u) => u.userId === action.payload.userId
      );
      if (!exists) {
        state.editingUsers.push(action.payload);
      }
    },
    removeEditingUser: (state, action: { payload: string }) => {
      state.editingUsers = state.editingUsers.filter(
        (u) => u.userId !== action.payload
      );
    },
    setIsDirty: (state, action: { payload: boolean }) => {
      state.isDirty = action.payload;
    },
  },
});

export const { addEditingUser, removeEditingUser, setIsDirty } =
  editorSlice.actions;
export default editorSlice.reducer;
