
document.addEventListener('DOMContentLoaded', function () {
    
    const registerForm = document.querySelector('#registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const mobileNumber = document.querySelector('#mobileNumber').value;
        
        const data = {
          name,
          email,
          password,
          mobileNumber,
          role: 'user', 
        };
  
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
  
          const result = await response.json();
          if (response.ok) {
            alert(result.message);
            window.location.href = '/login'; 
          } else {
            alert(result.message);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        }
      });
    }
  
    
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
  
        const email = document.querySelector('#loginEmail').value;
        const password = document.querySelector('#loginPassword').value;
  
        const data = {
          email,
          password,
        };
  
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
  
          const result = await response.json();
          if (response.ok) {
            localStorage.setItem('token', result.token); 
            window.location.href = '/'; 
          } else {
            alert(result.message);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        }
      });
    }
  
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons.length > 0) {
      addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
          const productId = this.dataset.productId; 
          addToCart(productId);
        });
      });
    }
  
    
    function addToCart(productId) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingProduct = cart.find(item => item.productId === productId);
  
      if (existingProduct) {
        existingProduct.quantity += 1; 
      } else {
        cart.push({ productId, quantity: 1 }); 
      }
  
      localStorage.setItem('cart', JSON.stringify(cart)); 
      updateCartCount();
    }
  
    
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
      const cartBadge = document.querySelector('#cart-count');
      if (cartBadge) {
        cartBadge.textContent = cartCount;
      }
    }
  
    
    const cartPage = document.querySelector('#cartPage');
    if (cartPage) {
      displayCartItems();
    }
  
    function displayCartItems() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const cartList = document.querySelector('#cart-list');
      const checkoutButton = document.querySelector('#checkout-button');
  
      if (cart.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty.</p>';
        checkoutButton.disabled = true;
      } else {
        cartList.innerHTML = ''; 
        cart.forEach(item => {
          const cartItem = document.createElement('li');
          cartItem.classList.add('cart-item');
          cartItem.innerHTML = `
            Product ID: ${item.productId} | Quantity: ${item.quantity} 
            <button class="remove-from-cart" data-product-id="${item.productId}">Remove</button>
          `;
          cartList.appendChild(cartItem);
        });
  
        
        checkoutButton.disabled = false;
  
        
        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
          button.addEventListener('click', function () {
            const productId = this.dataset.productId;
            removeFromCart(productId);
          });
        });
      }
    }
  
    
    function removeFromCart(productId) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.filter(item => item.productId !== productId); 
      localStorage.setItem('cart', JSON.stringify(cart)); 
      displayCartItems(); 
      updateCartCount();
    }
  
    
    const checkoutPage = document.querySelector('#checkoutPage');
    if (checkoutPage) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const orderSummary = document.querySelector('#order-summary');
      
      if (cart.length > 0) {
        const totalAmount = cart.reduce((sum, item) => sum + (item.quantity * 100), 0); 
        orderSummary.innerHTML = `
          <h3>Order Summary</h3>
          <ul>
            ${cart.map(item => `
              <li>Product ID: ${item.productId} | Quantity: ${item.quantity}</li>
            `).join('')}
          </ul>
          <strong>Total: $${totalAmount}</strong>
        `;
      } else {
        orderSummary.innerHTML = '<p>No items in your cart.</p>';
      }
    }
  
    
    updateCartCount();
  });
  