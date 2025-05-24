import React from 'react'
import './Header.css'
import List from '../assets/img/List.jpg'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()
    return (
        <header className='container w-100 justify-content-evenly d-flex bg-dark header'>
            <ul className='ulhead'>
                <li className="item-header">
                    <p className='text-decor-none hover' onClick={() => navigate("/")}>Home</p>
                </li>
                <li className="item-header">
                    <p className='text-decor-none hover' onClick={() => navigate("/menu")}>Task management</p>
                </li>
                {/* <li className="item-header">
                    <p className='text-decor-none hover' onClick={() => navigate("/")}>Master Chefs</p>
                </li>
                <li className="item-header">
                    <p className='text-decor-none hover' onClick={() => navigate("/")}>Packs</p>
                </li>
                <li className="item-header">
                    <p className='text-decor-none hover' onClick={() => navigate("/")}>Contact us</p>
                </li> */}
                <li className="item-header cart">
                    <p className='text-decor-none' onClick={() => navigate("/cart")}>
                        <button className="btn">
                            <img src={List} alt="" className='img-cart' />
                        </button>
                    </p>
                </li>
            </ul>

        </header>
    )
}

export default Header
