import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart({ cartItems, updateQuantity, removeFromCart, cartTotal }) {
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/" className="continue-shopping">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img src={item.imageURL} alt={item.name} />
            </div>
            
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <p>Color: {item.color}</p>
              <p>Gender: {item.gender}</p>
              <p>Type: {item.type}</p>
            </div>
            
            <div className="item-quantity">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="quantity-btn"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
            
            <div className="item-subtotal">
              <p>₹{item.price * item.quantity}</p>
            </div>
            
            <div className="item-remove">
              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="total">
          <h3>Total: ₹{cartTotal}</h3>
        </div>
        <div className="checkout-actions">
          <Link to="/" className="continue-shopping">Continue Shopping</Link>
          <button className="checkout-btn">Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;