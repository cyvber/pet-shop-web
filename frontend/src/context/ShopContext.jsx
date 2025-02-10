import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const [products, setProducts] = useState([]); // State to store fetched product data
    const [brands, setBrands] = useState([]);
    const [productType, setProductType] = useState(null);
    const [cartItems, setCartItems] = useState(() => {
        // Load initial cart data from localStorage or initialize with an empty object
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : {};
    });

    // Combined data fetching useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const productResponse = await fetch(`${API_URL}/api/products/allproducts`);
                const productData = await productResponse.json();
                setProducts(productData);

                // Fetch brands
                const brandResponse = await fetch(`${API_URL}/api/brands/allbrands`);
                const brandData = await brandResponse.json();
                setBrands(brandData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [API_URL]);

    // Sync cart data with localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // Cart operations
    const addToCart = (itemId, quantity = 1) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + quantity }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
        }));
    };

    const updateCartQuantity = (itemId, newQuantity) => {
        setCartItems((prev) => ({ ...prev, [itemId]: newQuantity }));
    };

    const clearItemFromCart = (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            delete newCart[itemId];
            return newCart;
        });
    };

    const calculateDiscountedPrice = (product, quantity) => {
        const { price, discount_type } = product;
    
        if (discount_type && /^\d+ב\d+$/.test(discount_type)) {
            // Handle "3ב10" type discounts (e.g., "3 for 10")
            const [requiredQty, discountedPrice] = discount_type.split('ב').map(Number);
    
            if (quantity >= requiredQty) {
                const sets = Math.floor(quantity / requiredQty);
                const remaining = quantity % requiredQty;
                return sets * discountedPrice + remaining * price;
            }
        } 
        
        else if (discount_type && /^\d+%$/.test(discount_type)) {
            // Handle "20%" type discounts
            const discountPercentage = parseFloat(discount_type) / 100;
            return quantity * price * (1 - discountPercentage);
        }
    
        else if (discount_type && /^\d+\+\d+$/.test(discount_type)) {
            // Handle "3+1" type discounts (e.g., "Buy 3, Get 1 Free")
            const [requiredQty, freeQty] = discount_type.split('+').map(Number);
    
            const totalPaidItems = Math.ceil(quantity / (requiredQty + freeQty)) * requiredQty;
            const maxPossibleItems = Math.floor(quantity / (requiredQty + freeQty)) * (requiredQty + freeQty) + (quantity % (requiredQty + freeQty));
    
            return (quantity === maxPossibleItems) ? totalPaidItems * price : quantity * price;
        }
    
        // No discount, return regular price
        return quantity * price;
    };
    
    
      
      const getTotalCartValue = () => {
        return Object.keys(cartItems).reduce((total, productId) => {
          const product = products.find((p) => p.id === Number(productId));
          if (!product) return total;
          return total + calculateDiscountedPrice(product, cartItems[productId]);
        }, 0);
      };
      
    // const getTotalCartValue = () => {
    //     return products.reduce((total, product) => {
    //         const quantity = cartItems[product.id] || 0;
    //         return total + product.price * quantity;
    //     }, 0);
    // };

    const getTotalItems = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    };

    const clearAllItemsFromCart = () => {
        setCartItems({});
    };


    const handleResetProductType = () => {
        setProductType(null);
    }
    // Context value
    const contextValue = {
        all_products: products,
        all_brands: brands,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearItemFromCart,
        getTotalCartValue,
        getTotalItems,
        clearAllItemsFromCart,
        productType,
        setProductType,
        handleResetProductType,
        calculateDiscountedPrice,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
