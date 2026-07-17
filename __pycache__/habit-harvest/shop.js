// ======================================
// Habit Harvest - shop.js
// ======================================
// Renders the shop catalog and wires purchases to the shared coin
// system in shared.js. Coins earned from workouts (5 per 10 reps) and
// habits (20 per completed habit) can be spent here.
// ======================================

const SHOP_ITEMS = [
    { id: "treat_pack", name: "Treat Pack", emoji: "🍖", price: 60, category: "food" },
    { id: "chicken_treats", name: "Chicken Treats", emoji: "🍗", price: 80, category: "food" },
    { id: "food_healthy", name: "Healthy Food", emoji: "🥩", price: 100, category: "food" },
    { id: "premium_kibble", name: "Premium Kibble", emoji: "🥫", price: 150, category: "food" },

    { id: "chew_bone", name: "Chew Bone", emoji: "🦴", price: 70, category: "toys" },
    { id: "squeaky_ball", name: "Squeaky Ball", emoji: "🎾", price: 90, category: "toys" },
    { id: "toy_fun", name: "Fun Toy", emoji: "🧸", price: 150, category: "toys" },

    { id: "bandana", name: "Bandana", emoji: "🎀", price: 90, category: "accessories" },
    { id: "bow_tie", name: "Bow Tie", emoji: "🎗️", price: 110, category: "accessories" },
    { id: "collar_cool", name: "Cool Collar", emoji: "🧣", price: 200, category: "accessories" },

    { id: "plush_pillow", name: "Plush Pillow", emoji: "🛋️", price: 130, category: "comfort" },
    { id: "blanket_cozy", name: "Cozy Blanket", emoji: "🧵", price: 160, category: "comfort" },
    { id: "bed_cozy", name: "Cozy Bed", emoji: "🛏️", price: 250, category: "comfort" },
];

const grid = document.getElementById("productsGrid");
const tabs = document.querySelectorAll("#categoryTabs .tab-btn");

let activeCategory = "all";

function renderGrid() {
    const items = SHOP_ITEMS.filter(
        item => activeCategory === "all" || item.category === activeCategory
    );

    grid.innerHTML = items.map(item => {
        const owned = HH.isOwned(item.id);
        return `
            <div class="product-card ${owned ? "hh-owned" : ""}" data-hh-item-id="${item.id}">
                <div class="prod-img" style="font-size:44px; display:flex; align-items:center; justify-content:center; height:80px;">
                    ${item.emoji}
                </div>
                <div class="prod-name">${item.name}</div>
                ${owned ? '<div class="owned-tag">Owned ✓</div>' : ""}
                <div class="prod-footer">
                    <div class="prod-price">🪙 ${item.price}</div>
                    <button class="add-btn" ${owned ? "disabled" : ""}
                        onclick="HH.buyItem('${item.id}', ${item.price}, '${item.name}'); renderGrid();">+</button>
                </div>
            </div>
        `;
    }).join("");
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeCategory = tab.dataset.category;
        renderGrid();
    });
});

renderGrid();
