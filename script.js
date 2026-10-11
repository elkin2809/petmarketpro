/* ==========================================================================
   DATOS Y ESTADO GLOBAL
   ========================================================================== */
const products = [
    { id: 1, name: "NutriPaws Gold", category: "Perros", categoryKey: "perros", price: 29900, old: 39900, desc: "Alimento premium para perros adultos. Fórmula completa para una nutrición equilibrada.", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop", promo: true },
    { id: 2, name: "Perfect Play Tree", category: "Gatos", categoryKey: "gatos", price: 45500, old: 56000, desc: "Torre de juego para gatos con plataformas y zonas de descanso.", img: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=300&h=300&fit=crop", promo: true },
    { id: 3, name: "Juguete de plumas", category: "Gatos", categoryKey: "gatos", price: 18900, old: 23900, desc: "Juguete interactivo para estimular el movimiento y la diversión.", img: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=300&h=300&fit=crop", promo: true },
    { id: 4, name: "Acuario decorativo", category: "Peces", categoryKey: "peces", price: 35000, old: 42000, desc: "Acuario compacto para decorar y crear un espacio adecuado para peces.", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=300&h=300&fit=crop", promo: true },
    { id: 5, name: "Heno Premium", category: "Pequeños animales", categoryKey: "pequenos", price: 15900, old: 18900, desc: "Heno seleccionado para conejos y pequeños animales.", img: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=300&h=300&fit=crop", promo: false },
    { id: 6, name: "Kit Reptil Pro", category: "Reptiles", categoryKey: "reptiles", price: 52900, old: 59900, desc: "Accesorios básicos para el cuidado responsable de reptiles.", img: "https://images.unsplash.com/photo-1504450874802-0ba2f9c0b5e4?w=300&h=300&fit=crop", promo: false },
    { id: 7, name: "Aves Mix", category: "Aves", categoryKey: "aves", price: 21900, old: 25900, desc: "Mezcla de semillas seleccionadas para aves domésticas.", img: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=300&h=300&fit=crop", promo: false },
    { id: 8, name: "Collar Eco", category: "Perros", categoryKey: "perros", price: 24900, old: 29900, desc: "Collar cómodo y resistente para paseos diarios.", img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop", promo: false }
];

const state = {
    route: "welcome",
    cart: JSON.parse(localStorage.getItem("petmarket-cart") || "[]"),
    search: "",
    category: "todos",
    qty: 1,
    selectedProduct: 1,
    user: JSON.parse(localStorage.getItem("petmarket-user") || "null"),
    orders: JSON.parse(localStorage.getItem("petmarket-orders") || "[]")
};

const app = document.getElementById("app");
const sidebar = document.getElementById("sidebar");
const toastEl = document.getElementById("toast");

/* ==========================================================================
   UTILIDADES
   ========================================================================== */
function money(value) {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
}

function save() {
    localStorage.setItem("petmarket-cart", JSON.stringify(state.cart));
    localStorage.setItem("petmarket-user", JSON.stringify(state.user));
    localStorage.setItem("petmarket-orders", JSON.stringify(state.orders));
    updateCartCount();
}

function updateCartCount() {
    const count = state.cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById("cartCount").textContent = count;
}

function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(window.__toast);
    window.__toast = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

function product(id) {
    return products.find(p => p.id === Number(id));
}

function cartTotal() {
    return state.cart.reduce((sum, i) => sum + i.qty * product(i.id).price, 0);
}

function cartItems() {
    return state.cart.map(i => ({ ...i, product: product(i.id) }));
}

/* ==========================================================================
   COMPONENTES HTML (CORREGIDO DE JSX A TEMPLATE LITERALS)
   ========================================================================== */
function productCard(p) {
    return `
    <article class="product">
        ${p.promo ? '<span class="badge">-25%</span>' : ''}
        <div class="product-img"><img src="${p.img}" alt="${p.name}"></div>
        <div class="category">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="price">${money(p.price)}</div>
        <div class="product-actions">
            <button class="btn btn-secondary" data-action="detail" data-id="${p.id}">Ver producto</button>
            <button class="btn btn-primary" data-action="add" data-id="${p.id}">+ Añadir</button>
        </div>
    </article>`;
}

/* ==========================================================================
   VISTAS (RENDERIZADO)
   ========================================================================== */
function welcomeView() {
    app.innerHTML = `
    <div class="view-page">
        <section class="hero-card">
            <span class="muted">Bienvenido a PetMarket Pro</span>
            <h1 style="margin-top:10px; font-size:32px;">Compra para tu mascota 🐾</h1>
            <p class="lead">Todo lo que necesita, en un solo lugar. Encuentra productos para perros, gatos, aves, peces y más.</p>
            <div class="hero-actions">
                <button class="btn btn-primary" data-route="catalog">Explorar productos</button>
                <button class="btn btn-secondary" data-route="login">Iniciar sesión</button>
            </div>
        </section>
    </div>`;
}

function homeView() {
    app.innerHTML = `
    <div class="view-page">
        <section class="hero-card" style="text-align:left;">
            <span class="muted">PetMarket Pro</span>
            <h1>¿Qué necesita tu mascota?</h1>
            <div class="search-row" style="margin-top:15px;">
                <input class="input" id="homeSearch" placeholder="Buscar productos" aria-label="Buscar productos">
                <button class="btn btn-primary" data-route="catalog">Buscar</button>
            </div>
            <div class="category-grid">
                ${[["🐶","Perros","perros"],["🐱","Gatos","gatos"],["🦜","Aves","aves"],["🐠","Peces","peces"], ["🐰","Pequeños","pequenos"],["🦎","Reptiles","reptiles"],["⭐","Ofertas","todos"],["🛒","Carrito","cart"]]
                .map(([e,n,c]) => `
                    <button class="category-card" data-category-route="${c}" data-route="${c==="cart"?"cart":"catalog"}">
                        <span class="emoji">${e}</span><strong>${n}</strong>
                    </button>`).join("")}
            </div>
        </section>
        <div class="promo-banner">
            <div><strong>Hasta 30% OFF</strong><span>Alimentos y accesorios seleccionados.</span></div>
            <button class="btn btn-secondary" data-route="promos">Ver promociones</button>
        </div>
        <div class="section-head">
            <div><h2>Productos destacados</h2><span class="muted">Compra fácil, rápida y segura.</span></div>
            <button class="btn btn-secondary" data-route="catalog">Ver catálogo</button>
        </div>
        <section class="grid">${products.slice(0,4).map(productCard).join("")}</section>
    </div>`;
}

function catalogView() {
    const filtered = products.filter(p => 
        (state.category === "todos" || p.categoryKey === state.category) && 
        (p.name.toLowerCase().includes(state.search.toLowerCase()) || p.category.toLowerCase().includes(state.search.toLowerCase()))
    );

    app.innerHTML = `
    <div class="view-page">
        <button class="btn btn-secondary" data-route="home" style="margin-bottom:15px;">← Volver</button>
        <div class="section-head">
            <div><h2>Catálogo</h2><span class="muted">Encuentra productos para tu mascota.</span></div>
        </div>
        <div class="search-row">
            <input class="input" id="catalogSearch" value="${state.search}" placeholder="Buscar productos" aria-label="Buscar productos">
            <button class="btn btn-secondary" id="clearSearch">Limpiar</button>
        </div>
        <div class="filters" style="display:flex; gap:10px; overflow-x:auto; padding-bottom:15px; margin-bottom:15px;">
            ${["todos","perros","gatos","aves","peces","pequenos","reptiles"].map(c => `
                <button class="btn ${state.category === c ? 'btn-primary' : 'btn-secondary'}" data-filter="${c}" style="white-space:nowrap;">
                    ${c === "todos" ? "Todos" : c[0].toUpperCase() + c.slice(1)}
                </button>`).join("")}
        </div>
        <section class="grid">
            ${filtered.length ? filtered.map(productCard).join("") : '<div class="empty" style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-secondary);">No encontramos productos con esos criterios.</div>'}
        </section>
    </div>`;
}

function detailView() {
    const p = product(state.selectedProduct);
    app.innerHTML = `
    <div class="view-page">
        <button class="btn btn-secondary" data-route="catalog" style="margin-bottom:15px;">← Catálogo</button>
        <section class="detail">
            <div class="detail-image"><img src="${p.img}" alt="${p.name}"></div>
            <div class="detail-panel form-card">
                <span class="category">${p.category}</span>
                <h2 style="margin:10px 0;">${p.name}</h2>
                <div class="price" style="font-size:24px;">${money(p.price)}</div>
                ${p.old ? `<span class="muted small"><s>${money(p.old)}</s> · Precio especial</span>` : ""}
                <p class="lead" style="margin:15px 0;">${p.desc}</p>
                <div class="notice" style="color:var(--primary-color); font-size:13px; margin-bottom:15px;">✓ Producto disponible · Compra segura</div>
                
                <div class="qty" style="display:flex; align-items:center; gap:15px; margin-bottom:20px;">
                    <button class="btn btn-secondary" data-action="qtyminus">−</button>
                    <strong id="qtyValue" style="font-size:18px;">${state.qty}</strong>
                    <button class="btn btn-secondary" data-action="qtyplus">+</button>
                </div>
                
                <button class="btn btn-primary btn-wide" data-action="add-detail" data-id="${p.id}">Añadir al carrito</button>
                <button class="btn btn-secondary btn-wide mt" data-route="cart">Ver carrito</button>
            </div>
        </section>
    </div>`;
}

function promosView() {
    const promo = products.filter(p => p.promo);
    app.innerHTML = `
    <div class="view-page">
        <button class="btn btn-secondary" data-route="home" style="margin-bottom:15px;">← Volver</button>
        <div class="promo-banner">
            <div><strong>Hasta 30% OFF</strong><span>Ofertas especiales para tu mascota.</span></div>
            <span style="font-size:40px">🏷️</span>
        </div>
        <div class="section-head">
            <div><h2>Promociones</h2><span class="muted">Aprovecha los productos destacados.</span></div>
        </div>
        <section class="grid">${promo.map(productCard).join("")}</section>
    </div>`;
}

function cartView() {
    const items = cartItems();
    app.innerHTML = `
    <div class="view-page">
        <button class="btn btn-secondary" data-route="home" style="margin-bottom:15px;">← Seguir comprando</button>
        <h2>Mi carrito</h2>
        <div class="cart-layout mt">
            <section>
                ${items.length ? items.map(i => `
                    <article class="cart-item">
                        <img src="${i.product.img}" alt="${i.product.name}">
                        <div>
                            <strong>${i.product.name}</strong>
                            <div class="muted small">${i.product.category}</div>
                            <div class="price">${money(i.product.price)}</div>
                        </div>
                        <div class="item-actions">
                            <button class="btn btn-secondary" data-action="dec" data-id="${i.id}">−</button>
                            <strong>${i.qty}</strong>
                            <button class="btn btn-secondary" data-action="inc" data-id="${i.id}">+</button>
                            <button class="btn btn-danger" data-action="remove" data-id="${i.id}">Eliminar</button>
                        </div>
                    </article>`).join("") : `
                    <div class="empty" style="text-align:center; padding:40px;">
                        <p style="color:var(--text-secondary); margin-bottom:15px;">Tu carrito está vacío.</p>
                        <button class="btn btn-primary" data-route="catalog">Explorar catálogo</button>
                    </div>`}
            </section>
            <aside class="summary">
                <h3>Resumen de compra</h3>
                <div class="summary-row" style="margin-top:15px;"><span>Subtotal</span><strong>${money(cartTotal())}</strong></div>
                <div class="summary-row"><span>Envío</span><strong>${items.length ? "Gratis" : money(0)}</strong></div>
                <div class="summary-row total"><span>Total</span><strong>${money(cartTotal())}</strong></div>
                <button class="btn btn-primary btn-wide mt" ${items.length ? "" : "disabled"} data-route="checkout">Continuar al pago</button>
            </aside>
        </div>
    </div>`;
}

function checkoutView() {
    if (!state.cart.length) { setRoute("cart"); return; }
    app.innerHTML = `
    <div class="view-page">
        <button class="btn btn-secondary" data-route="cart" style="margin-bottom:15px;">← Carrito</button>
        <div class="section-head">
            <div><h2>Checkout / Pago</h2><span class="muted">Confirma tus datos antes de realizar el pago.</span></div>
        </div>
        <div class="checkout">
            <section class="form-card">
                <h3>Datos de entrega</h3>
                <div class="form-grid" style="margin-top:15px;">
                    <div class="form-group"><label>Nombre completo</label><input class="input" id="name" required value="${state.user?.name || ""}" placeholder="Nombre completo"></div>
                    <div class="form-group"><label>Teléfono</label><input class="input" id="phone" required placeholder="300 000 0000"></div>
                    <div class="form-group full"><label>Dirección</label><input class="input" id="address" required placeholder="Calle 123, dirección de entrega"></div>
                    <div class="form-group"><label>Ciudad</label><input class="input" id="city" required placeholder="Ciudad"></div>
                    <div class="form-group"><label>Departamento</label><input class="input" id="department" required placeholder="Departamento"></div>
                </div>
                <div style="border-top:1px solid var(--border-color); margin:20px 0;"></div>
                <h3>Método de pago</h3>
                <select class="select" id="payment" style="margin-top:10px;">
                    <option>Tarjeta terminada en 4567</option>
                    <option>PSE</option>
                    <option>Pago contra entrega</option>
                </select>
                <button class="btn btn-primary btn-wide mt" id="payBtn">Confirmar y pagar · ${money(cartTotal())}</button>
            </section>
            <aside class="summary">
                <h3>Tu pedido</h3>
                ${cartItems().map(i => `<div class="summary-row" style="margin-top:10px;"><span>${i.product.name} × ${i.qty}</span><strong>${money(i.product.price * i.qty)}</strong></div>`).join("")}
                <div class="summary-row total"><span>Total</span><strong>${money(cartTotal())}</strong></div>
            </aside>
        </div>
    </div>`;
}

function confirmationView() {
    const last = state.orders[0];
    app.innerHTML = `
    <div class="view-page" style="display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:80vh; text-align:center;">
        <div class="success-icon" style="font-size:80px; color:var(--primary-color); margin-bottom:20px;">✓</div>
        <h1 style="font-size:28px; margin-bottom:10px;">¡Compra realizada!</h1>
        <p class="lead" style="color:var(--text-secondary); margin-bottom:20px;">Tu pedido ha sido confirmado correctamente.</p>
        <p style="margin-bottom:10px;">Número: <strong>${last?.id || "PM00125"}</strong></p>
        <p class="price" style="font-size:24px; color:var(--primary-color); margin-bottom:30px;">Total pagado: ${money(last?.total || 0)}</p>
        <div class="hero-actions" style="justify-content:center; width:100%;">
            <button class="btn btn-primary" data-route="orders">Ver mi pedido</button>
            <button class="btn btn-secondary" data-route="home">Volver al inicio</button>
        </div>
    </div>`;
}

function loginView() {
    app.innerHTML = `
    <div class="view-page login" style="display:flex; justify-content:center; align-items:center; min-height:80vh;">
        <section class="form-card" style="width:100%; max-width:400px;">
            <div class="center">
                <div class="avatar" style="font-size:30px;">🐾</div>
                <h2>Bienvenido a PetMarket Pro</h2>
                <p class="muted" style="margin-bottom:20px;">Inicia sesión o crea tu cuenta.</p>
            </div>
            <div class="form-grid">
                <div class="form-group full"><label>Correo electrónico</label><input class="input" id="loginEmail" type="email" placeholder="usuario@correo.com"></div>
                <div class="form-group full"><label>Contraseña</label><input class="input" id="loginPass" type="password" placeholder="Ingrese su contraseña"></div>
            </div>
            <button class="btn btn-primary btn-wide mt" id="loginBtn">Iniciar sesión</button>
            <button class="btn btn-secondary btn-wide mt" id="registerBtn">Registrarse</button>
            <p class="center small muted mt">¿Olvidó su contraseña? Puede solicitar recuperación al soporte.</p>
        </section>
    </div>`;
}

function accountView() {
    const name = state.user?.name || "Usuario";
    app.innerHTML = `
    <div class="view-page">
        <section class="form-card">
            <div class="account-head" style="display:flex; align-items:center; gap:15px; margin-bottom:20px;">
                <div class="avatar" style="margin:0; width:60px; height:60px; font-size:24px;"><i class="fas fa-user"></i></div>
                <div>
                    <h2>Mi cuenta</h2>
                    <strong>${name}</strong>
                    <div class="muted">${state.user?.email || "usuario@petmarket.com"}</div>
                </div>
            </div>
            <div class="account-menu">
                <button data-route="orders"><span><i class="fas fa-shopping-bag" style="margin-right:10px;"></i> Mis pedidos</span> <span>›</span></button>
                <button data-route="profile"><span><i class="fas fa-user" style="margin-right:10px;"></i> Datos personales</span> <span>›</span></button>
                <button data-route="profile"><span><i class="fas fa-map-marker-alt" style="margin-right:10px;"></i> Direcciones</span> <span>›</span></button>
                <button id="logoutBtn"><span><i class="fas fa-sign-out-alt" style="margin-right:10px;"></i> Cerrar sesión</span> <span>›</span></button>
            </div>
        </section>
    </div>`;
}

function ordersView() {
    const orders = state.orders.length ? state.orders : [{ id: "PM00125", total: 75490, status: "Entregado", date: "25/09/2026", items: [{ id: 2, qty: 1 }] }];
    app.innerHTML = `
    <div class="view-page">
        <button class="btn btn-secondary" data-route="account" style="margin-bottom:15px;">← Mi cuenta</button>
        <h2>Historial de pedidos</h2>
        <section class="order-list mt">
            ${orders.map(o => {
                const first = product(o.items[0]?.id || 2);
                return `
                <article class="order-card">
                    <img src="${first.img}" alt="${first.name}">
                    <div style="flex:1;">
                        <strong>#${o.id}</strong>
                        <div class="muted small">${o.date || ""}</div>
                        <div>${o.status === "En camino" ? '<span class="status orange">En camino</span>' : '<span class="status">Entregado</span>'}</div>
                    </div>
                    <div style="text-align:right;">
                        <strong>${money(o.total)}</strong>
                        <button class="btn btn-primary mt" data-route="detail" data-id="${first.id}" style="padding:6px 12px; font-size:12px;">Ver detalle</button>
                    </div>
                </article>`;
            }).join("")}
        </section>
    </div>`;
}

function profileView() {
    const u = state.user || {};
    app.innerHTML = `
    <div class="view-page">
        <button class="btn btn-secondary" data-route="account" style="margin-bottom:15px;">← Mi cuenta</button>
        <section class="form-card">
            <h2>Mis datos</h2>
            <p class="muted" style="margin-bottom:20px;">Actualiza tus datos personales y dirección de entrega.</p>
            <div class="form-grid">
                <div class="form-group"><label>Nombre completo</label><input class="input" id="profileName" value="${u.name || ""}"></div>
                <div class="form-group"><label>Correo electrónico</label><input class="input" id="profileEmail" type="email" value="${u.email || ""}"></div>
                <div class="form-group"><label>Teléfono</label><input class="input" id="profilePhone" value="${u.phone || ""}"></div>
                <div class="form-group"><label>Ciudad</label><input class="input" id="profileCity" value="${u.city || ""}"></div>
                <div class="form-group full"><label>Dirección de entrega</label><input class="input" id="profileAddress" value="${u.address || ""}"></div>
                <div class="form-group"><label>Departamento</label><input class="input" id="profileDepartment" value="${u.department || ""}"></div>
            </div>
            <button class="btn btn-primary mt" id="saveProfile">Guardar cambios</button>
        </section>
    </div>`;
}

function contactView() {
    app.innerHTML = `
    <div class="view-page">
        <button class="btn btn-secondary" data-route="home" style="margin-bottom:15px;">← Volver</button>
        <section class="detail">
            <div class="form-card" style="flex:1;">
                <h2>Contáctanos</h2>
                <p style="margin:15px 0;"><i class="fas fa-phone" style="color:var(--primary-color); margin-right:10px;"></i> <strong>Teléfono:</strong> +57 300 000 0000</p>
                <p style="margin-bottom:15px;"><i class="fas fa-envelope" style="color:var(--primary-color); margin-right:10px;"></i> <strong>Correo:</strong> petmarket@petmarket.com</p>
                <p style="margin-bottom:20px;"><i class="fas fa-clock" style="color:var(--primary-color); margin-right:10px;"></i> <strong>Horario:</strong> Lunes a sábado, 8:00 a.m. – 6:00 p.m.</p>
                <div style="background:var(--surface-light); height:150px; border-radius:8px; display:flex; justify-content:center; align-items:center; color:var(--primary-color); font-size:30px;">
                    <i class="fas fa-map-marked-alt"></i>
                </div>
            </div>
            <div class="form-card" style="flex:1;">
                <h2>Envíanos un mensaje</h2>
                <div class="form-grid" style="margin-top:15px;">
                    <div class="form-group full"><label>Nombre</label><input class="input" id="contactName" placeholder="Nombre"></div>
                    <div class="form-group full"><label>Correo</label><input class="input" id="contactEmail" type="email" placeholder="correo@ejemplo.com"></div>
                    <div class="form-group full"><label>Mensaje</label><textarea class="textarea" id="contactMessage" rows="4" placeholder="Escribe tu mensaje"></textarea></div>
                </div>
                <button class="btn btn-primary btn-wide mt" id="sendMessage">Enviar mensaje</button>
            </div>
        </section>
    </div>`;
}

function helpView() {
    const faqs = [
        "¿Cómo realizar una compra?",
        "¿Cuáles son los métodos de pago?",
        "Política de cambios y devoluciones",
        "Política de privacidad",
        "¿Cómo puedo hacer seguimiento a mi pedido?"
    ];
    app.innerHTML = `
    <div class="view-page">
        <button class="btn btn-secondary" data-route="home" style="margin-bottom:15px;">← Volver</button>
        <section class="form-card">
            <h2>Ayuda y políticas</h2>
            <p class="muted" style="margin-bottom:20px;">Información clara para una experiencia segura y accesible.</p>
            <div class="faq mt">
                ${faqs.map((q, i) => `
                    <details>
                        <summary>${q}</summary>
                        <p>${i === 0 ? "Selecciona un producto, añádelo al carrito, revisa el resumen y continúa al pago." : 
                             i === 1 ? "Puedes elegir tarjeta, PSE o pago contra entrega." : 
                             "Consulta esta sección antes de realizar una compra para conocer tus derechos y condiciones."}</p>
                    </details>`).join("")}
            </div>
        </section>
    </div>`;
}

/* ==========================================================================
   LÓGICA DEL CARRITO Y RUTAS
   ========================================================================== */
function addToCart(id, qty = 1) {
    const item = state.cart.find(i => i.id === Number(id));
    if (item) item.qty += qty;
    else state.cart.push({ id: Number(id), qty });
    save();
    toast("Producto añadido al carrito");
    setRoute("cart");
}

function render() {
    const routes = {
        welcome: welcomeView,
        home: homeView,
        catalog: catalogView,
        detail: detailView,
        promos: promosView,
        cart: cartView,
        checkout: checkoutView,
        confirmation: confirmationView,
        login: loginView,
        account: accountView,
        orders: ordersView,
        profile: profileView,
        contact: contactView,
        help: helpView
    };
    (routes[state.route] || homeView)();
    updateActiveNav();
    updateCartCount();
    app.focus({ preventScroll: true });
    app.scrollTo({ top: 0, behavior: "smooth" });
}

function setRoute(route, data = {}) {
    if (data.id) state.selectedProduct = Number(data.id);
    state.route = route;
    sidebar.classList.remove("open");
    render();
}

function updateActiveNav() {
    document.querySelectorAll(".sidebar nav button").forEach(b => {
        const r = b.dataset.route;
        b.classList.toggle("active", r === state.route || 
            (r === "catalog" && state.route === "detail") || 
            (r === "account" && ["login", "orders", "profile"].includes(state.route)));
    });
}

/* ==========================================================================
   EVENT LISTENERS (INTERACTIVIDAD)
   ========================================================================== */
document.addEventListener("click", e => {
    // Navegación por rutas
    const routeEl = e.target.closest("[data-route]");
    if (routeEl) {
        e.preventDefault();
        setRoute(routeEl.dataset.route, { id: routeEl.dataset.id });
        return;
    }

    // Acciones de botones
    const action = e.target.closest("[data-action]");
    if (action) {
        const id = Number(action.dataset.id);
        if (action.dataset.action === "detail") setRoute("detail", { id });
        if (action.dataset.action === "add") addToCart(id);
        if (action.dataset.action === "add-detail") addToCart(id, state.qty);
        
        if (action.dataset.action === "qtyplus") {
            state.qty++;
            const qtyEl = document.getElementById("qtyValue");
            if (qtyEl) qtyEl.textContent = state.qty;
        }
        if (action.dataset.action === "qtyminus") {
            state.qty = Math.max(1, state.qty - 1);
            const qtyEl = document.getElementById("qtyValue");
            if (qtyEl) qtyEl.textContent = state.qty;
        }
        
        if (action.dataset.action === "inc") {
            const item = state.cart.find(i => i.id === id);
            if (item) item.qty++;
            save(); render();
        }
        if (action.dataset.action === "dec") {
            const item = state.cart.find(i => i.id === id);
            if (item) item.qty = Math.max(1, item.qty - 1);
            save(); render();
        }
        if (action.dataset.action === "remove") {
            state.cart = state.cart.filter(i => i.id !== id);
            save(); render(); toast("Producto eliminado");
        }
    }

    // Filtros del catálogo
    const filter = e.target.closest("[data-filter]");
    if (filter) {
        state.category = filter.dataset.filter;
        render();
    }
    
    // Categorías del Home
    const cat = e.target.closest("[data-category-route]");
    if (cat && cat.dataset.categoryRoute !== "todos") {
        state.category = cat.dataset.categoryRoute;
        render();
    }

    // Botones específicos
    if (e.target.id === "menuBtn") sidebar.classList.toggle("open");
    if (e.target.id === "clearSearch") { state.search = ""; render(); }
    
    if (e.target.id === "loginBtn") {
        const email = document.getElementById("loginEmail").value.trim();
        if (!email) { toast("Ingresa tu correo electrónico"); return; }
        state.user = { name: email.split("@")[0], email };
        save(); toast("Sesión iniciada correctamente"); setRoute("account");
    }
    
    if (e.target.id === "registerBtn") {
        const name = prompt("Nombre completo:");
        const email = prompt("Correo electrónico:");
        if (name && email) {
            state.user = { name, email };
            save(); toast("Cuenta creada correctamente"); setRoute("account");
        }
    }
    
    if (e.target.id === "logoutBtn") {
        state.user = null; save(); toast("Sesión cerrada"); setRoute("home");
    }
    
    if (e.target.id === "saveProfile") {
        state.user = {
            ...(state.user || {}),
            name: document.getElementById("profileName").value,
            email: document.getElementById("profileEmail").value,
            phone: document.getElementById("profilePhone").value,
            city: document.getElementById("profileCity").value,
            address: document.getElementById("profileAddress").value,
            department: document.getElementById("profileDepartment").value
        };
        save(); toast("Datos guardados"); setRoute("account");
    }
    
    if (e.target.id === "sendMessage") {
        toast("Mensaje enviado. Gracias por contactarnos.");
        document.getElementById("contactMessage").value = "";
    }
    
    if (e.target.id === "payBtn") {
        const required = ["name", "phone", "address", "city", "department"].map(id => document.getElementById(id));
        if (required.some(x => !x.value.trim())) {
            toast("Completa todos los datos de entrega"); return;
        }
        const order = {
            id: "PM" + String(Math.floor(10000 + Math.random() * 89999)),
            total: cartTotal(),
            status: "En camino",
            date: new Date().toLocaleDateString("es-CO"),
            items: state.cart.map(x => ({ ...x }))
        };
        state.orders.unshift(order);
        state.cart = [];
        save(); setRoute("confirmation");
    }
});

document.addEventListener("input", e => {
    if (e.target.id === "catalogSearch") {
        state.search = e.target.value;
        render();
    }
    if (e.target.id === "homeSearch") {
        state.search = e.target.value;
    }
});

/* ==========================================================================
   INICIALIZACIÓN
   ========================================================================== */
updateCartCount();
render();
