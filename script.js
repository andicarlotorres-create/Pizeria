// Variables globales
let cart = JSON.parse(localStorage.getItem('pizzeriaCart')) || [];
const PHONE_NUMBER = "+5350504479"; // TU NÚMERO AQUÍ

// DOM Elements
const menuContainer = document.getElementById('menu-container');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const emptyCart = document.getElementById('empty-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const closeCart = document.getElementById('close-cart');
const whatsappBtn = document.getElementById('whatsapp-btn');
const clearCartBtn = document.getElementById('clear-cart');
const cartIcon = document.querySelector('.cart-icon');
const filterButtons = document.querySelectorAll('.filter-btn');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCart();
    setupEventListeners();
});

// Renderizar menú
function renderMenu(filter = 'all') {
    menuContainer.innerHTML = '';
    
    const filteredItems = filter === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === filter);
    
    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <div class="menu-item-image">
                <span style="font-size: 4rem;">${item.emoji}</span>
            </div>
            <div class="menu-item-content">
                <span class="category-badge ${getCategoryColor(item.category)}">
                    ${getCategoryName(item.category)}
                </span>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-price">$${item.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" data-id="${item.id}">
                    <i class="fas fa-plus"></i> Añadir al Carrito
                </button>
            </div>
        `;
        menuContainer.appendChild(menuItem);
    });
    
    // Añadir event listeners a los botones de añadir al carrito
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').dataset.id);
            addToCart(id);
        });
    });
}

// Filtrado por categoría
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase active de todos
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Añadir clase active al botón clickeado
        button.classList.add('active');
        // Filtrar menú
        const category = button.dataset.category;
        renderMenu(category);
    });
});

// Funciones del carrito
function addToCart(productId) {
    const product = menuItems.find(item => item.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCart();
    showNotification(`${product.name} añadido al carrito`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCart();
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCart();
    showNotification('Carrito vaciado');
}

function saveCart() {
    localStorage.setItem('pizzeriaCart', JSON.stringify(cart));
}

function updateCart() {
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar lista del carrito
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    emptyCart.style.display = 'none';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <span>${item.emoji}</span>
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <span class="remove-item" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </span>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Actualizar total
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Añadir event listeners a los controles del carrito
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').dataset.id);
            const item = cart.find(item => item.id === id);
            if (item) {
                updateQuantity(id, item.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').dataset.id);
            const item = cart.find(item => item.id === id);
            if (item) {
                updateQuantity(id, item.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('span').dataset.id);
            removeFromCart(id);
        });
    });
}

// Generar mensaje de WhatsApp
function generateWhatsAppMessage() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Añade algunos productos primero.');
        return;
    }
    
    let message = `¡Hola! Quiero hacer un pedido:%0A%0A`;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `• ${item.name} (x${item.quantity}) - $${itemTotal.toFixed(2)}%0A`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `%0ATotal: $${total.toFixed(2)}%0A%0A`;
    
    message += `Información del cliente:%0A`;
    message += `Nombre: ______________%0A`;
    message += `Dirección: ______________%0A`;
    message += `Teléfono: ______________%0A`;
    message += `Instrucciones especiales: ______________%0A%0A`;
    
    message += `¿A qué hora puedo recoger/recibir mi pedido?`;
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abrir WhatsApp con el mensaje
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`, '_blank');
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Crear keyframes para la animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Configurar event listeners
function setupEventListeners() {
    // Abrir/cerrar carrito
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        overlay.classList.add('show');
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
    
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
    
    // Botón de WhatsApp
    whatsappBtn.addEventListener('click', generateWhatsAppMessage);
    
    // Vaciar carrito
    clearCartBtn.addEventListener('click', clearCart);
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Crear botón flotante de WhatsApp
function createFloatingWhatsAppButton() {
    const floatBtn = document.createElement('a');
    floatBtn.href = `https://wa.me/${PHONE_NUMBER}`;
    floatBtn.target = '_blank';
    floatBtn.className = 'whatsapp-float';
    floatBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    floatBtn.title = 'Chatear por WhatsApp';
    document.body.appendChild(floatBtn);
}

// Llamar a la función para crear el botón flotante
createFloatingWhatsAppButton();
