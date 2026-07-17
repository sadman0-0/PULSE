// ======================================
// Habit Harvest - workout.js
// ======================================
// Connects the workout page to the pose-tracking backend (api_example.py)
// over the browser's webcam, and to the shared coin/pet system (shared.js).
//
// IMPORTANT: this requires api_example.py to be running locally first:
//   pip install flask flask-cors opencv-python-headless numpy mediapipe
//   python api_example.py
// ======================================

const BACKEND_URL = "http://localhost:5000";
const FRAME_INTERVAL_MS = 400; // ~2.5 frames/sec is plenty for rep counting

// HTML Elements
const video = document.getElementById("webcam");
const canvas = document.getElementById("captureCanvas");
const ctx = canvas.getContext("2d");

const exerciseLabel = document.getElementById("exerciseLabel");
const timerDisplay = document.getElementById("timer");
const repsDisplay = document.getElementById("reps");
const caloriesDisplay = document.getElementById("calories");
const feedbackBox = document.getElementById("feedbackBox");
const petMessage = document.getElementById("petMessage");
const coinToast = document.getElementById("coinToast");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const finishBtn = document.getElementById("finishBtn");

// State
let stream = null;
let captureInterval = null;
let elapsedInterval = null;
let elapsedSeconds = 0;
let running = false;
let latestReps = { "Squat": 0, "Push-Up": 0 };

const sessionId = HH.getSessionId();

// ======================================
// Elapsed time display
// ======================================

function updateTimerDisplay() {
    const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
    const seconds = String(elapsedSeconds % 60).padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// ======================================
// Camera
// ======================================

async function startCamera() {
    stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
    });
    video.srcObject = stream;
    await video.play();
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    video.srcObject = null;
}

// ======================================
// Frame capture + backend call
// ======================================

function captureFrameBase64() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
}

async function sendFrame() {
    if (!video.videoWidth) return;

    const image = captureFrameBase64();

    try {
        const res = await fetch(`${BACKEND_URL}/process_frame`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId, image }),
        });

        if (!res.ok) throw new Error(`backend responded ${res.status}`);

        const result = await res.json();
        handleResult(result);

    } catch (err) {
        exerciseLabel.textContent = "⚠️ Tracking server not reachable";
        feedbackBox.textContent = "Start api_example.py on your computer, then press Start again.";
        console.error("Tracking request failed:", err);
    }
}

function handleResult(result) {
    const exercise = result.exercise || "Static";
    const reps = result.reps || {};
    latestReps = reps;

    exerciseLabel.textContent = result.visible
        ? exercise
        : `${exercise} — step fully into frame`;

    repsDisplay.textContent =
        `Squats: ${reps["Squat"] || 0} · Push-Ups: ${reps["Push-Up"] || 0}`;

    const totalReps = (reps["Squat"] || 0) + (reps["Push-Up"] || 0);
    caloriesDisplay.textContent = Math.round(totalReps * 0.4) + " kcal";

    if (result.hold_time != null) {
        petMessage.textContent = `🧘 Holding plank: ${result.hold_time.toFixed(1)}s`;
    } else if (result.feedback && result.feedback.length) {
        petMessage.textContent = "⚠️ Check your form!";
    } else if (exercise === "Static") {
        petMessage.textContent = "😊 Ready when you are!";
    } else {
        petMessage.textContent = "💪 Nice form, keep going!";
    }

    feedbackBox.textContent = (result.feedback && result.feedback.length)
        ? result.feedback.join(" ")
        : "";

    const earned = HH.checkRepRewards(reps);
    if (earned.length) {
        showCoinToast(earned.join(" "));
    }
}

function showCoinToast(text) {
    coinToast.textContent = "🪙 " + text;
    coinToast.classList.add("show");
    clearTimeout(showCoinToast._t);
    showCoinToast._t = setTimeout(() => coinToast.classList.remove("show"), 2500);
}

// ======================================
// Start Workout
// ======================================

startBtn.addEventListener("click", async () => {
    if (running) return;

    try {
        await startCamera();
    } catch (err) {
        alert("Camera access is needed to track your workout. Please allow camera access and try again.");
        console.error(err);
        return;
    }

    running = true;
    petMessage.textContent = "🏃 Tracking started — get moving!";

    captureInterval = setInterval(sendFrame, FRAME_INTERVAL_MS);
    elapsedInterval = setInterval(() => {
        elapsedSeconds++;
        updateTimerDisplay();
    }, 1000);
});

// ======================================
// Pause
// ======================================

pauseBtn.addEventListener("click", () => {
    running = false;
    clearInterval(captureInterval);
    clearInterval(elapsedInterval);
    captureInterval = null;
    elapsedInterval = null;
    petMessage.textContent = "⏸ Workout paused";
});

// ======================================
// Reset
// ======================================

resetBtn.addEventListener("click", async () => {
    running = false;
    clearInterval(captureInterval);
    clearInterval(elapsedInterval);
    captureInterval = null;
    elapsedInterval = null;
    elapsedSeconds = 0;
    updateTimerDisplay();

    try {
        await fetch(`${BACKEND_URL}/reset/${sessionId}`, { method: "POST" });
    } catch (err) {
        console.error(err);
    }

    HH.resetWorkoutRewardTracking();
    latestReps = { "Squat": 0, "Push-Up": 0 };
    exerciseLabel.textContent = "Static";
    repsDisplay.textContent = "Squats: 0 · Push-Ups: 0";
    caloriesDisplay.textContent = "0 kcal";
    feedbackBox.textContent = "";
    petMessage.textContent = "😊 Ready to exercise!";
});

// ======================================
// Finish Workout
// ======================================

finishBtn.addEventListener("click", async () => {
    running = false;
    clearInterval(captureInterval);
    clearInterval(elapsedInterval);
    captureInterval = null;
    elapsedInterval = null;
    stopCamera();

    // Small bonus just for completing a session, on top of the
    // +5-coins-per-10-reps rewards already earned during tracking.
    HH.addCoins(10);

    let summaryText = "";
    try {
        const res = await fetch(`${BACKEND_URL}/summary/${sessionId}`);
        const summary = await res.json();
        summaryText =
            `Squats: ${summary.reps?.["Squat"] || 0}\n` +
            `Push-Ups: ${summary.reps?.["Push-Up"] || 0}\n` +
            `Plank hold: ${(summary.plank_hold_time || 0)}s`;
    } catch (err) {
        summaryText = `Squats: ${latestReps["Squat"] || 0}\nPush-Ups: ${latestReps["Push-Up"] || 0}`;
    }

    petMessage.textContent = "🥳 Awesome work!";
    alert(`🎉 Workout Finished!\n\n${summaryText}\n\n+10 bonus coins added!`);
});

// ======================================
// Initialize
// ======================================
updateTimerDisplay();
petMessage.textContent = "😊 Press Start to begin tracking!";
