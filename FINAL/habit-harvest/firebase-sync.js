// ======================================
// Habit Harvest - firebase-sync.js
// ======================================
// Bridges Firebase Auth + Firestore with the shared.js coin/pet system.
//
// What this file does on every page that includes it:
//   1. Auth guard — if nobody's logged in, bounces to login.html (public
//      pages like index/login/signup/loading are left alone).
//   2. On login, loads that user's coins/lifetimeCoins/ownedItems from
//      Firestore ("users/{uid}") into localStorage, so shared.js's HH
//      object reflects THEIR saved progress, not just whatever was in
//      this browser before.
//   3. Wraps HH.addCoins / HH.ownItem so every coin change / purchase
//      is pushed back to Firestore automatically (debounced).
//   4. Adds HH.logout() and fills in any [data-hh-username] elements.
//
// Include it AFTER shared.js, as a module:
//   <script src="shared.js"></script>
//   <script type="module" src="firebase-sync.js"></script>
// ======================================

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const PUBLIC_PAGES = ["index.html", "login.html", "signup.html", "loading.html", ""];
const currentPage = window.location.pathname.split("/").pop();

let syncTimer = null;

function scheduleSync(uid) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => pushToFirestore(uid), 800);
}

async function pushToFirestore(uid) {
    try {
        await setDoc(doc(db, "users", uid), {
            coins: HH.getCoins(),
            lifetimeCoins: HH.getLifetimeCoins(),
            ownedItems: HH.getOwnedItems(),
        }, { merge: true });
    } catch (err) {
        console.error("Habit Harvest: failed to sync progress to Firestore:", err);
    }
}

function wrapHHForSync(uid) {
    if (HH._firebaseWrapped) return;
    HH._firebaseWrapped = true;

    const originalAddCoins = HH.addCoins.bind(HH);
    HH.addCoins = (amount) => {
        const result = originalAddCoins(amount);
        scheduleSync(uid);
        return result;
    };

    const originalSpendCoins = HH.spendCoins.bind(HH);
    HH.spendCoins = (amount) => {
        const result = originalSpendCoins(amount);
        if (result) scheduleSync(uid);
        return result;
    };

    const originalOwnItem = HH.ownItem.bind(HH);
    HH.ownItem = (id) => {
        originalOwnItem(id);
        scheduleSync(uid);
    };
}

HH.logout = async function () {
    await signOut(auth);
    window.location.href = "index.html";
};

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        if (!PUBLIC_PAGES.includes(currentPage)) {
            window.location.href = "login.html";
        }
        return;
    }

    // Already logged in but sitting on the login/signup form — move along.
    if (currentPage === "login.html" || currentPage === "signup.html") {
        window.location.href = "loading.html";
        return;
    }

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    let coins = HH.getCoins();
    let lifetimeCoins = HH.getLifetimeCoins();
    let ownedItems = HH.getOwnedItems();

    if (snap.exists()) {
        const data = snap.data();
        coins = data.coins ?? coins;
        lifetimeCoins = data.lifetimeCoins ?? data.coins ?? lifetimeCoins;
        ownedItems = data.ownedItems ?? ownedItems;
    } else {
        // First time we've ever seen this account (e.g. a brand-new
        // Google/Gmail sign-in that skipped the manual signup form).
        await setDoc(userRef, {
            email: user.email,
            username: user.displayName || (user.email ? user.email.split("@")[0] : "Player"),
            coins,
            lifetimeCoins,
            ownedItems,
            createdAt: new Date(),
        }, { merge: true });
    }

    localStorage.setItem("hh_coins", String(coins));
    localStorage.setItem("hh_lifetime_coins", String(lifetimeCoins));
    localStorage.setItem("hh_owned_items", JSON.stringify(ownedItems));

    if (typeof HH.renderAll === "function") HH.renderAll();
    wrapHHForSync(user.uid);

    document.querySelectorAll("[data-hh-username]").forEach(el => {
        el.textContent = user.displayName || user.email || "Player";
    });
});