import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import MenuList from '../pages/MenuList'
import Cart from '../pages/Cart'
import Detail from '../pages/Detail'
import Edit from '../pages/Edit'
import AddTask from '../pages/AddTask'

const AppRoute = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage />}>
                <Route path="/add" element={<AddTask />} />
                <Route path='/menu' element={<MenuList />} />
                <Route path='/list' element={<Cart />} />
                <Route path='/task/:id' element={<Detail />} />
                <Route path='/edit/:id' element={<Edit />} />
            </Route>
        </Routes>
    )
}

export default AppRoute
