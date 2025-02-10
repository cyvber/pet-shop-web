import React, { useContext, useState, useEffect } from 'react';
import './css/ShopCategory.css';
import './css/Loader.css';
import { ShopContext } from '../context/ShopContext';
import Item from '../components/item/Item';
import { useLocation } from 'react-router-dom';

const ShopCategory = (props) => {
  const { all_products, productType } = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const filteredProducts = all_products.filter((item) => {
    return (
      props.category === item.category &&
      (!productType || productType === item.product_type) &&
      (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  });

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      !isLoading &&
      visibleProducts < filteredProducts.length
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleProducts((prev) => prev + 12);
        setIsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleProducts, isLoading, filteredProducts]);

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/dog') return 'מוצרים כלבים';
    if (path === '/dog/food') return 'אוכל כלבים';
    if (path === '/dog/equipment') return 'ציוד כלבים';
    if (path === '/cat') return 'מוצרים חתולים';
    if (path === '/cat/food') return 'אוכל חתולים';
    if (path === '/cat/equipment') return 'ציוד חתולים';
    if (path === '/bird') return 'מוצרים צפורים';
    return 'Products';
  };

  return (
    <div className="category">
      <div className="category-banner">
        <div className="category-gradient">
          <h1 className='category-title'>{getTitle()}</h1>
        </div>
        <img src={props.banner} alt="Category" className="category-banner-image" />
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="חפש לפי מזהה, שם או מותג..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="product-count">
          {filteredProducts.length} מוצרים
        </div>
      </div>

      <div className="content-container">
        <div className="category-products">
          {filteredProducts.length > 0 ? (
            filteredProducts.slice(0, visibleProducts).map((item) => (
              item.available && (
                <Item
                  key={item.id}
                  id={item.id}
                  brand={item.brand}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  discount_type={item.discount_type}
                  on_discount={item.on_discount}
                />
              )
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

export default ShopCategory;
