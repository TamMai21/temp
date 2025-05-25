import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3002/completedTasks';

// Fetch all completed tasks
export const fetchCompletedTasks = createAsyncThunk('completedTasks/fetchCompletedTasks', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Add completed task
export const addCompletedTask = createAsyncThunk('completedTasks/addCompletedTask', async (taskData, { rejectWithValue }) => {
    try {
        const completedTask = {
            ...taskData,
            status: true,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const response = await axios.post(API_URL, completedTask);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Update completed task
export const updateCompletedTask = createAsyncThunk('completedTasks/updateCompletedTask', async ({ id, taskData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, {
            ...taskData,
            updatedAt: new Date().toISOString()
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Delete completed task
export const deleteCompletedTask = createAsyncThunk('completedTasks/deleteCompletedTask', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Restore completed task (move back to tasks)
export const restoreCompletedTask = createAsyncThunk('completedTasks/restoreCompletedTask', async (id, { rejectWithValue }) => {
    try {
        // Get the completed task first
        const completedTaskResponse = await axios.get(`${API_URL}/${id}`);
        const completedTask = completedTaskResponse.data;

        // Delete from completed tasks
        await axios.delete(`${API_URL}/${id}`);

        return { id, restoredTask: completedTask };
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const doSlice = createSlice({
    name: 'completedTasks',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCompletedError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch completed tasks
            .addCase(fetchCompletedTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCompletedTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Add completed task
            .addCase(addCompletedTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCompletedTask.fulfilled, (state, action) => {
                state.loading = false;
                state.data.push(action.payload);
            })
            .addCase(addCompletedTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Update completed task
            .addCase(updateCompletedTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCompletedTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.data.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(updateCompletedTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Delete completed task
            .addCase(deleteCompletedTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCompletedTask.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter(task => task.id !== action.payload);
            })
            .addCase(deleteCompletedTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Restore completed task
            .addCase(restoreCompletedTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(restoreCompletedTask.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter(task => task.id !== action.payload.id);
            })
            .addCase(restoreCompletedTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearCompletedError } = doSlice.actions;
export default doSlice.reducer;