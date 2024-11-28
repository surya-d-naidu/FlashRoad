
function filterProducts() {
    const searchQuery = document.getElementById('searchQuery').value.toLowerCase();
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery) || 
      product.description.toLowerCase().includes(searchQuery)
    );
  
    displayProducts(filteredProducts);  
  }
  
  
  function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';  
  
    if (products.length === 0) {
      productList.innerHTML = '<p>No products found.</p>';
      return;
    }
  
    
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product-item');
      
      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Price: </strong>₹${product.price.toFixed(2)}</p>
        <a href="/product/${product._id}">View Details</a>
      `;
      
      productList.appendChild(productDiv);
    });
  }
  