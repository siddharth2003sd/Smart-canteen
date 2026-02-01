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

const MENU_VERSION = '6.0';

function initMockData() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([{ id: 'admin-1', email: 'admin@smartcanteen.com', password: '123', role: 'ADMIN' }]));
    }

    const currentVersion = localStorage.getItem('menuVersion');
    if (!localStorage.getItem('menu') || currentVersion !== MENU_VERSION) {
        console.log("Updating menu to version " + MENU_VERSION);
        localStorage.setItem('menuVersion', MENU_VERSION);
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
            { id: '11', name: 'Korean Beef Bowl', price: 280.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1000&auto=format&fit=crop' },
            { id: '12', name: 'Veg Red Curry', price: 210.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=1000&auto=format&fit=crop' },
            { id: '13', name: 'Matcha Cake', price: 160.00, category: 'Dessert', available: true, image: 'https://images.unsplash.com/photo-1506764483431-bc303bc3e1f1?q=80&w=1000&auto=format&fit=crop' },
            { id: '14', name: 'Truffle Pasta', price: 450.00, category: 'Pasta', available: true, image: 'https://images.unsplash.com/photo-1551183053-bf91a13a8ba5?q=80&w=1000&auto=format&fit=crop' },
            { id: '15', name: 'Mango Lassi', price: 90.00, category: 'Beverage', available: true, image: 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=1000&auto=format&fit=crop' },
            { id: '16', name: 'Grilled Chicken', price: 380.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=1000&auto=format&fit=crop' },
            { id: '17', name: 'Masala Dosa', price: 65.00, category: 'Breakfast', available: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop' },
            { id: '18', name: 'Idli Sambar', price: 45.00, category: 'Breakfast', available: true, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop' },
            { id: '19', name: 'Poha', price: 35.00, category: 'Breakfast', available: true, image: 'https://images.unsplash.com/photo-1601050633647-81a31737729f?q=80&w=1000&auto=format&fit=crop' },
            { id: '20', name: 'Vada Pav', price: 20.00, category: 'Snacks', available: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1000&auto=format&fit=crop' },
            { id: '21', name: 'Samosa (2pcs)', price: 30.00, category: 'Snacks', available: true, image: 'https://images.unsplash.com/photo-1601050633647-81a31737729f?q=80&w=1000&auto=format&fit=crop' },
            { id: '22', name: 'Paneer Butter Masala', price: 220.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop' },
            { id: '23', name: 'Dal Makhani', price: 180.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1000&auto=format&fit=crop' },
            { id: '24', name: 'Chicken Biryani', price: 250.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=1000&auto=format&fit=crop' },
            { id: '25', name: 'Veg Fried Rice', price: 120.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000&auto=format&fit=crop' },
            { id: '26', name: 'Hakka Noodles', price: 130.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000&auto=format&fit=crop' },
            { id: '27', name: 'Butter Naan', price: 40.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000&auto=format&fit=crop' },
            { id: '28', name: 'Garlic Bread', price: 90.00, category: 'Snacks', available: true, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=1000&auto=format&fit=crop' },
            { id: '29', name: 'French Fries', price: 80.00, category: 'Snacks', available: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1000&auto=format&fit=crop' },
            { id: '30', name: 'Masala Chai', price: 15.00, category: 'Beverage', available: true, image: 'https://images.unsplash.com/photo-1544787210-2213d242658a?q=80&w=1000&auto=format&fit=crop' },
            { id: '31', name: 'Filter Coffee', price: 25.00, category: 'Beverage', available: true, image: 'https://images.unsplash.com/photo-1544145945-f904253d0c71?q=80&w=1000&auto=format&fit=crop' },
            { id: '32', name: 'Lemonade', price: 40.00, category: 'Beverage', available: true, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop' },
            { id: '33', name: 'Cold Coffee', price: 95.00, category: 'Beverage', available: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1000&auto=format&fit=crop' },
            { id: '34', name: 'Gulab Jamun (2pcs)', price: 50.00, category: 'Dessert', available: true, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1000&auto=format&fit=crop' },
            { id: '35', name: 'Rasmalai (2pcs)', price: 70.00, category: 'Dessert', available: true, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1000&auto=format&fit=crop' },
            { id: '36', name: 'Veggies Wrap', price: 110.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1000&auto=format&fit=crop' },
            { id: '37', name: 'Chicken Wrap', price: 140.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1000&auto=format&fit=crop' },
            { id: '38', name: 'Margherita Pizza', price: 280.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=1000&auto=format&fit=crop' },
            { id: '39', name: 'Sweet Corn Soup', price: 60.00, category: 'Healthy', available: true, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000&auto=format&fit=crop' },
            { id: '40', name: 'Tomato Soup', price: 50.00, category: 'Healthy', available: true, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000&auto=format&fit=crop' },
            { id: '41', name: 'Club Sandwich', price: 120.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1000&auto=format&fit=crop' },
            { id: '42', name: 'Omelette', price: 40.00, category: 'Breakfast', available: true, image: 'https://images.unsplash.com/photo-1510627489930-0c1b0ba003e9?q=80&w=1000&auto=format&fit=crop' },
            { id: '43', name: 'Fruit Salad', price: 90.00, category: 'Healthy', available: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop' },
            { id: '44', name: 'Pav Bhaji', price: 85.00, category: 'Snacks', available: true, image: 'https://images.unsplash.com/photo-1601050633647-81a31737729f?q=80&w=1000&auto=format&fit=crop' },
            { id: '45', name: 'Chole Bhature', price: 95.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop' },
            { id: '46', name: 'Veg Pulav', price: 110.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop' },
            { id: '47', name: 'Chicken Soup', price: 80.00, category: 'Healthy', available: true, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000&auto=format&fit=crop' },
            { id: '48', name: 'Cold Drink (Can)', price: 35.00, category: 'Beverage', available: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop' },
            { id: '49', name: 'Mineral Water', price: 20.00, category: 'Beverage', available: true, image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?q=80&w=1000&auto=format&fit=crop' },
            { id: '50', name: 'Cheese Dip', price: 20.00, category: 'Snacks', available: true, image: 'https://images.unsplash.com/photo-1571217682543-08709337ba57?q=80&w=1000&auto=format&fit=crop' },
            { id: '51', name: 'Onion Pakoda', price: 40.00, category: 'Snacks', available: true, image: 'https://images.unsplash.com/photo-1626132646529-5006394816bc?q=80&w=1000&auto=format&fit=crop' },
            { id: '52', name: 'Mashed Potato', price: 60.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1518977676601-b53f02ac10dd?q=80&w=1000&auto=format&fit=crop' },
            { id: '53', name: 'Garlic Mayo', price: 15.00, category: 'Snacks', available: true, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=1000&auto=format&fit=crop' },
            { id: '54', name: 'Hot Chocolate', price: 75.00, category: 'Beverage', available: true, image: 'https://images.unsplash.com/photo-1544787210-2213d242658a?q=80&w=1000&auto=format&fit=crop' },
            { id: '55', name: 'Brownie', price: 80.00, category: 'Dessert', available: true, image: 'https://images.unsplash.com/photo-1564928271391-9e7670987820?q=80&w=1000&auto=format&fit=crop' },
            { id: '56', name: 'Vanilla Ice Cream', price: 40.00, category: 'Dessert', available: true, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=1000&auto=format&fit=crop' },
            { id: '57', name: 'Chocolate Ice Cream', price: 45.00, category: 'Dessert', available: true, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=1000&auto=format&fit=crop' },
            { id: '58', name: 'Mix Veg Paratha', price: 55.00, category: 'Breakfast', available: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop' },
            { id: '59', name: 'Aloo Paratha', price: 50.00, category: 'Breakfast', available: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop' },
            { id: '60', name: 'Egg Sandwich', price: 70.00, category: 'Breakfast', available: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop' },
            { id: '61', name: 'Peanut Butter Toast', price: 60.00, category: 'Breakfast', available: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop' },
            { id: '62', name: 'Mac & Cheese', price: 150.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=1000&auto=format&fit=crop' },
            { id: '63', name: 'Spring Rolls', price: 90.00, category: 'Snacks', available: true, image: 'https://images.unsplash.com/photo-1601050633647-81a31737729f?q=80&w=1000&auto=format&fit=crop' },
            { id: '64', name: 'Chilli Chicken', price: 180.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=1000&auto=format&fit=crop' },
            { id: '65', name: 'Veg Manchurian', price: 140.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000&auto=format&fit=crop' },
            { id: '66', name: 'Paneer Chilli', price: 160.00, category: 'Main', available: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop' }
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
    document.getElementById('auth-btn').innerText = mode === 'login' ? 'Log In' : 'Create Account';
}

async function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('auth-msg');

    const endpoint = currentAuthMode === 'login' ? '/api/login' : '/api/register';

    if (isLiveDemo) {
        handleDemoAuth(email, password, msg);
        return;
    }

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
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
            if (err.includes("Existing user")) {
                msg.style.color = "var(--primary)";
                showAuth('login');
            } else {
                msg.style.color = "#f43f5e";
            }
        }
    } catch (e) {
        msg.innerText = "Connection failed";
    }
}

function handleDemoAuth(email, password, msg) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (currentAuthMode === 'login') {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            if (user.role === 'CUSTOMER' && !user.balance) user.balance = 100.0;
            startSession();
        } else {
            msg.innerText = "Invalid credentials";
            msg.style.color = "#f43f5e";
        }
    } else {
        if (users.find(u => u.email === email)) {
            msg.innerText = "Existing user found, please log in to continue";
            msg.style.color = "var(--primary)";
            showAuth('login');
            return;
        }
        users.push({ id: Date.now().toString(), email, password, role: 'CUSTOMER', balance: 100.0 });
        localStorage.setItem('users', JSON.stringify(users));
        msg.innerText = "Success! Now login.";
        msg.style.color = "#10b981";
        showAuth('login');
    }
}

function startSession() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('welcome-text').innerText = `Hello, ${currentUser.email.split('@')[0]}`;
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
