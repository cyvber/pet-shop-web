import React from 'react';
import Carousel from '../components/logo_carousel/Carousel';
import Popular from '../components/popular/Popular';
import Banner from '../components/mid_banner/Banner';
import PopularDiscount from '../components/on_discount/PopularDiscount';

import './css/Shop.css';

const Shop = () => {
    return (
        <div className='shop-page'>
            <Carousel />
            <PopularDiscount name="מבצעים"/>
            <Banner />
            <Popular category="cat" name="חתולים"/>
        </div>
    );
};

export default Shop;