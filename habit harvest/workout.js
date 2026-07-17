// ======================================
// Habit Harvest - workout.js
// ======================================

// Initial Values
let timeLeft = 30;
let timer = null;

let reps = 0;
let calories = 0;
let coins = 350;

// HTML Elements
const timerDisplay = document.getElementById("timer");
const repsDisplay = document.getElementById("reps");
const caloriesDisplay = document.getElementById("calories");
const coinsDisplay = document.getElementById("coins");
const petMessage = document.getElementById("petMessage");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const finishBtn = document.getElementById("finishBtn");

// ======================================
// Display Timer
// ======================================

function updateTimer() {

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// ======================================
// Start Workout
// ======================================

startBtn.addEventListener("click", () => {

    if (timer !== null) return;

    petMessage.textContent = "🏃 Keep Going!";

    timer = setInterval(() => {

        if (timeLeft > 0) {

            timeLeft--;

            reps++;

            calories += 2;

            updateTimer();

            repsDisplay.textContent = reps + " / 20";

            caloriesDisplay.textContent = calories + " kcal";

        } else {

            clearInterval(timer);

            timer = null;

            petMessage.textContent = "🎉 Workout Completed!";

            alert("Great Job! Workout Finished.");

        }

    }, 1000);

});

// ======================================
// Pause
// ======================================

pauseBtn.addEventListener("click", () => {

    clearInterval(timer);

    timer = null;

    petMessage.textContent = "⏸ Workout Paused";

});

// ======================================
// Reset
// ======================================

resetBtn.addEventListener("click", () => {

    clearInterval(timer);

    timer = null;

    timeLeft = 30;

    reps = 0;

    calories = 0;

    updateTimer();

    repsDisplay.textContent = "0 / 20";

    caloriesDisplay.textContent = "0 kcal";

    petMessage.textContent = "😊 Ready to Exercise!";

});

// ======================================
// Finish Workout
// ======================================

finishBtn.addEventListener("click", () => {

    coins += 50;

    coinsDisplay.textContent = coins;

    petMessage.textContent = "🥳 Awesome Work!";

    alert("🎉 Congratulations!\n\nYou earned 50 Coins!");

});

// ======================================
// Initialize
// ======================================

updateTimer();