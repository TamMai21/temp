import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div>
            NOT FOUND
            <button className='btn btn-primary' onClick={() => navigate('/')}>BACK TO HOME</button>
        </div>
    )
}

export default NotFound
