let currentUser = null;
let currentAuthMode = 'login';

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
                msg.style.color = "#10b981";
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
        document.getElementById('user-balance').innerText = `$${currentUser.balance.toFixed(2)}`;
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
    const res = await fetch('/api/menu');
    const menu = await res.json();
    const main = document.getElementById('main-view');
    main.innerHTML = '<h3>Available Delicacies</h3><div class="menu-grid" id="menu-container"></div>';
    
    const container = document.getElementById('menu-container');
    menu.forEach(item => {
        if (!item.available) return;
        const card = document.createElement('div');
        card.className = 'food-card';
        card.innerHTML = `
            <span class="category">${item.category}</span>
            <h4>${item.name}</h4>
            <span class="price">$${item.price.toFixed(2)}</span>
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
    const res = await fetch(`/api/orders/${currentUser.id}`);
    const orders = await res.json();
    const main = document.getElementById('main-view');
    main.innerHTML = '<h3>My Order History</h3><table id="orders-table"><tr><th>ID</th><th>Items</th><th>Total</th><th>Status</th></tr></table>';
    
    const table = document.getElementById('orders-table');
    orders.forEach(o => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>#${o.orderId}</td>
            <td>${o.items.map(i => i.foodName + ' x' + i.quantity).join(', ')}</td>
            <td>$${o.totalAmount.toFixed(2)}</td>
            <td><span class="badge">${o.status}</span></td>
        `;
    });
}

// Admin Actions
async function viewAllOrders() {
    const res = await fetch('/api/orders');
    const orders = await res.json();
    const main = document.getElementById('main-view');
    main.innerHTML = '<h3>Incoming Orders</h3><table id="all-orders"><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr></table>';
    
    const table = document.getElementById('all-orders');
    orders.forEach(o => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>#${o.orderId}</td>
            <td>${o.customerId.substring(0,8)}</td>
            <td>$${o.totalAmount.toFixed(2)}</td>
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
    await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    viewAllOrders();
}

async function adminViewMenu() {
    const res = await fetch('/api/menu');
    const menu = await res.json();
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
            <td>$${item.price.toFixed(2)}</td>
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

    await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price), category })
    });
    adminViewMenu();
}

async function deleteItem(id) {
    if (confirm("Delete this item?")) {
        await fetch(`/api/menu/${id}`, { method: 'DELETE' });
        adminViewMenu();
    }
}
