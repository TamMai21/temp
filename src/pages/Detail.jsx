import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTasks, completeTask, deleteTask } from '../redux/slice/taskSlice'
import EditModal from './EditModal'

const Detail = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data = [], loading, error } = useSelector(state => state.tasks || {})
    const task = data.find(t => t.id == id)

    const [show, setShow] = useState(false)
    const [taskIdEdit, setTaskIdEdit] = useState()

    useEffect(() => {
        // Luôn fetch tasks khi component mount để đảm bảo có data
        if (data.length === 0) {
            dispatch(fetchTasks())
        }
    }, [dispatch, data.length])

    const handleEdit = (id) => {
        if (task && task.id) {
            // navigate(`/edit/${task.id}`) //dùng cho route
            setTaskIdEdit(id)
            setShow(true)
        } else {
            console.error('Task not found or invalid task ID')
        }
    }

    const handleBack = () => { navigate(`/`) }

    const handleComplete = async () => {
        if (!task || !task.id) {
            console.error('Task not found')
            return
        }

        try {
            console.log('taskID complete: ', task.id);

            let res = await dispatch(completeTask(task.id)).unwrap()
            console.log('Task completed successfully ')
        } catch (error) {
            console.error('Error completing task:', error)
        }
    }

    const handleDelete = async () => {
        if (!task || !task.id) {
            console.error('Task not found')
            return
        }

        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            try {
                await dispatch(deleteTask(task.id)).unwrap()
                navigate('/')
                console.log('Task deleted successfully')
            } catch (error) {
                console.error('Error deleting task:', error)
            }
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>
    if (!task) return <p>Không tìm thấy công việc.</p>

    return (
        <>
            <div className="container py-4">
                <div className="card shadow-lg">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img
                                src={`/${task.image}`}
                                className="img-fluid rounded-start"
                                alt={task.title}
                                onError={(e) => {
                                    e.target.src = '/placeholder.jpg' // Fallback image
                                }}
                            />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h3 className="card-title text-primary">{task.title}</h3>
                                <p className="card-text">{task.description}</p>
                                <p className="card-text mb-1">
                                    <strong>Trạng thái:</strong>{' '}
                                    <span className={task.status ? 'text-success' : 'text-danger'}>
                                        {task.status ? 'Hoàn thành' : 'Chưa hoàn thành'}
                                    </span>
                                </p>
                                <p className="card-text">
                                    <small className="text-muted">
                                        Ngày tạo: {new Date(task.createdAt).toLocaleDateString()}
                                    </small>
                                </p>

                                {/* Các nút chức năng */}
                                <div className="mt-4 d-flex flex-wrap gap-2">
                                    <button className="btn btn-secondary" onClick={() => handleBack()}>
                                        Về trang chủ
                                    </button>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => handleEdit(task.id)}
                                        disabled={loading || !task || !task.id}
                                    >
                                        Sửa
                                    </button>
                                    {!task.status && (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleComplete()}
                                            disabled={loading || !task || !task.id}
                                        >
                                            {loading ? 'Đang xử lý...' : 'Đánh dấu hoàn thành'}
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete()}
                                        disabled={loading || !task || !task.id}
                                    >
                                        {loading ? 'Đang xóa...' : 'Xóa'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditModal
                show={show}
                onHide={() => setShow(false)}
                taskId={taskIdEdit}
                onSuccess={(updatedTask) => {
                    console.log('Task updated:', updatedTask)
                    // Có thể refresh data hoặc update UI
                }}
            />
        </>
    )
}

export default Detail