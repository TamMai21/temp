import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTasks, updateTask } from '../redux/slice/taskSlice'
import useTask from '../custom/useTask';

const EditModal = ({ show, onHide, taskId, onSuccess }) => {
    const { tasks, loading, error, editTask, loadTasks } = useTask();
    const task = tasks.find(t => t.id == taskId);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        status: false
    });

    const [formErrors, setFormErrors] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [keepCurrentImage, setKeepCurrentImage] = useState(true);

    useEffect(() => {
        if (tasks.length === 0) {
            loadTasks();
        }
    }, [loadTasks, tasks.length]);

    useEffect(() => {
        if (task && show) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                image: task.image || '',
                status: task.status || false
            });
            // Set preview for existing image
            if (task.image) {
                setImagePreview(task.image);
                setKeepCurrentImage(true);
            }
        }
    }, [task, show]);

    // Reset form when modal is closed
    useEffect(() => {
        if (!show) {
            // Clean up preview URL if it's a blob URL
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            // Reset form state
            setFormData({
                title: '',
                description: '',
                image: '',
                status: false
            });
            setFormErrors({});
            setSelectedFile(null);
            setImagePreview('');
            setKeepCurrentImage(true);
        }
    }, [show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Chỉ chấp nhận các file ảnh: JPG, JPEG, PNG, GIF, WEBP');
                e.target.value = '';
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('Kích thước file không được vượt quá 5MB');
                e.target.value = '';
                return;
            }

            setSelectedFile(file);
            setKeepCurrentImage(false);

            // Create image path for saving to database
            const imagePath = `img/${file.name}`;
            setFormData(prev => ({
                ...prev,
                image: imagePath
            }));

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setSelectedFile(null);
            // If clearing file input, revert to original image if exists
            if (task && task.image) {
                setKeepCurrentImage(true);
                setImagePreview(task.image);
                setFormData(prev => ({
                    ...prev,
                    image: task.image
                }));
            } else {
                setImagePreview('');
                setFormData(prev => ({
                    ...prev,
                    image: ''
                }));
            }
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = 'Tiêu đề là bắt buộc';
        } else if (formData.title.trim().length < 3) {
            errors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
        }

        if (!formData.description.trim()) {
            errors.description = 'Mô tả là bắt buộc';
        } else if (formData.description.trim().length < 10) {
            errors.description = 'Mô tả phải có ít nhất 10 ký tự';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!task || !task.id) {
            console.error('Task not found');
            return;
        }

        try {
            const updatedTask = {
                ...task,
                title: formData.title.trim(),
                description: formData.description.trim(),
                image: formData.image,
                status: formData.status,
                updatedAt: new Date().toISOString()
            };

            await editTask(task.id, updatedTask).unwrap();

            // Clean up preview URL if it's a blob URL
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }

            // Call success callback and close modal
            if (onSuccess) {
                onSuccess(updatedTask);
            }
            onHide();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleCancel = () => {
        // Clean up preview URL if it's a blob URL
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        onHide();
    };

    const removeImage = () => {
        setSelectedFile(null);
        setKeepCurrentImage(false);
        setFormData(prev => ({
            ...prev,
            image: ''
        }));

        // Clean up preview URL if it's a blob URL
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview('');

        // Reset file input
        const fileInput = document.getElementById('image');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const resetToOriginalImage = () => {
        setSelectedFile(null);
        setKeepCurrentImage(true);

        // Clean up current preview URL if it's a blob URL
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }

        if (task && task.image) {
            setFormData(prev => ({
                ...prev,
                image: task.image
            }));
            setImagePreview(task.image);
        } else {
            setFormData(prev => ({
                ...prev,
                image: ''
            }));
            setImagePreview('');
        }

        // Reset file input
        const fileInput = document.getElementById('image');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    if (!show) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="modal fade show"
                style={{ display: 'block' }}
                tabIndex="-1"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        handleCancel()
                    }
                }}
            >
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header bg-warning text-dark">
                            <h5 className="modal-title">
                                <i className="bi bi-pencil-square me-2"></i>
                                Sửa công việc
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCancel}
                                disabled={loading}
                            ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                            {loading && (
                                <div className="d-flex justify-content-center mb-3">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {typeof error === 'string' ? error : 'Có lỗi xảy ra khi cập nhật công việc'}
                                </div>
                            )}

                            {!task ? (
                                <div className="alert alert-warning" role="alert">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    Không tìm thấy công việc.
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">
                                            Tiêu đề <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Nhập tiêu đề công việc"
                                            disabled={loading}
                                        />
                                        {formErrors.title && (
                                            <div className="invalid-feedback">
                                                {formErrors.title}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">
                                            Mô tả <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                                            id="description"
                                            name="description"
                                            rows="4"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Nhập mô tả chi tiết về công việc"
                                            disabled={loading}
                                        />
                                        {formErrors.description && (
                                            <div className="invalid-feedback">
                                                {formErrors.description}
                                            </div>
                                        )}
                                        <div className="form-text">
                                            {formData.description.length}/500 ký tự
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">
                                            Hình ảnh
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            name="image"
                                            onChange={handleFileChange}
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            disabled={loading}
                                        />
                                        <div className="form-text">
                                            Chọn file ảnh mới (JPG, JPEG, PNG, GIF, WEBP) - Tối đa 5MB
                                            {task && task.image && keepCurrentImage && !selectedFile && (
                                                <div className="mt-1">
                                                    <span className="badge bg-info me-2">
                                                        <i className="bi bi-image me-1"></i>
                                                        Ảnh hiện tại: {task.image}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedFile && (
                                                <div className="mt-1">
                                                    <span className="badge bg-success me-2">
                                                        <i className="bi bi-check-circle me-1"></i>
                                                        Ảnh mới: {selectedFile.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary btn-sm me-2"
                                                        onClick={resetToOriginalImage}
                                                        disabled={loading}
                                                    >
                                                        <i className="bi bi-arrow-counterclockwise"></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={removeImage}
                                                        disabled={loading}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="status"
                                                name="status"
                                                checked={formData.status}
                                                onChange={handleChange}
                                                disabled={loading}
                                            />
                                            <label className="form-check-label" htmlFor="status">
                                                Đánh dấu là đã hoàn thành
                                            </label>
                                        </div>
                                    </div>

                                    {/* Preview image */}
                                    {imagePreview && (
                                        <div className="mb-3">
                                            <label className="form-label">Preview hình ảnh:</label>
                                            <div className="text-center">
                                                <img
                                                    src={imagePreview.startsWith('blob:') ? imagePreview : `/${imagePreview}`}
                                                    alt="Preview"
                                                    className="img-thumbnail"
                                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none'
                                                    }}
                                                    onLoad={(e) => {
                                                        e.target.style.display = 'block'
                                                    }}
                                                />
                                                <div className="form-text mt-2">
                                                    {selectedFile ? (
                                                        <>Đường dẫn mới: <code>{formData.image}</code></>
                                                    ) : (
                                                        <>Đường dẫn hiện tại: <code>{formData.image}</code></>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Help section */}
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <h6 className="card-title">
                                                <i className="bi bi-info-circle me-2"></i>
                                                Hướng dẫn:
                                            </h6>
                                            <ul className="list-unstyled mb-0">
                                                <li><i className="bi bi-check text-success me-2"></i>Tiêu đề và mô tả là bắt buộc</li>
                                                <li><i className="bi bi-check text-success me-2"></i>Tiêu đề tối thiểu 3 ký tự</li>
                                                <li><i className="bi bi-check text-success me-2"></i>Mô tả tối thiểu 10 ký tự</li>
                                                <li><i className="bi bi-check text-success me-2"></i>Chọn ảnh mới hoặc giữ ảnh hiện tại</li>
                                                <li><i className="bi bi-check text-success me-2"></i>Ảnh mới sẽ được lưu với đường dẫn /img/tên_file</li>
                                            </ul>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {task && (
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    <i className="bi bi-x-circle me-1"></i>
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.title.trim() || !formData.description.trim()}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-1"></i>
                                            Lưu thay đổi
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    )
}

export default EditModal