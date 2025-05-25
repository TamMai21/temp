import React, { useContext, useEffect } from 'react'
import '../pages/MenuList.css'
import { useNavigate } from 'react-router-dom';

const ProductCard = (props) => {
    let { task } = props;
    const navigate = useNavigate()
    useEffect(() => {
        console.log('task in the card: ', task);

    }, [])
    return (
        <div className="card mb-3 shadow-sm">
            <div className="row g-0">
                {/* Ảnh bên trái */}
                <div className="col-md-4">
                    <img
                        src={task.image}
                        className="img-fluid rounded-start"
                        alt={task.title}
                        style={{ height: '100%', objectFit: 'cover' }}
                    />
                </div>

                {/* Nội dung bên phải */}
                <div className="col-md-8">
                    <div className="card-body text-start">
                        <h5 className="card-title text-primary">{task.title}</h5>
                        <p className="card-text mb-1">
                            <strong>Trạng thái:</strong>{' '}
                            <span className={task.status ? 'text-success' : 'text-danger'}>
                                {task.status ? 'Hoàn thành' : 'Chưa hoàn thành'}
                            </span>
                        </p>
                        <p className="card-text">
                            <small className="text-muted">Ngày tạo: {new Date(task.createdAt).toLocaleDateString()}</small>
                        </p>
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => navigate(`/task/${task.id}`)}
                        >
                            Chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard
