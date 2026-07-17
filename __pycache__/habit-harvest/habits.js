// Habit Harvest - habits.js
// Coins are now managed by the shared HH system (see shared.js) so the
// balance is consistent across the whole site.

let completed = 0;

// Add New Habit
function addHabit() {

    const input = document.getElementById("habitInput");
    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a habit!");
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <input type="checkbox" onclick="completeHabit(this)">
        ${text}
    `;

    document.getElementById("habitList").appendChild(li);

    input.value = "";
}

// Complete Habit
function completeHabit(box) {

    if (box.checked) {

        completed++;

        HH.addCoins(20);

    } else {

        completed--;

        HH.addCoins(-20);

    }

    updateProgress();

}

// Update Progress Bar
function updateProgress() {

    const total =
        document.querySelectorAll("#habitList input[type='checkbox']").length;

    let percent = Math.round((completed / total) * 100);

    document.getElementById("progressFill").style.width = percent + "%";

    document.getElementById("progressText").innerHTML = percent + "%";

    const mood = document.getElementById("petMood");

    if (percent == 100) {

        mood.innerHTML = "🥳 Super Happy";

    }

    else if (percent >= 75) {

        mood.innerHTML = "😄 Very Happy";

    }

    else if (percent >= 50) {

        mood.innerHTML = "😊 Happy";

    }

    else if (percent >= 25) {

        mood.innerHTML = "🙂 Okay";

    }

    else {

        mood.innerHTML = "😴 Sleepy";

    }

}