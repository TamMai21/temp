import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://67d6a512286fdac89bc28e08.mockapi.io/onck';          //json serrver
// https://67d6a512286fdac89bc28e08.mockapi.io/onck     //mock

// Fetch all tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Update task (for editing)
export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, taskData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, taskData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Complete task
export const completeTask = createAsyncThunk('tasks/completeTask', async (id, { rejectWithValue }) => {
    try {
        // Fetch current task first to get all data
        const currentTask = await axios.get(`${API_URL}/${id}`);
        console.log('currentTask in slice: ', id, currentTask);

        const response = await axios.put(`${API_URL}/${id}`, {
            ...currentTask.data,
            status: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Add new task
export const addTask = createAsyncThunk('tasks/addTask', async (taskData, { rejectWithValue }) => {
    try {
        const newTask = {
            ...taskData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const response = await axios.post(API_URL, newTask);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Delete task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Update task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.data.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Add task
            .addCase(addTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.loading = false;
                state.data.push(action.payload);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Complete task
            .addCase(completeTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(completeTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.data.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(completeTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Delete task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter(task => task.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;