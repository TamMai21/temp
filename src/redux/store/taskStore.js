import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../slice/TaskSlice';

const store = configureStore({
    reducer: {
        tasks: taskReducer,
    },
});

export default store;