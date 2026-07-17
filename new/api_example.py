"""
Minimal example of plugging the pose-tracking engine into a web backend.

A real frontend would grab frames from the browser's webcam (getUserMedia
+ canvas), POST each one as a base64 JPEG to /process_frame every ~100ms,
and render the JSON response (rep counts, current exercise, feedback).

Run:
    pip install flask opencv-python-headless numpy mediapipe
    python api_example.py

Then, from your frontend (or curl/Postman for testing):
    POST http://localhost:5000/process_frame
    { "session_id": "abc123", "image": "<base64 jpeg, no data: prefix>" }

    GET  http://localhost:5000/summary/abc123
    POST http://localhost:5000/reset/abc123
"""

import base64

import cv2
import numpy as np
from flask import Flask, request, jsonify

from pose_detector import PoseDetector
from exercise_session import ExerciseSession

app = Flask(__name__)

# One PoseDetector can be shared across requests (it's stateless per-call).
# ExerciseSession must be per-user, since it holds rep counts and timers.
detector = PoseDetector()
sessions = {}  # session_id -> ExerciseSession
# NOTE: this in-memory dict is fine for a single-process demo. For real
# production use (multiple workers, restarts), back this with Redis or a
# database keyed by session_id instead.


def get_session(session_id):
    if session_id not in sessions:
        sessions[session_id] = ExerciseSession(auto_detect=True)
    return sessions[session_id]


def decode_image(base64_str):
    img_bytes = base64.b64decode(base64_str)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)


@app.route("/process_frame", methods=["POST"])
def process_frame():
    data = request.get_json(force=True)

    session_id = data.get("session_id")
    image_b64 = data.get("image")

    if not session_id or not image_b64:
        return jsonify({"error": "session_id and image are required"}), 400

    frame = decode_image(image_b64)
    if frame is None:
        return jsonify({"error": "could not decode image"}), 400

    frame = detector.find_pose(frame, draw=False)
    landmarks = detector.get_landmarks()

    session = get_session(session_id)
    result = session.process(landmarks)

    return jsonify(result)


@app.route("/set_exercise/<session_id>", methods=["POST"])
def set_exercise(session_id):
    """Let the frontend force a specific exercise instead of auto-detect,
    e.g. if the user picks 'Squat' from a menu before starting."""
    data = request.get_json(force=True)
    exercise = data.get("exercise")

    session = get_session(session_id)

    if exercise == "auto":
        session.enable_auto_detect()
    elif exercise in session.trackers:
        session.set_exercise(exercise)
    else:
        return jsonify({"error": f"unknown exercise '{exercise}'"}), 400

    return jsonify({"status": "ok"})


@app.route("/summary/<session_id>", methods=["GET"])
def summary(session_id):
    if session_id not in sessions:
        return jsonify({"error": "unknown session_id"}), 404
    return jsonify(sessions[session_id].get_summary())


@app.route("/reset/<session_id>", methods=["POST"])
def reset(session_id):
    if session_id in sessions:
        sessions[session_id].reset()
    return jsonify({"status": "reset"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)