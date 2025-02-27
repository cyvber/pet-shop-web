import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/ShopBrand.css';
import './css/Loader.css';
import { ShopContext } from '../context/ShopContext';
import Item from '../components/item/Item';

const ShopBrand = () => {
    const { brandName } = useParams();
    const { all_products, all_brands } = useContext(ShopContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [visibleProducts, setVisibleProducts] = useState(12); // Number of products to show initially
    const [isLoading, setIsLoading] = useState(false);
    const selectedBrand = all_brands.find((brand) => brand.name === brandName)
    // Filter products by brand and search term
    const filteredProducts = all_products.filter((item) => {
        return (
            item.brand === brandName &&
            (
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toString().includes(searchTerm) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        );
    });

    // Infinite scrolling logic
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 50 &&
            !isLoading &&
            visibleProducts < filteredProducts.length
        ) {
            setIsLoading(true);
            setTimeout(() => {
                setVisibleProducts((prev) => prev + 12); // Load 12 more products
                setIsLoading(false);
            }, 500);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [visibleProducts, isLoading, filteredProducts]);

    return (
        <div className="brand">
            <div className="brand-title">
                <h1>מוצרים של</h1>
                <p>{brandName}</p>
            </div>
            {selectedBrand && <p className='brand-description'>{selectedBrand.description}</p>}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="חפש לפי מזהה, שם או תיאור..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <div className="product-count">
                    {filteredProducts.length} מוצרים
                </div>
            </div>
            <div className="content-container">
                <div className="brand-products">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.slice(0, visibleProducts).map((item, i) => (
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
                        ))
                    ) : (
                        <p className="no-results">לא נמצאו מוצרים התואמים לחיפוש שלך.</p>
                    )}
                </div>

            </div>
                  {/* "Scroll for more products" message */}
            {!isLoading && visibleProducts < filteredProducts.length && (
                <p className="scroll-message">⬇️ גלול למטה כדי לראות מוצרים נוספים ⬇️</p>
            )}
            {isLoading && <p className="loader"></p>}
        </div>
    );
};

export default ShopBrand;
