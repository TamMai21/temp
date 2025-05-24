import React, { useContext, useEffect, useState } from 'react'
import './MenuList.css'

const Cart = () => {

    let [cart, setCart] = useState([])
    useEffect(() => {
        console.log('dataCart: ', dataCart);
        let dataFinal = processCartData(dataCart)
        setCart(dataCart)
    }, [dataCart])

    const processCartData = (originalArray) => {    //chuyen thanh dang cart voi quantity
        const itemMap = new Map();
        originalArray.forEach(item => {
            const key = JSON.stringify({
                id: item.id,
                title: item.title,
                content: item.content,
                img: item.img
            });

            if (itemMap.has(key)) {
                itemMap.get(key).quantity++;
            } else {
                itemMap.set(key, { ...item, quantity: 1 });
            }
        });

        return Array.from(itemMap.values());
    };

    return (
        <div style={{ minHeight: "60vh" }}>
            {cart && cart.length !== 0 && cart.map((item, index) => {
                return (
                    <div className="col-5 d-flex item">
                        {/* <img src={`/${item.img}`} className='w-100 h-100' alt="" />
                        <p className="h6">{item.title}</p>
                        <p>{item.content}</p> */}

                        <div className="col-3">
                            <img src={item.img} className='img-item' alt="" />
                        </div>
                        <div className="col-9 px">
                            <p className="h6 title-item" onClick={() => navigate(`/detail/${item.id}`)}>{item.title}</p>
                            <p className='content-item'>{item.content}</p>
                            <p className='content-item'>Quantity: {item.quantity}</p>
                            <button className="btn btn-primary" onClick={() => remove(item)} >REMOVE</button>
                            <button className="btn btn-primary" onClick={() => decrease(item)} >DECREASE</button>
                        </div>
                    </div>

                )
            })}
        </div>
    )
}

export default Cart
