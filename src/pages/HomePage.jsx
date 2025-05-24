import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HomePageIMG from '../assets/img/51168.jpg'
import './HomePage.css'
import { Outlet } from 'react-router-dom'

const HomePage = () => {
    return (
        <div className='d-flex flex-column'>
            <Header />
            <section className='homepage'>
                <img src={HomePageIMG} className='img-homepage' alt="" />
                <Outlet />
            </section>
            <Footer />
        </div>
    )
}

export default HomePage
