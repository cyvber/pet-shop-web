// Cart.jsx
import React, { useContext } from 'react';
import CartItems from '../components/cartItems/CartItems';
import Checkout from '../components/checkout/Checkout';
import { ShopContext } from '../context/ShopContext';
import './css/Cart.css';
import Popup from '../components/popup/Popup';

import PlaceOrder from '../components/placeOrder/PlaceOrder';

const Cart = () => {
 
    return (
        <div className='mycart'>
            <h1>הסל שלי</h1>
            <p className="order-process-message">
                <span>תשומת לב!</span>
                האתר שלנו אינו תומך כרגע בשערי תשלום. אנא בחרו את המוצרים הרצויים, מלאו את פרטי הקשר שלכם והשלימו את ההזמנה. אנו ניצור איתכם קשר בנוגע לאפשרויות התשלום.
            </p>
            <CartItems />
            
        </div>
    );
};

export default Cart;
