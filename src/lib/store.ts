/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import {
  configureStore,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";

type Task = {
  id: string;
  title: string;
  state: string;
};

// Define a type for the slice state
export type TaskBoxState = {
  tasks: Task[];
  status: string;
  error: string | null;
};

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const defaultTasks: Task[] = [
  { id: "1", title: "Something", state: "TASK_INBOX" },
  { id: "2", title: "Something more", state: "TASK_INBOX" },
  { id: "3", title: "Something else", state: "TASK_INBOX" },
  { id: "4", title: "Something again", state: "TASK_INBOX" },
];
const TaskBoxData: TaskBoxState = {
  tasks: defaultTasks,
  status: "idle",
  error: null,
};

type FetchedTask = {
  id: string;
  title: string;
  completed: boolean;
};

/*
 * Creates an asyncThunk to fetch tasks from a remote endpoint.
 * You can read more about Redux Toolkit's thunks in the docs:
 * https://redux-toolkit.js.org/api/createAsyncThunk
 */
export const fetchTasks = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos?userId=1"
  );
  const data = await response.json();
  const result = data.map((task: FetchedTask) => ({
    id: `${task.id}`,
    title: task.title,
    state: task.completed ? "TASK_ARCHIVED" : "TASK_INBOX",
  }));
  return result;
});

/*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
  name: "taskbox",
  initialState: TaskBoxData,
  reducers: {
    updateTaskState: (
      state,
      action: PayloadAction<{ id: string; newTaskState: string }>
    ) => {
      const { id, newTaskState } = action.payload;
      const task = state.tasks.findIndex((task) => task.id === id);
      if (task >= 0) {
        state.tasks[task].state = newTaskState;
      }
    },
  },
  /*
   * Extends the reducer for the async actions
   * You can read more about it at https://redux-toolkit.js.org/api/createAsyncThunk
   */
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.status = "loading";
      state.error = null;
      state.tasks = [];
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      // Add any fetched tasks to the array
      state.tasks = action.payload;
    });
    builder.addCase(fetchTasks.rejected, (state) => {
      state.status = "failed";
      state.error = "Something went wrong";
      state.tasks = [];
    });
  },
});

// The actions contained in the slice are exported for usage in our components
export const { updateTaskState } = TasksSlice.actions;

/*
 * Our app's store configuration goes here.
 * Read more about Redux's configureStore in the docs:
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});

export default store;

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
