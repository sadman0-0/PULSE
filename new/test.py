import cv2
import requests
import pyttsx3
import threading
import time
from pose_detector import PoseDetector
from exercise_session import ExerciseSession

# -----------------------------
# Text-to-Speech
# -----------------------------
engine = pyttsx3.init()
last_feedback_time = 0


def speak_text(text):
    try:
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Audio Error: {e}")


def trigger_live_feedback(exercise_name, issue_description):
    global last_feedback_time

    current_time = time.time()

    # Prevent API spam
    if current_time - last_feedback_time < 5:
        return

    last_feedback_time = current_time

    def api_worker():
        try:
            url = "http://localhost:3000/api/pose-coach"

            payload = {
                "exercise": exercise_name,
                "trackingIssue": issue_description
            }

            response = requests.post(url, json=payload, timeout=3)

            if response.status_code == 200:
                data = response.json()

                cue = data.get("correctionCue")

                if cue:
                    print(f"🤖 AI Coach: {cue}")

                    threading.Thread(
                        target=speak_text,
                        args=(cue,),
                        daemon=True
                    ).start()

        except Exception as e:
            print(f"Server Error: {e}")

    threading.Thread(target=api_worker, daemon=True).start()


# -----------------------------
# Camera & Session
# -----------------------------
cap = cv2.VideoCapture(0)

detector = PoseDetector()

# ExerciseSession auto-detects Squat / Push-Up / Plank / Static from body
# geometry each frame. Manual override is still available via 1/2/3 keys.
session = ExerciseSession(auto_detect=True)

MANUAL_KEYS = {
    ord('1'): "Squat",
    ord('2'): "Plank",
    ord('3'): "Push-Up",
}

print("🚀 Tracking Started. Auto-detect is ON.")
print("Press 1/2/3 to force an exercise, 'a' to return to auto, 'q' to quit.")

while True:

    success, frame = cap.read()

    if not success:
        break

    frame = detector.find_pose(frame)
    landmarks = detector.get_landmarks()

    result = session.process(landmarks)

    for issue in result["feedback"]:
        trigger_live_feedback(result["exercise"], issue)

    # -----------------------------
    # UI
    # -----------------------------

    status_color = (0, 255, 0) if result["exercise"] != "Static" else (180, 180, 180)

    cv2.putText(
        frame,
        f"Status: {result['exercise']}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        status_color,
        2
    )

    cv2.putText(
        frame,
        f"Landmarks: {len(landmarks)}",
        (20, 80),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 255),
        2
    )

    reps = result["reps"]
    cv2.putText(
        frame,
        f"Squats: {reps.get('Squat', 0)}   Push-Ups: {reps.get('Push-Up', 0)}",
        (20, 120),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 0),
        2
    )

    if result["angle"] is not None:
        cv2.putText(
            frame,
            f"Angle: {int(result['angle'])}",
            (20, 160),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 0),
            2
        )

    if result["hold_time"] is not None:
        cv2.putText(
            frame,
            f"Hold: {result['hold_time']:.1f}s",
            (20, 160),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 0),
            2
        )

    cv2.imshow("Fitness Tracker", frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord("q"):
        break
    elif key == ord("a"):
        session.enable_auto_detect()
        print("➡️  Auto-detect ON")
    elif key in MANUAL_KEYS:
        session.set_exercise(MANUAL_KEYS[key])
        print(f"➡️  Manual mode: {MANUAL_KEYS[key]}")

cap.release()
cv2.destroyAllWindows()