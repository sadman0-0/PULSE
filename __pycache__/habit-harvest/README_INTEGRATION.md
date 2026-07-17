# Habit Harvest — Live Tracking, Coins & Pet Integration

## Important thing to know first

`test.py` opens its own native OpenCV window (`cv2.imshow`) and reads
keyboard presses. A webpage **cannot launch that** — browsers aren't
allowed to spawn desktop apps or camera windows outside themselves,
for security reasons. So "press a button on the website and test.py
runs" isn't something any website can do, on this or any site.

The good news: `api_example.py` was already built for exactly this
situation — it's a small Flask server that receives webcam frames
**from the browser itself** and runs the same pose-tracking logic
(`PoseDetector`, `ExerciseSession`, `SquatTracker`, `PushupTracker`,
`PlankTracker`, `ExerciseClassifier`) that `test.py` uses, just without
the `cv2.imshow` window. That's what the website now talks to.

## How it works

```
 Browser (workout.html)                Your computer (localhost:5000)
 ┌─────────────────────┐               ┌───────────────────────────┐
 │ getUserMedia webcam  │ ── JPEG ───▶  │ api_example.py (Flask)    │
 │ captures a frame     │   frame       │  -> PoseDetector          │
 │ every ~400ms         │               │  -> ExerciseSession       │
 │                      │ ◀── JSON ──── │  -> Squat/Pushup/Plank    │
 │ updates reps/labels  │  {exercise,   │     Trackers +            │
 │ awards coins         │   reps,       │     ExerciseClassifier    │
 └─────────────────────┘   feedback}    └───────────────────────────┘
```

## Setup

1. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the tracking server:
   ```bash
   python api_example.py
   ```
   It runs on `http://localhost:5000`. Leave this terminal open while
   you use the site.
3. Open `dashboard.html` (or `workout.html`) in your browser — a
   double-click works, or serve the folder with any static file server.
4. Click **Start Workout**, then **▶ Start** on the workout page.
   Allow camera access when prompted. Do squats or push-ups in view of
   the camera and watch the exercise name, rep counts, and form
   feedback update live.

> If port 5000 is already in use on your machine (common on macOS,
> where AirPlay Receiver uses it), run
> `python api_example.py` with `app.run(port=5001)` edited in, and
> update `BACKEND_URL` at the top of `workout.js` to match.

## Coin system

All coins are managed by **`shared.js`**, loaded on every page, and
stored in the browser's `localStorage` so the balance is the same
everywhere (dashboard, workout, habits, shop, progress).

- **10 squats → +5 coins.** **10 push-ups → +5 coins.** This repeats
  every 10 reps and is tracked so refreshing the page never double-pays
  you (`workout.js` calls `HH.checkRepRewards(reps)` on every tracking
  update).
- Finishing a workout session adds a **+10 coin bonus**.
- Completing a habit on the Habits page still gives **+20 coins**
  (unchecking it takes them back).
- Spending coins in the shop only affects your *spendable* balance —
  it never reduces your pet's growth (see below).

## Pet evolution (Yuki)

The pet's emoji, name, level, and progress bar are all driven by
`HH.getPetStage()` in `shared.js`, based on **lifetime coins earned**
(not your current spendable balance, so buying items doesn't shrink
your pet):

| Lifetime coins | Stage | Emoji |
|---|---|---|
| 0+ | Egg | 🥚 |
| 200+ | Puppy | 🐶 |
| 500+ | Young Dog | 🐕 |
| 1000+ | Adult Dog | 🦮 |
| 2000+ | Champion Dog | 🐕‍🦺 |

This shows up on the dashboard's companion box, the progress page, and
the shop page. Want different art instead of emoji? Swap the emoji
strings in the `PET_STAGES` array in `shared.js` for `<img>` tags to
real artwork per stage.

## Shop

`shop.html` + `shop.js` are new. It lists 13 items across 4 categories
(Food & Treats, Toys, Accessories, Comfort). Buying an item:
- checks you can afford it (`HH.spendCoins`),
- marks it "Owned" so you can't buy it twice,
- persists in `localStorage` across visits.

The dashboard's shop preview cards are wired the same way, so you can
buy directly from the dashboard too.

## Files changed / added

| File | What changed |
|---|---|
| `shared.js` | **New.** Coin + pet system used everywhere. |
| `shop.html`, `shop.js` | **New.** Functional shop page. |
| `api_example.py` | Added CORS + a `/` health-check route. |
| `workout.html`, `workout.js`, `workout.css` | Real webcam capture wired to the backend; live exercise/rep/feedback display; coin toast. |
| `dashboard.html` | Start Workout now links to `workout.html`; coin counter, shop items, and pet box are all live/functional. |
| `habits.html`, `habits.js` | Coins now go through the shared system. |
| `progress.html` | Coins and pet stage are now live. |

## Known limitations / good next steps

- The backend must be running locally (`localhost:5000`) — it isn't
  deployed anywhere, so this works on your own machine, not if you
  publish the HTML to a public host without also hosting the Flask
  API somewhere reachable.
- Rep detection is only as accurate as MediaPipe's pose model and your
  camera angle/lighting — side-on framing works best for squats and
  push-ups per the existing tracker logic.
- `ExerciseSession` state lives in the Flask process's memory
  (`sessions = {}` in `api_example.py`), so restarting the server
  resets rep counts server-side (the coin *rewards* you've already
  earned are safe in the browser's `localStorage` either way).
