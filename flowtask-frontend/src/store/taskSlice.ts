import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  userId: number;
}

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "tasks",

  initialState,

  reducers: {
    setTasks: (
      state,
      action: PayloadAction<Task[]>
    ) => {
      state.tasks = action.payload;
    },

    addTask: (
      state,
      action: PayloadAction<Task>
    ) => {
      state.tasks.unshift(action.payload);
    },

    removeTask: (
      state,
      action: PayloadAction<number>
    ) => {
      state.tasks = state.tasks.filter(
        (task) => task.id !== action.payload
      );
    },

    updateTask: (
      state,
      action: PayloadAction<Task>
    ) => {
      const index = state.tasks.findIndex(
        (task) =>
          task.id === action.payload.id
      );

      if (index !== -1) {
        state.tasks[index] =
          action.payload;
      }
    },
  },
});

export const {
  setTasks,
  addTask,
  removeTask,
  updateTask,
} = taskSlice.actions;

export default taskSlice.reducer;