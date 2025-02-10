import React, { useState, useEffect } from 'react';
import whatsapp_icon from '../assets/frontend_assets/whatsapp.png';
import './Popup.css';

const Popup = ({ page }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem(`popupSeen_${page}`);

        if (!hasSeenPopup) {
            const timeout = setTimeout(() => {
                setIsVisible(true);
            }, 5000); // Show popup after 5 seconds

            return () => clearTimeout(timeout); // Cleanup if user leaves before 5s
        }
    }, [page]);

    useEffect(() => {
        const clearAllPopupSeen = () => {
            Object.keys(localStorage).forEach((key) => {
                if (key.startsWith("popupSeen_")) {
                    localStorage.removeItem(key);
                }
            });
        };
    
        window.addEventListener("beforeunload", clearAllPopupSeen);
        return () => window.removeEventListener("beforeunload", clearAllPopupSeen);
    }, []);
    

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem(`popupSeen_${page}`, "true");
    };

    return (
        isVisible && (
            <div className="popup-overlay">
                <div className="popup">
                    <span onClick={handleClose}>&times;</span>
                    <h3>נא לקרוא!</h3>
                    <p>אנו מקבלים הזמנות כרגע דרך וואטסאפ! עיינו במוצרים שלנו ושלחו לנו את ההזמנה בקלות.</p>
                    <div className="popup-contact">
                        <a href="https://wa.me/972525330412" target="_blank" rel="noopener noreferrer">
                            <img src={whatsapp_icon} alt="whatsapp" /> Whatsapp
                        </a>
                    </div>
                </div>
            </div>
        )
    );
};

export default Popup;
