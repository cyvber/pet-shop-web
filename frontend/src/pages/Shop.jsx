import React, { useContext } from 'react';
import Carousel from '../components/logo_carousel/Carousel';
import Popular from '../components/popular/Popular';
import Banner from '../components/mid_banner/Banner';
import PopularDiscount from '../components/on_discount/PopularDiscount';
import BestSeller from '../components/bestSeller/BestSeller';
import { ShopContext } from '../context/ShopContext';

import './css/Shop.css';
import Popup from '../components/popup/Popup';

const Shop = () => {
    const { all_products } = useContext(ShopContext);

    // Check if there are best sellers and discounted items
    const hasBestSellers = all_products.some((product) => product.best_seller);
    const hasDiscountItems = all_products.some((product) => product.on_discount);

    return (
        <div className='shop-page'>
            <Carousel />
            <Popup page="shop" />
            {/* If there are best sellers or discounts, display them. Otherwise, show default */}
            {hasBestSellers || hasDiscountItems ? (
                <>
                    {hasDiscountItems && <PopularDiscount name="מבצעים" />}
                    {hasBestSellers && <BestSeller />}
                </>
            ) : (
                <Popular category="dog" name="כלבים" />
            )}

            <Banner />
            <Popular category="cat" name="חתולים" />
        </div>
    );
};

export default Shop;
