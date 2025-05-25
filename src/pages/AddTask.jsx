import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addTask, fetchTasks } from '../redux/slice/taskSlice'
import useTask from '../custom/useTask'

const AddTask = () => {
    const navigate = useNavigate();
    const { loading, error, createTask, loadTasks } = useTask();

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        image: '',
        status: false
    });

    const [formErrors, setFormErrors] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

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
            setImagePreview('');
            setFormData(prev => ({
                ...prev,
                image: ''
            }));
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

        try {
            let dataDB = await loadTasks().unwrap();
            const taskData = {
                id: dataDB.length + 1 + "",
                title: formData.title.trim(),
                description: formData.description.trim(),
                image: formData.image, // This will be '/img/filename.ext' format
                status: formData.status
            };

            const result = await createTask(taskData).unwrap();

            // Clean up preview URL
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }

            // Redirect to detail page of newly created task
            navigate(`/task/${result.id}`);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleCancel = () => {
        // Clean up preview URL
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        navigate('/');
    };

    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            image: '',
            status: false
        });
        setFormErrors({});
        setSelectedFile(null);

        // Clean up preview URL
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview('');

        // Reset file input
        const fileInput = document.getElementById('image');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        setFormData(prev => ({
            ...prev,
            image: ''
        }));

        // Clean up preview URL
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview('');

        // Reset file input
        const fileInput = document.getElementById('image');
        if (fileInput) {
            fileInput.value = '';
        }
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white">
                            <h3 className="card-title mb-0">
                                <i className="bi bi-plus-circle me-2"></i>
                                Thêm công việc mới
                            </h3>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {typeof error === 'string' ? error : 'Có lỗi xảy ra khi thêm công việc'}
                                </div>
                            )}

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
                                        Chọn file ảnh (JPG, JPEG, PNG, GIF, WEBP) - Tối đa 5MB
                                        {selectedFile && (
                                            <div className="mt-1">
                                                <span className="badge bg-success me-2">
                                                    <i className="bi bi-check-circle me-1"></i>
                                                    {selectedFile.name}
                                                </span>
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

                                {/* Preview image if selected */}
                                {imagePreview && (
                                    <div className="mb-3">
                                        <label className="form-label">Preview hình ảnh:</label>
                                        <div className="text-center">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="img-thumbnail"
                                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                                            />
                                            <div className="form-text mt-2">
                                                Đường dẫn sẽ lưu: <code>{formData.image}</code>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="d-flex gap-2 justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handleReset}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-arrow-clockwise me-1"></i>
                                        Đặt lại
                                    </button>
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
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || !formData.title.trim() || !formData.description.trim()}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Đang thêm...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-1"></i>
                                                Thêm công việc
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Help section */}
                    <div className="card mt-4">
                        <div className="card-body">
                            <h6 className="card-title">
                                <i className="bi bi-info-circle me-2"></i>
                                Hướng dẫn:
                            </h6>
                            <ul className="list-unstyled mb-0">
                                <li><i className="bi bi-check text-success me-2"></i>Tiêu đề và mô tả là bắt buộc</li>
                                <li><i className="bi bi-check text-success me-2"></i>Tiêu đề tối thiểu 3 ký tự</li>
                                <li><i className="bi bi-check text-success me-2"></i>Mô tả tối thiểu 10 ký tự</li>
                                <li><i className="bi bi-check text-success me-2"></i>Hình ảnh là tùy chọn (JPG, PNG, GIF, WEBP - tối đa 5MB)</li>
                                <li><i className="bi bi-check text-success me-2"></i>Hình ảnh sẽ được lưu với đường dẫn /img/tên_file</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddTask