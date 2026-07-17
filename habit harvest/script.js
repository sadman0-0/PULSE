// ======================================
// Habit Harvest - script.js
// ======================================

// Page Loaded
window.addEventListener("load", function () {
    console.log("Habit Harvest Loaded Successfully 🐶");
});

// ======================================
// Navigation Links
// ======================================

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        const text = this.innerText;

        // Home opens normally
        if (text === "Home") {
            return;
        }

        // Prevent navigation for pages not created yet
        event.preventDefault();

        alert(text + " page is coming soon!");

    });

});

// ======================================
// Get Started Button
// ======================================

const startButton = document.querySelector(".start-btn");

if (startButton) {

    startButton.addEventListener("click", function () {

        // Opens Login Page directly
        window.location.href = "login.html";

    });

}

// ======================================
// Signup Button
// ======================================

const signupButton = document.querySelector(".signup-btn");

if (signupButton) {

    signupButton.addEventListener("click", function () {

        window.location.href = "signup.html";

    });

}

// ======================================
// Feature Card Hover
// ======================================

const cards = document.querySelectorAll(".feature-card");

cards.forEach(function (card) {

    card.addEventListener("mouseenter", function () {

        this.style.transform = "translateY(-10px)";
        this.style.transition = "0.3s";

    });

    card.addEventListener("mouseleave", function () {

        this.style.transform = "translateY(0px)";

    });

});

// ======================================
// Scroll Animation
// ======================================

const observer = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

});

const hiddenElements = document.querySelectorAll(".feature-card, .step");

hiddenElements.forEach(function (el) {

    observer.observe(el);

});

// ======================================
// Footer Year
// ======================================

const footer = document.querySelector("footer p");

if (footer) {

    footer.innerHTML =
        "© " +
        new Date().getFullYear() +
        " Habit Harvest | Grow Better Habits With Your Puppy 🐶";

}

// ======================================
// End of Script
// ======================================
document.addEventListener("DOMContentLoaded", () => {
    const viewAllBtn = document.getElementById("viewAllShopBtn");
    const backBtn = document.getElementById("backToDashboardBtn");

    const dashboardPage = document.getElementById("dashboardPage");
    const fullShopPage = document.getElementById("fullShopPage");

    // When "View all" is clicked, hide dashboard and show shop
    if (viewAllBtn) {
        viewAllBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Stop default link jump behavior
            dashboardPage.classList.add("hidden-view");
            fullShopPage.classList.remove("hidden-view");
            window.scrollTo(0, 0); // Reset scroll to top of new screen
        });
    }

    // Optional: Back button configuration to return to main panel
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            fullShopPage.classList.add("hidden-view");
            dashboardPage.classList.remove("hidden-view");
        });
    }
});



<script>
    // Grab the elements from the document
    const shopModal = document.getElementById('shopModal');
    const openShopBtn = document.getElementById('openShopBtn');
    const closeShopBtn = document.getElementById('closeShopBtn');

    // 1. When the user clicks "View all", show the shop overlay window
    openShopBtn.addEventListener('click', function() {
        shopModal.style.display = 'flex';
    });

    // 2. When the user clicks the "X" button, hide the shop overlay window
    closeShopBtn.addEventListener('click', function() {
        shopModal.style.display = 'none';
    });

    // 3. Optional: If the user clicks on the dark blurred background outside the card, close it too
    window.addEventListener('click', function(event) {
        if (event.target === shopModal) {
        shopModal.style.display = 'none';
        }
    });
</script>