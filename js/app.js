let currentUser = null;
let currentAuthMode = 'login';
let isLiveDemo = false;

// Auto-detect if running on GitHub Pages or local static host
function checkApiAvailability() {
    if (window.location.hostname.includes('github.io') || window.location.hostname === 'localhost' && !window.location.port) {
        console.log("Running in Live Demo mode (LocalStorage)");
        isLiveDemo = true;
        initMockData();
    } else {
        // Fallback check for dynamic hosts
        fetch('/api/menu', { method: 'GET' })
            .then(res => {
                if (!res.ok) throw new Error();
                isLiveDemo = false;
            })
            .catch(() => {
                isLiveDemo = true;
                initMockData();
            });
    }
}

function initMockData() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([{ id: 'admin-1', username: 'admin', password: '123', role: 'ADMIN' }]));
    }
    if (!localStorage.getItem('menu')) {
        localStorage.setItem('menu', JSON.stringify([
            { id: '1', name: 'Gourmet Burger', price: 180.00, category: 'Main', available: true, image: 'assets/burger.png' },
            { id: '2', name: 'Penne Arrabbiata', price: 250.00, category: 'Pasta', available: true, image: 'assets/pasta.png' },
            { id: '3', name: 'Mexican Tacos', price: 150.00, category: 'Main', available: true, image: 'assets/tacos.png' },
            { id: '4', name: 'Glazed Donuts', price: 80.00, category: 'Dessert', available: true, image: 'assets/donuts.png' },
            { id: '5', name: 'Premium Pizza', price: 350.00, category: 'Main', available: true, image: 'assets/pizza.png' },
            { id: '6', name: 'Avocado Toast', price: 150.00, category: 'Healthy', available: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop' },
            { id: '7', name: 'Salmon Bowl', price: 420.00, category: 'Healthy', available: true, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1000&auto=format&fit=crop' },
            { id: '8', name: 'Caesar Salad', price: 220.00, category: 'Healthy', available: true, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=1000&auto=format&fit=crop' },
            { id: '9', name: 'Berry Smoothie', price: 120.00, category: 'Beverage', available: true, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=1000&auto=format&fit=crop' },
            { id: '10', name: 'Ice Latte', price: 110.00, category: 'Beverage', available: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1000&auto=format&fit=crop' },
            { id: '11', name: 'Paneer Tikka Roll', price: 180.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop' },
            { id: '12', name: 'Veg Red Curry', price: 210.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=1000&auto=format&fit=crop' },
            { id: '13', name: 'Matcha Cake', price: 160.00, category: 'Dessert', available: true, image: 'https://images.unsplash.com/photo-1506764483431-bc303bc3e1f1?q=80&w=1000&auto=format&fit=crop' }
        ]));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
}

checkApiAvailability();

function showAuth(mode) {
    currentAuthMode = mode;
    document.getElementById('tab-login').classList.toggle('active', mode === 'login');
    document.getElementById('tab-register').classList.toggle('active', mode === 'register');
    document.getElementById('auth-btn').innerText = mode === 'login' ? 'Enter System' : 'Create Account';
}

async function handleAuth(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('auth-msg');

    const endpoint = currentAuthMode === 'login' ? '/api/login' : '/api/register';

    if (isLiveDemo) {
        handleDemoAuth(username, password, msg);
        return;
    }

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            if (currentAuthMode === 'login') {
                currentUser = await res.json();
                startSession();
            } else {
                msg.innerText = "Success! Now please login.";
                msg.style.color = "var(--success)";
                showAuth('login');
            }
        } else {
            const err = await res.text();
            msg.innerText = err;
            msg.style.color = "#f43f5e";
        }
    } catch (e) {
        msg.innerText = "Connection failed";
    }
}

function handleDemoAuth(username, password, msg) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (currentAuthMode === 'login') {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = user;
            if (user.role === 'CUSTOMER' && !user.balance) user.balance = 100.0;
            startSession();
        } else {
            msg.innerText = "Invalid credentials";
            msg.style.color = "#f43f5e";
        }
    } else {
        if (users.find(u => u.username === username)) {
            msg.innerText = "User exists";
            msg.style.color = "#f43f5e";
            return;
        }
        users.push({ id: Date.now().toString(), username, password, role: 'CUSTOMER', balance: 100.0 });
        localStorage.setItem('users', JSON.stringify(users));
        msg.innerText = "Success! Now login.";
        msg.style.color = "#10b981";
        showAuth('login');
    }
}

function startSession() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('welcome-text').innerText = `Hello, ${currentUser.username}`;
    document.getElementById('user-role-badge').innerText = currentUser.role;

    if (currentUser.role === 'ADMIN') {
        document.getElementById('balance-container').classList.add('hidden');
        renderAdminNav();
        viewAllOrders();
    } else {
        document.getElementById('user-balance').innerText = `₹${currentUser.balance.toFixed(2)}`;
        renderCustomerNav();
        viewMenu();
    }
}

function logout() {
    currentUser = null;
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

// Navigation
function renderAdminNav() {
    const nav = document.getElementById('nav-items');
    nav.innerHTML = `
        <button class="nav-btn" onclick="viewAllOrders()" title="Orders">📦</button>
        <button class="nav-btn" onclick="adminViewMenu()" title="Menu">🍴</button>
    `;
}

function renderCustomerNav() {
    const nav = document.getElementById('nav-items');
    nav.innerHTML = `
        <button class="nav-btn" onclick="viewMenu()" title="Order Food">🍴</button>
        <button class="nav-btn" onclick="viewMyOrders()" title="My History">📜</button>
    `;
}

// Logic implementations
async function viewMenu() {
    let menu;
    if (isLiveDemo) {
        menu = JSON.parse(localStorage.getItem('menu') || '[]');
    } else {
        const res = await fetch('/api/menu');
        menu = await res.json();
    }

    const main = document.getElementById('main-view');
    main.innerHTML = '<h3>Available Delicacies</h3><div class="menu-grid" id="menu-container"></div>';

    const container = document.getElementById('menu-container');
    menu.forEach(item => {
        if (!item.available) return;
        const card = document.createElement('div');
        card.className = 'food-card';
        card.innerHTML = `
            <div class="food-img-container">
                <img src="${item.image || 'assets/default.png'}" alt="${item.name}">
            </div>
            <span class="category">${item.category}</span>
            <h4>${item.name}</h4>
            <span class="price">₹${item.price.toFixed(2)}</span>
            <button class="btn-small" onclick="orderItem('${item.id}', '${item.name}', ${item.price})">Add to Order</button>
        `;
        container.appendChild(card);
    });
}

let cart = [];
async function orderItem(id, name, price) {
    const qty = prompt(`How many ${name}?`, "1");
    if (!qty) return;

    cart.push({ foodItemId: id, foodName: name, quantity: parseInt(qty), priceAtTime: price });
    if (confirm(`Added! Cart has ${cart.length} items. Place order now?`)) {
        if (isLiveDemo) {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const total = cart.reduce((acc, i) => acc + (i.priceAtTime * i.quantity), 0);
            if (currentUser.balance < total) { alert("Insufficient funds"); cart = []; return; }

            const newOrder = {
                orderId: Math.random().toString(36).substr(2, 6).toUpperCase(),
                customerId: currentUser.id,
                items: cart,
                totalAmount: total,
                status: 'PLACED'
            };
            orders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(orders));
            currentUser.balance -= total;
            const users = JSON.parse(localStorage.getItem('users'));
            const uIdx = users.findIndex(u => u.id === currentUser.id);
            users[uIdx] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));

            alert("Order placed successfully!");
            cart = [];
            document.getElementById('user-balance').innerText = `₹${currentUser.balance.toFixed(2)}`;
            viewMyOrders();
            return;
        }

        const res = await fetch(`/api/orders/${currentUser.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart)
        });

        if (res.ok) {
            alert("Order placed successfully!");
            cart = [];
            // Refresh balance (mocked for demo, realistically would fetch user again)
            currentUser.balance -= cart.reduce((acc, i) => acc + (i.priceAtTime * i.quantity), 0);
            document.getElementById('user-balance').innerText = `$${currentUser.balance.toFixed(2)}`;
            viewMyOrders();
        } else {
            const err = await res.text();
            alert(err);
        }
    }
}

async function viewMyOrders() {
    let orders;
    if (isLiveDemo) {
        orders = JSON.parse(localStorage.getItem('orders') || '[]').filter(o => o.customerId === currentUser.id);
    } else {
        const res = await fetch(`/api/orders/${currentUser.id}`);
        orders = await res.json();
    }

    const main = document.getElementById('main-view');
    main.innerHTML = '<h3>My Order History</h3><table id="orders-table"><tr><th>ID</th><th>Items</th><th>Total</th><th>Status</th></tr></table>';

    const table = document.getElementById('orders-table');
    orders.forEach(o => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>#${o.orderId}</td>
            <td>${o.items.map(i => i.foodName + ' x' + i.quantity).join(', ')}</td>
            <td>₹${o.totalAmount.toFixed(2)}</td>
            <td><span class="badge">${o.status}</span></td>
        `;
    });
}

// Admin Actions
async function viewAllOrders() {
    let orders;
    if (isLiveDemo) {
        orders = JSON.parse(localStorage.getItem('orders') || '[]');
    } else {
        const res = await fetch('/api/orders');
        orders = await res.json();
    }

    const main = document.getElementById('main-view');
    main.innerHTML = '<h3>Incoming Orders</h3><table id="all-orders"><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr></table>';

    const table = document.getElementById('all-orders');
    orders.forEach(o => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>#${o.orderId}</td>
            <td>${o.customerId.substring(0, 8)}</td>
            <td>₹${o.totalAmount.toFixed(2)}</td>
            <td><span class="badge">${o.status}</span></td>
            <td>
                <select onchange="updateStatus('${o.orderId}', this.value)">
                    <option value="">Update...</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="READY">Ready</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </td>
        `;
    });
}

async function updateStatus(id, status) {
    if (!status) return;

    if (isLiveDemo) {
        const orders = JSON.parse(localStorage.getItem('orders'));
        const oIdx = orders.findIndex(o => o.orderId === id);
        orders[oIdx].status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        viewAllOrders();
        return;
    }

    await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    viewAllOrders();
}

async function adminViewMenu() {
    let menu;
    if (isLiveDemo) {
        menu = JSON.parse(localStorage.getItem('menu') || '[]');
    } else {
        const res = await fetch('/api/menu');
        menu = await res.json();
    }

    const main = document.getElementById('main-view');
    main.innerHTML = `
        <header style="display:flex; justify-content:space-between; align-items:center mb:1rem">
            <h3>Menu Management</h3>
            <button class="btn-small" onclick="addItemPrompt()">+ Add Item</button>
        </header>
        <table id="admin-menu"><tr><th>Name</th><th>Price</th><th>Category</th><th>Available</th><th>Actions</th></tr></table>
    `;

    const table = document.getElementById('admin-menu');
    menu.forEach(item => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>${item.category}</td>
            <td>${item.available ? '✅' : '❌'}</td>
            <td><button class="btn-small" style="background:var(--accent)" onclick="deleteItem('${item.id}')">Delete</button></td>
        `;
    });
}

async function addItemPrompt() {
    const name = prompt("Name:");
    const price = prompt("Price:");
    const category = prompt("Category:");
    if (!name || !price) return;

    if (isLiveDemo) {
        const menu = JSON.parse(localStorage.getItem('menu'));
        menu.push({ id: Date.now().toString(), name, price: parseFloat(price), category, available: true });
        localStorage.setItem('menu', JSON.stringify(menu));
        adminViewMenu();
        return;
    }

    await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price), category })
    });
    adminViewMenu();
}

async function deleteItem(id) {
    if (confirm("Delete this item?")) {
        if (isLiveDemo) {
            const menu = JSON.parse(localStorage.getItem('menu'));
            const filtered = menu.filter(m => m.id !== id);
            localStorage.setItem('menu', JSON.stringify(filtered));
            adminViewMenu();
            return;
        }
        await fetch(`/api/menu/${id}`, { method: 'DELETE' });
        adminViewMenu();
    }
}
