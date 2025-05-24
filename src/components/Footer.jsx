import React from 'react'
import './Footer.css'

const Footer = () => {
    return (
        <footer className='w-100 footer justify-content-evenly bg-dark d-flex text-light text-left'>
            <div className="col-3">
                <p className="h5">About</p>
                <ul className='ulfooter d-flex flex-column'>
                    <li className='item-header'>Student name: Mai CHi TAm</li>
                    <li className='item-header'>Student ID: </li>
                </ul>
            </div>
            <div className="col-3">
                <p className="h5">Midterm Exam</p>
                <ul className='ulfooter d-flex flex-column'>
                    <li className='item-header'>Application interface development</li>
                    <li className='item-header'>Date 26/03/2025</li>
                </ul>
            </div>
            <div className="col-3">
                <p className="h5">Class</p>
                <ul className='ulfooter d-flex flex-column'>
                    <li className='item-header'>Class name</li>
                    <li className='item-header'>DHKTPM18A</li>
                    <li className='item-header'>Class ID: 451a15415415415</li>
                </ul>
            </div>
            <div className="col-3">
                <p className="h5">Contact</p>
                <ul className='ulfooter d-flex flex-column'>
                    <li className='item-header'>Email: abc@gmail.com</li>
                    <li className='item-header'>Phone: 041525415514</li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer
