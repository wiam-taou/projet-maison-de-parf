// ================= FADE IN =================
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
    });
});
document.querySelectorAll(".fadein").forEach(el => observer.observe(el));

// ================= NAV CATALOGUE =================
const buttons = document.querySelectorAll(".sub-nav button");
const sections = {
    originaux: document.getElementById("originaux"),
    dupes: document.getElementById("dupes"),
    decants: document.getElementById("decants")
};

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        Object.values(sections).forEach(s => s.classList.add("hidden"));
        sections[btn.dataset.target].classList.remove("hidden");
    });
});

// ================= PANIER =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount   = document.getElementById("cart-count");
const cartItems   = document.getElementById("cart-items");
const cartTotal   = document.getElementById("cart-total");
const cartModal   = document.getElementById("cart-modal");
const cartOverlay = document.getElementById("cart-overlay");

// AJOUTER AU PANIER
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    saveCart();
    updateCart();
    openCart();
}

// AFFICHAGE PANIER
function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        count += item.qty;

        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.name}</span>

            <div class="qty-controls">
                <button onclick="decreaseQty(${index})">−</button>
                <span>${item.qty}</span>
                <button onclick="increaseQty(${index})">+</button>
            </div>

            <strong>${item.price * item.qty}€</strong>

            <button class="remove-btn" onclick="removeItem(${index})">✕</button>
        `;

        cartItems.appendChild(li);
    });

    cartCount.textContent = count;
    cartTotal.textContent = total;
}

// QUANTITÉ
function increaseQty(index) {
    cart[index].qty++;
    saveCart();
    updateCart();
}

function decreaseQty(index) {
    if (cart[index].qty > 1) {
        cart[index].qty--;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    updateCart();
}

// SUPPRESSION
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

// LOCAL STORAGE
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// OUVERTURE / FERMETURE
function openCart() {
    cartModal.classList.add("show");
    cartOverlay.classList.add("show");
}

function closeCart() {
    cartModal.classList.remove("show");
    cartOverlay.classList.remove("show");
}

function toggleCart() {
    cartModal.classList.toggle("show");
    cartOverlay.classList.toggle("show");
}

// INIT
updateCart();

// ================= RENDRE ACCESSIBLE AU HTML =================
window.addToCart   = addToCart;
window.toggleCart  = toggleCart;
window.closeCart   = closeCart;
window.removeItem  = removeItem;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;

// ================= COMMANDE =================
function checkout() {
    if (cart.length === 0) {
        alert("Votre panier est vide");
        return;
    }

    // Sauvegarder le panier pour la page checkout
    localStorage.setItem("order", JSON.stringify(cart));

    // Redirection vers la page formulaire
    window.location.href = "checkout.html";
}

// rendre accessible au HTML
window.checkout = checkout;


// ================= CHECKOUT FORM =================
const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(e) {
        e.preventDefault(); // empêche le rechargement de page

        const client = {
            nom: document.getElementById("nom").value,
            prenom: document.getElementById("prenom").value,
            ville: document.getElementById("ville").value,
            tel: document.getElementById("tel").value
        };

        localStorage.setItem("client", JSON.stringify(client));
        localStorage.setItem("orderConfirmed", "true");

        window.location.href = "thankyou.html"; // redirection
    });
}
