// ======================================
// Habit Harvest - shared.js
// ======================================
// One shared coin + pet-evolution system used by every page
// (dashboard, workout, habits, progress, shop). Backed by
// localStorage so progress carries over between pages.
//
// How other pages use this file:
//   1. Include it BEFORE any page-specific script:
//        <script src="shared.js"></script>
//   2. Mark any element that should auto-display live data:
//        <span data-hh-coins>350</span>            -> spendable coin balance
//        <span data-hh-pet-emoji>🐶</span>          -> current pet stage emoji
//        <span data-hh-pet-name>Puppy</span>        -> current pet stage name
//        <span data-hh-pet-level>Level 2</span>     -> current pet level
//        <div  data-hh-pet-progress></div>          -> width set to % to next stage
//        <span data-hh-pet-xp>200 / 500 coins</span>-> progress toward next stage
//   3. To award/spend coins from any page's own script, call:
//        HH.addCoins(20)
//        HH.spendCoins(100)   // returns false if not enough coins
//        HH.buyItem('cozy_bed', 250, 'Cozy Bed')
// ======================================

const HH_KEYS = {
    COINS: "hh_coins",
    LIFETIME: "hh_lifetime_coins",
    OWNED: "hh_owned_items",
    SESSION_ID: "hh_session_id",
    REWARDED_SQUAT: "hh_rewarded_squat",
    REWARDED_PUSHUP: "hh_rewarded_pushup",
};

const HH_STARTING_COINS = 350;

// Pet grows based on LIFETIME coins earned (spending doesn't shrink it).
const PET_STAGES = [
    { min: 0, name: "Egg", emoji: "🥚", level: 1 },
    { min: 200, name: "Puppy", emoji: "🐶", level: 2 },
    { min: 500, name: "Young Dog", emoji: "🐕", level: 3 },
    { min: 1000, name: "Adult Dog", emoji: "🦮", level: 4 },
    { min: 2000, name: "Champion Dog", emoji: "🐕‍🦺", level: 5 },
];

const HH = {

    // ---------- Coins ----------

    getCoins() {
        const raw = localStorage.getItem(HH_KEYS.COINS);
        return raw === null ? HH_STARTING_COINS : parseInt(raw, 10);
    },

    getLifetimeCoins() {
        const raw = localStorage.getItem(HH_KEYS.LIFETIME);
        return raw === null ? HH_STARTING_COINS : parseInt(raw, 10);
    },

    // amount can be negative (e.g. unchecking a completed habit).
    // Only positive amounts count toward the pet's lifetime growth.
    addCoins(amount) {
        const newCoins = Math.max(0, this.getCoins() + amount);
        localStorage.setItem(HH_KEYS.COINS, String(newCoins));

        if (amount > 0) {
            const newLifetime = this.getLifetimeCoins() + amount;
            localStorage.setItem(HH_KEYS.LIFETIME, String(newLifetime));
        }

        this.renderAll();
        return newCoins;
    },

    spendCoins(amount) {
        const current = this.getCoins();
        if (current < amount) return false;
        localStorage.setItem(HH_KEYS.COINS, String(current - amount));
        this.renderAll();
        return true;
    },

    // ---------- Shop ----------

    getOwnedItems() {
        try {
            return JSON.parse(localStorage.getItem(HH_KEYS.OWNED) || "[]");
        } catch {
            return [];
        }
    },

    ownItem(id) {
        const owned = this.getOwnedItems();
        if (!owned.includes(id)) {
            owned.push(id);
            localStorage.setItem(HH_KEYS.OWNED, JSON.stringify(owned));
        }
    },

    isOwned(id) {
        return this.getOwnedItems().includes(id);
    },

    buyItem(id, cost, name) {
        if (this.isOwned(id)) {
            alert(`You already own ${name}!`);
            return false;
        }
        if (this.spendCoins(cost)) {
            this.ownItem(id);
            alert(`🎉 You bought ${name} for ${cost} coins!`);
            this.renderAll();
            return true;
        }
        alert(`Not enough coins! You need ${cost - this.getCoins()} more coins for ${name}.`);
        return false;
    },

    // ---------- Workout tracking session ----------

    getSessionId() {
        let id = localStorage.getItem(HH_KEYS.SESSION_ID);
        if (!id) {
            id = "hh_" + Math.random().toString(36).slice(2, 10);
            localStorage.setItem(HH_KEYS.SESSION_ID, id);
        }
        return id;
    },

    // Call with the `reps` object returned by the tracking backend, e.g.
    // { "Squat": 12, "Push-Up": 4 }. Every time a tracked exercise crosses
    // a new multiple of 10 reps, awards 5 coins for that batch of 10.
    // Safe to call repeatedly (won't double-award), and safe across
    // page reloads since the rewarded count is persisted too.
    checkRepRewards(reps) {
        const earned = [];

        const squat = reps["Squat"] || 0;
        const pushup = reps["Push-Up"] || 0;

        const squatRewarded = parseInt(localStorage.getItem(HH_KEYS.REWARDED_SQUAT) || "0", 10);
        const pushupRewarded = parseInt(localStorage.getItem(HH_KEYS.REWARDED_PUSHUP) || "0", 10);

        const newSquatBatches = Math.floor(squat / 10) - squatRewarded;
        const newPushupBatches = Math.floor(pushup / 10) - pushupRewarded;

        if (newSquatBatches > 0) {
            this.addCoins(newSquatBatches * 5);
            localStorage.setItem(HH_KEYS.REWARDED_SQUAT, String(squatRewarded + newSquatBatches));
            earned.push(`+${newSquatBatches * 5} coins for ${newSquatBatches * 10} squats!`);
        }

        if (newPushupBatches > 0) {
            this.addCoins(newPushupBatches * 5);
            localStorage.setItem(HH_KEYS.REWARDED_PUSHUP, String(pushupRewarded + newPushupBatches));
            earned.push(`+${newPushupBatches * 5} coins for ${newPushupBatches * 10} push-ups!`);
        }

        return earned;
    },

    resetWorkoutRewardTracking() {
        localStorage.setItem(HH_KEYS.REWARDED_SQUAT, "0");
        localStorage.setItem(HH_KEYS.REWARDED_PUSHUP, "0");
    },

    // ---------- Pet ----------

    getPetStage() {
        const lifetime = this.getLifetimeCoins();
        let stage = PET_STAGES[0];
        for (const s of PET_STAGES) {
            if (lifetime >= s.min) stage = s;
        }
        const idx = PET_STAGES.indexOf(stage);
        const next = PET_STAGES[idx + 1] || null;
        const progress = next
            ? Math.min(100, Math.round(((lifetime - stage.min) / (next.min - stage.min)) * 100))
            : 100;
        return { ...stage, next, progress, lifetime };
    },

    // ---------- Rendering ----------

    renderAll() {
        const coins = this.getCoins();

        document.querySelectorAll("[data-hh-coins]").forEach(el => {
            el.textContent = coins;
        });

        const stage = this.getPetStage();

        document.querySelectorAll("[data-hh-pet-emoji]").forEach(el => {
            el.textContent = stage.emoji;
        });
        document.querySelectorAll("[data-hh-pet-name]").forEach(el => {
            el.textContent = stage.name;
        });
        document.querySelectorAll("[data-hh-pet-level]").forEach(el => {
            el.textContent = "Level " + stage.level;
        });
        document.querySelectorAll("[data-hh-pet-progress]").forEach(el => {
            el.style.width = stage.progress + "%";
        });
        document.querySelectorAll("[data-hh-pet-xp]").forEach(el => {
            el.textContent = stage.next
                ? `${stage.lifetime} / ${stage.next.min} coins to ${stage.next.name}`
                : `${stage.lifetime} coins (max level!)`;
        });

        // Grey out any shop items already owned.
        document.querySelectorAll("[data-hh-item-id]").forEach(el => {
            const id = el.getAttribute("data-hh-item-id");
            el.classList.toggle("hh-owned", this.isOwned(id));
        });
    },
};

document.addEventListener("DOMContentLoaded", () => HH.renderAll());
