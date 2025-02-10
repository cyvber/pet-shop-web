import React, { useContext, useRef } from 'react';
import lock_icon from '../assets/frontend_assets/lock-icon.png';
import './PlaceOrder.css';
import DeliveryInfo from '../deliveryInfo/DeliveryInfo';
import { ShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = ({ totalCartValue, isCartEmpty, cartItems }) => {
    const deliveryInfoRef = useRef();
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const {
        clearAllItemsFromCart,
    } = useContext(ShopContext)
    
    const shipping = 35.00;
    const totalPayment = (totalCartValue) => totalCartValue + shipping;

    const handlePlaceOrder = async () => {
        if (!deliveryInfoRef.current || !deliveryInfoRef.current.validate()) {
            return; // Stop if validation fails
        }
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            console.error("Invalid cartItems:", cartItems);
            alert("שגיאה: רשימת העגלה לא תקינה.");
            return;
        }
        
        const contactInfo = deliveryInfoRef.current.getFormData();
        console.log("contactInfo:", contactInfo);
    
        const orderItems = cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            discount_type: item.discount_type || null // Include discount type, default to null if not available
        }));
        
        
        const orderData = {
            contact_info: contactInfo,
            order_items: orderItems,
            total_price: totalPayment(totalCartValue),
        };
        console.log("Sending orderData:", JSON.stringify(orderData, null, 2));
    
        try {
            const response = await fetch(`${API_URL}/api/orders/place-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
    
            if (response.ok) {
                alert('הזמנה בוצעה בהצלחה!');
                clearAllItemsFromCart();
                navigate('/');
                window.scrollTo(0, 0);
                
            } else {
                alert('שגיאה בעת ביצוע ההזמנה.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('שגיאה בשרת. נסה שוב.');
        }
    };
    return (
        <div className="placeorder-section">
            <h2>פרטי משלוח</h2>
            <DeliveryInfo ref={deliveryInfoRef} />

            <div className="order-total">
                <div><span>סה"כ מחיר בעגלה:</span> <span>₪{totalCartValue}</span></div>
                <div><span>סה"כ מחיר משלוח:</span> <span>₪{shipping}</span></div>
                <div className="order-total-payment"><span>סה"כ לתשלום:</span> <span>₪{totalPayment(totalCartValue)}</span></div>
            </div>

            <div className="placeorder-button-container">
                <button className="placeorder-button" disabled={isCartEmpty} onClick={handlePlaceOrder}>
                    להזמין עכשיו
                </button>
            </div>
        </div>
    );
};

export default PlaceOrder;
