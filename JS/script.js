/**
 * js/script.js
 * Comprehensive logic for E-Commerce Project
 * Demonstrates: DOM manipulation, Event Handling, LocalStorage, and Error Handling.
 */

// 1. DATA: Array of objects for products (Compulsory Feature 1) 
const products = [
    { id: 1, name: "Pro Laptop", price: 2000000, category: "Electronics", image: "images/electronics/laptop.jpeg" },
    { id: 2, name: "Smart Phone", price: 1800000, category: "Electronics", image: "images/electronics/iPhone 16 pro max.jpeg" },
    { id: 3, name: "Running Shoes", price: 120000, category: "Fashion", image: "images/shoes/Love, adidas.jpeg" },
    { id: 4, name: "Leather Jacket", price: 80000, category: "Fashion", image: "images/jacket.jpg" },
    { id: 5, name: "JS Guide Book", price: 30000, category: "Books", image: "images/book.jpg" },
    { id: 6, name: "Wireless Headphones", price: 150000, category: "Electronics", image: "images/headphones.jpg" }
];

// 2. LOCAL STORAGE: Initialize cart (Compulsory Feature 8) 
let cart = [];
try {
    // Attempting to retrieve data from localStorage [3]
    const savedCart = localStorage.getItem('cartItems');
    cart = savedCart ? JSON.parse(savedCart) : [];
} catch (error) {
    console.error("Error retrieving data from localStorage:", error);
    cart = [];
}

// ---------------------------------------------------------
// HOME PAGE LOGIC (index.html)
// ---------------------------------------------------------

/**
 * Function: Displays products dynamically using DOM manipulation [2, 5]
 */
function displayProducts(items) {
    const productList = document.getElementById('product-list');
    if (!productList) return; // Exit if not on Home Page

    // Using innerHTML to clear container [2]
    productList.innerHTML = "";

    items.forEach(product => {
        // Using createElement() to create product cards [2]
        const card = document.createElement('div');
        card.className = "product-card";

        // Using innerHTML to set the structure [2]
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Category: ${product.category}</p>
            <p class="price">UGX ${product.price.toLocaleString()}</p>
            <button onclick= "addToCart(${product.id})">Add to Cart</button>
        `;

        // Using appendChild() to add card to the DOM [2]
        productList.appendChild(card);
    });
}

/**
 * Function: Add product to cart array and localStorage (Compulsory Feature 2) [4, 6]
 */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCounter();
    alert(`${product.name} added to cart!`);
}

// ---------------------------------------------------------
// CART PAGE LOGIC (cart.html)
// ---------------------------------------------------------

/**
 * Function: Displays cart items and total cost (Compulsory Feature 3, 4, 5) 
 */
function displayCart() {
    const cartContainer = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('total-price');
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemRow = document.createElement('div');
        itemRow.className = "cart-item";

        //inner html used to create quantity control and remove buttons
        itemRow.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width:50px">
            <div>
                <h4>${item.name}</h4>
                <p>UGX ${item.price.toLocaleString()}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartContainer.appendChild(itemRow);
    });

    // Updating total price dynamically [6]
    if (totalPriceElement){
    totalPriceElement.innerText = `UGX ${total.toLocaleString()}`;
    }
}

//Function Quantity control

window.changeQuantity = function(id, delta) {
    try {
        const item = cart.find(i => i.id === id);
        if (item.quantity + delta < 1) throw new Error("Quantity cannot be less than 1"); // [3]
        item.quantity += delta;
        saveCart();
        displayCart();
        updateCartCounter();
    } catch (err) {
        alert(err.message);
    }
};
//Function remove from cart(feauture3)

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    displayCart();
    updateCartCounter();
};

// ---------------------------------------------------------
// CHECKOUT & SHARED LOGIC
// ---------------------------------------------------------


//function : Displays total on checkout page
function displayCheckoutTotal(){
    const checkoutTotalElement= document.getElementById('checkout-total-display'));
if (!checkoutTotalElement) return;

    const total = car.reduce((sum,item) => sum + (item.price *item.quantity),0);
    checkoutTotalElement.innerText =`UGX ${total.toLocaleString()}`;
}

function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cart));//loccal Storage
}

function updateCartCounter() {
    const counter = document.getElementById('cart-count');
    if (counter) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        counter.innerText = totalItems; // Updating cart indicator dynamically [6]
    }
}
/**
 * CHECKOUT VALIDATION with try...catch (Compulsory Feature 9 & 10) [3]
 */
window.validateCheckout = function() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.innerText = "";

    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        // Check if cart is empty [3]
        if (cart.length === 0) throw new Error("Your cart is empty. Add products before checking out!");

        // Check all fields filled [3]
        if (!name || !email || !phone || !address) throw new Error("All fields must be filled.");

        // Email validation (Regex) [3]
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) throw new Error("Please enter a valid email address.");

        // Phone validation (Simple check for digits) [3]
        if (phone.length < 10 || isNaN(phone)) throw new Error("Please enter a valid phone number.");

        alert("Order placed successfully!");
        cart = [];// clear cart on success
        saveCart();
        window.location.href = "index.html";

    } catch (error) {
        // Handle possible errors using try...catch [3]
if(errorDiv ) errorDiv.innerText = error.message;
    }
};

// SEARCH AND FILTER (Compulsory Feature 6 & 7) [4]
if (document.getElementById('search-bar')) {
    document.getElementById('search-bar').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        displayProducts(filtered); // Search filtering [4]
    });
}

if (document.getElementById('category-filter')) {
    document.getElementById('category-filter').addEventListener('change', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term)));
        displayProducts(filtered); // Category filtering [4]
    });
}

// INITIALIZE PAGE
//DOM .addeventlistener
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    displayCart();
    updateCartCounter();


//payment logic


  const paymentOptions = document.getElementsByName("payment");
  const mobileMoneyDiv = document.getElementById("mobileMoneyDetails");
  const cardDiv = document.getElementById("cardDetails");
if( paymentOptions.length > 0){
  paymentOptions.forEach(option => {
      option.addEventListener("change", function () {
          if (this.value === "mobile_money") {
           if(mobileMoneyDiv) mobileMoneyDiv.style.display = "block";
                if( cardDiv) cardDiv.style.display = "none";
          } else if (this.value === "card") {
          if(mobileMoneyDiv) mobileMoneyDiv.style.display = "none";
          if( cardDiv)  cardDiv.style.display = "block";
          } else {
         if(mobileMoneyDiv) mobileMoneyDiv.style.display = "none";
          if( cardDiv) cardDiv.style.display = "none";
          }
      });
  });
}
});
