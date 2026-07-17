from squat import SquatTracker
from pushup import PushupTracker
from plank import PlankTracker
from exercise_classifier import ExerciseClassifier


class ExerciseSession:
    """
    UI-agnostic tracker manager. This is the piece meant to be reused
    anywhere: a local webcam loop (see test.py) or a web backend that
    receives frames from a browser (see api_example.py).

    It doesn't touch cv2.imshow, doesn't know about keyboards, and
    doesn't print anything — it just takes landmarks in and returns a
    plain dict out, which is already JSON-serializable.

    Usage:
        session = ExerciseSession()
        result = session.process(landmarks)

        # result looks like:
        # {
        #     "exercise": "Squat" | "Push-Up" | "Plank" | "Static",
        #     "angle": float | None,
        #     "hold_time": float | None,
        #     "feedback": ["Knees are collapsing inward...", ...],
        #     "reps": {"Squat": 4, "Push-Up": 2},
        #     "visible": True | False,
        # }
    """

    REQUIRED_LANDMARKS = {
        "Squat": [23, 24, 25, 26, 27, 31],
        "Push-Up": [11, 12, 13, 15, 23, 24],
        "Plank": [11, 12, 23, 24],
        "Static": [11, 12, 23, 24, 25, 26],
    }

    def __init__(self, auto_detect=True):
        self.trackers = {
            "Squat": SquatTracker(),
            "Push-Up": PushupTracker(),
            "Plank": PlankTracker(),
        }
        self.classifier = ExerciseClassifier()
        self.auto_detect = auto_detect
        self.manual_exercise = None
        self.last_exercise = None

    def set_exercise(self, exercise_name):
        """Force a specific exercise, turning off auto-detection."""
        if exercise_name in self.trackers:
            self.manual_exercise = exercise_name
            self.auto_detect = False

    def enable_auto_detect(self):
        self.auto_detect = True
        self.manual_exercise = None

    def _is_visible(self, landmarks, exercise):
        required = self.REQUIRED_LANDMARKS.get(exercise, [])
        for lm_id in required:
            if lm_id >= len(landmarks):
                return False
            if landmarks[lm_id].get("visibility", 0) < 0.5:
                return False
        return True

    def process(self, landmarks):

        empty_result = {
            "exercise": "Static",
            "angle": None,
            "hold_time": None,
            "feedback": [],
            "reps": self.get_rep_counts(),
            "visible": False,
        }

        if not landmarks:
            return empty_result

        exercise = self.manual_exercise if not self.auto_detect else self.classifier.classify(landmarks)

        visible = self._is_visible(landmarks, exercise)

        # If we've just left the plank position, reset its hold timer so
        # it doesn't silently keep counting from the last time you planked.
        if self.last_exercise == "Plank" and exercise != "Plank":
            self.trackers["Plank"].reset_timer()

        self.last_exercise = exercise

        result = {
            "exercise": exercise,
            "angle": None,
            "hold_time": None,
            "feedback": [],
            "reps": self.get_rep_counts(),
            "visible": visible,
        }

        if not visible or exercise == "Static":
            return result

        try:
            tracker_result = self.trackers[exercise].update(landmarks)
            result["angle"] = tracker_result.get("angle")
            result["hold_time"] = tracker_result.get("hold_time")
            result["feedback"] = tracker_result.get("feedback", [])
            result["reps"] = self.get_rep_counts()
        except (IndexError, KeyError):
            pass

        return result

    def get_rep_counts(self):
        return {
            name: tracker.count
            for name, tracker in self.trackers.items()
            if hasattr(tracker, "count")
        }

    def get_summary(self):
        """End-of-workout summary."""
        return {
            "reps": self.get_rep_counts(),
            "plank_hold_time": round(self.trackers["Plank"].hold_time, 1),
        }

    def reset(self):
        self.trackers = {
            "Squat": SquatTracker(),
            "Push-Up": PushupTracker(),
            "Plank": PlankTracker(),
        }
        self.last_exercise = None