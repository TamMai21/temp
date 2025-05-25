import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    clearError
} from '../redux/slice/taskSlice';
import {
    fetchCompletedTasks,
    addCompletedTask,
    updateCompletedTask,
    deleteCompletedTask,
    restoreCompletedTask,
    clearCompletedError
} from '../redux/slice/doSlice';

const useTask = () => {
    const dispatch = useDispatch();

    // Lấy state từ Redux store với fallback values
    const { data = [], loading, error } = useSelector(state => state.tasks || {});
    const {
        data: completedTasks = [],
        loading: completedLoading,
        error: completedError
    } = useSelector(state => state.completedTasks || {});

    // ========== REGULAR TASKS ==========
    // Hàm tạo task mới
    const createTask = useCallback((taskData) => {
        return dispatch(addTask(taskData));
    }, [dispatch]);

    // Hàm chỉnh sửa task
    const editTask = useCallback((id, taskData) => {
        return dispatch(updateTask({ id, taskData }));
    }, [dispatch]);

    // Hàm xóa task
    const removeTask = useCallback((id) => {
        return dispatch(deleteTask(id));
    }, [dispatch]);

    // Hàm tải danh sách tasks
    const loadTasks = useCallback(() => {
        return dispatch(fetchTasks());
    }, [dispatch]);

    // Hàm xóa lỗi
    const clearTaskError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Hàm tìm task theo ID
    const findTaskById = useCallback((id) => {
        return data.find(t => t.id == id);
    }, [data]);

    // ========== COMPLETED TASKS ==========
    // Hàm hoàn thành task - chuyển từ tasks sang completedTasks
    const markTaskComplete = useCallback(async (id) => {
        try {
            // Tìm task cần hoàn thành
            const taskToComplete = data.find(t => t.id == id);
            if (!taskToComplete) {
                throw new Error('Task not found');
            }

            // Thêm vào completedTasks
            await dispatch(addCompletedTask(taskToComplete)).unwrap();

            // Xóa khỏi tasks
            await dispatch(deleteTask(id)).unwrap();

            return { success: true, completedTask: taskToComplete };
        } catch (error) {
            throw error;
        }
    }, [dispatch, data]);

    // Hàm tải danh sách completed tasks
    const loadCompletedTasks = useCallback(() => {
        return dispatch(fetchCompletedTasks());
    }, [dispatch]);

    // Hàm chỉnh sửa completed task
    const editCompletedTask = useCallback((id, taskData) => {
        return dispatch(updateCompletedTask({ id, taskData }));
    }, [dispatch]);

    // Hàm xóa completed task
    const removeCompletedTask = useCallback((id) => {
        return dispatch(deleteCompletedTask(id));
    }, [dispatch]);

    // Hàm khôi phục completed task về tasks
    const restoreTask = useCallback(async (id) => {
        try {
            // Lấy thông tin task từ completed tasks
            const result = await dispatch(restoreCompletedTask(id)).unwrap();
            const restoredTask = {
                ...result.restoredTask,
                status: false,
                updatedAt: new Date().toISOString()
            };

            // Thêm lại vào tasks với status = false
            await dispatch(addTask(restoredTask)).unwrap();

            return { success: true, restoredTask };
        } catch (error) {
            throw error;
        }
    }, [dispatch]);

    // Hàm tìm completed task theo ID
    const findCompletedTaskById = useCallback((id) => {
        return completedTasks.find(t => t.id == id);
    }, [completedTasks]);

    // Hàm xóa lỗi completed tasks
    const clearCompletedTaskError = useCallback(() => {
        dispatch(clearCompletedError());
    }, [dispatch]);

    // Trả về object chứa các state và functions
    return {
        // Regular Tasks State
        tasks: data,
        loading,
        error,

        // Completed Tasks State
        completedTasks,
        completedLoading,
        completedError,

        // Regular Tasks Actions
        createTask,
        editTask,
        removeTask,
        loadTasks,
        clearTaskError,
        findTaskById,

        // Completed Tasks Actions
        markTaskComplete,
        loadCompletedTasks,
        editCompletedTask,
        removeCompletedTask,
        restoreTask,
        findCompletedTaskById,
        clearCompletedTaskError
    };
};

export default useTask;