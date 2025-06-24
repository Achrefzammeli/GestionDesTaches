// src/redux/features/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
});

export const { setTasks, setError, clearTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
