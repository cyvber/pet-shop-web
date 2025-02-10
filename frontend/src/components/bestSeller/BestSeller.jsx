import React, { useContext } from 'react';
import './BestSeller.css';
import Item from '../item/Item';
import { ShopContext } from '../../context/ShopContext';


const BestSeller = () => {
    const { all_products } = useContext(ShopContext);

    // Filter for products of the input category, on discount, and limit to 8
    const filteredProducts = all_products
    .filter((item) => item.best_seller && item.available) // Best sellers and available items
    .slice(0, 8); // Limit to 8 products

    return (
        <div className='popular'>
            <h1>המוצרים הנמכרים ביותר</h1> {/* Dynamically set the title */}
            <hr />
            <div className="popular-item">
                {filteredProducts.map((item) => (
                    item.available && (
                        <Item
                            key={item.id}
                            id={item.id}
                            brand={item.brand}
                            name={item.name}
                            image={item.image}
                            price={item.price}
                            discount_type={item.discount_type}
                            on_discount={item.on_discount} // Pass on_discount to the Item component
                        />
                    )
                ))}
            </div>
        </div>
    );
};

export default BestSeller;
