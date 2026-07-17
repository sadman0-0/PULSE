import time


class PlankTracker:

    def __init__(self, sag_threshold=15, pike_threshold=15):
        self.sag_threshold = sag_threshold
        self.pike_threshold = pike_threshold
        self.start_time = None
        self.hold_time = 0.0

    def update(self, landmarks):

        shoulder = landmarks[12]
        hip = landmarks[24]

        feedback = []

        # NOTE: previously this checked abs(shoulder["x"] - hip["x"]) < 50,
        # which is backwards — in a real plank (viewed from the side) the
        # shoulder and hip are FAR apart on the x-axis (body horizontal),
        # not close together. That check would almost never pass. It's
        # removed here; the ExerciseClassifier now confirms you're
        # horizontal before this tracker is even called.

        if hip["y"] > shoulder["y"] + self.sag_threshold:
            feedback.append("Your hips are sagging. Tighten your core.")
        elif hip["y"] < shoulder["y"] - self.pike_threshold:
            feedback.append("Lower your hips slightly.")

        if self.start_time is None:
            self.start_time = time.time()

        self.hold_time = time.time() - self.start_time

        return {
            "hold_time": self.hold_time,
            "feedback": feedback,
        }

    def reset_timer(self):
        """Call when the person leaves the plank position, so the next
        hold starts from zero instead of resuming an old timer."""
        self.start_time = None
        self.hold_time = 0.0