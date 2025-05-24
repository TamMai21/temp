import React, { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HomePageIMG from '../assets/img/51168.jpg'
import './MenuList.css'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

import { useSelector, useDispatch } from 'react-redux'
import { fetchTasks } from '../redux/slice/taskSlice'

const MenuList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // ✅ Lấy state từ Redux store
    const { data, loading, error } = useSelector((state) => state.tasks)

    useEffect(() => {
        dispatch(fetchTasks())
    }, [dispatch])

    const handleAddTask = () => {
        navigate('/add')
    }

    return (
        <div className='menu-list d-block'>
            {/* <img src={HomePageIMG} className='img-menu' alt="" /> */}
            <div className="list">
                <p className="h4 text-center">Task management</p>
                <p className="h2 text-center text-dark">TASKS AVAILBLE</p>
                <div className="col-4 mx-auto row box">
                    <button onClick={handleAddTask}>ADD TASK</button>
                    {/* <div className="col-4 bg-yellow px">
                        BAKERY
                    </div>
                    <div className="col-4 px">
                        WEDDING
                    </div>
                    <div className="col-4 px">
                        CUSTOM
                    </div> */}
                </div>
                {/* ✅ Hiển thị trạng thái loading/error */}
                {loading && <p className='text-center text-info'>Loading...</p>}
                {error && <p className='text-center text-danger'>Error: {error}</p>}

                <div className="d-flex justify-content-between flex-column">
                    {
                        data && data.length !== 0 && data.map((item, index) => (
                            <ProductCard task={item} key={index} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default MenuList
