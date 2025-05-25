import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../slice/TaskSlice';
import completedTaskReducer from '../slice/doSlice'

const store = configureStore({
    reducer: {
        tasks: taskReducer,
        completedTask: completedTaskReducer
    },
});

export default store;