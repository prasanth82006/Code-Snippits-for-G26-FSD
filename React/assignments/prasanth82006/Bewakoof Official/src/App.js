// import React, { useState } from "react";
// import "./App.css";

// function App() {
//   const [name, setName] = useState("");

//   const handleSubmit = () => {
//     const postdata = {
//       name: name,
//     };

//     fetch("http://localhost:3001/test", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json", 
//       },
//       body: JSON.stringify(postdata),
//     })
//   };

//   return (
//     <div className="app">
//       <input
//         type="text"
//         value={name}
//         placeholder="Enter your name"
//         onChange={(e) => setName(e.target.value)}
//       />
//       <button onClick={handleSubmit}>Submit</button>
//     </div>
//   );
// }

// export default App;


// import React,{useState} from "react";
// import "./App.css";
// import Helloworld from "./component/Helloworld";

// function App() {
//      const [userDetailState, setUserDetails] = useState({  
//           name:'Prasanth',
//           age: 25
//      });
//      function handleChange(updteState){
//           setUserDetails(updteState);
//      }
//   return (
//     <div className="app">
//       <h1>App.js</h1>
//       <Helloworld  userDetailState={userDetailState} handleChange={handleChange}/>
//     </div>
//   );
// }

// export default App;


// import React,{useState} from "react";
// import "./App.css";
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// function App() {
//   return (
//     <div className="app" style={{width:'100vw',height:'100vh',display:"flex",justifyContent:'center',alignItems:"center"}}>
//       <h1>App.js</h1>
//       <Button variant="text">Text</Button>
//       <Button variant="contained">Contained</Button>
//     </div>
//   );
// }

// export default App;





// import React, { useState } from "react";
// import "./App.css";
// import Ecommerce from "./component/Ecommence";

// function App() {
//   return (
//     <Ecommerce/>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products from API
    fetch('https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Check if adding one more would exceed available quantity
      if (existingItem.quantity >= product.quantity) {
        alert(`Sorry, only ${product.quantity} items available in stock!`);
        return;
      }
      
      // Update quantity if item already in cart
      setCart(
        cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Add new item to cart
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Update cart item quantity
  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    
    if (newQuantity > product.quantity) {
      alert(`Sorry, only ${product.quantity} items available in stock!`);
      return;
    }
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(
      cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove from cart function
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Calculate total cart amount
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Cart item count for the icon
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Simplified routing without react-router-dom
  const [currentPage, setCurrentPage] = useState('/');
  
  // Handle navigation
  const navigate = (path) => {
    setCurrentPage(path);
    // Update the URL without page reload
    window.history.pushState(null, '', path);
  };
  
  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Initial page setup based on URL
    setCurrentPage(window.location.pathname);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <a href="/" onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}>
            <h1>Bewakoof</h1>
          </a>
        </div>
        <div className="cart-icon">
          <a href="/cart" className="cart-link" onClick={(e) => {
            e.preventDefault();
            navigate('/cart');
          }}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </a>
        </div>
      </header>

      <main>
        {currentPage === '/' && (
          <ProductList 
            products={products} 
            addToCart={addToCart} 
            loading={loading} 
            error={error} 
          />
        )}
        {currentPage === '/cart' && (
          <Cart 
            cartItems={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
            cartTotal={cartTotal}
            navigateToHome={() => navigate('/')}
          />
        )}
      </main>
    </div>
  );
}

export default App;