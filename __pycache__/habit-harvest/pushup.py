from utils2 import calculate_angle


class PushupTracker:

    def __init__(self, down_angle=90, up_angle=160):
        self.count = 0
        self.stage = "up"
        self.down_angle = down_angle
        self.up_angle = up_angle

    def update(self, landmarks):

        shoulder = (landmarks[11]["x"], landmarks[11]["y"])
        elbow = (landmarks[13]["x"], landmarks[13]["y"])
        wrist = (landmarks[15]["x"], landmarks[15]["y"])

        angle = calculate_angle(shoulder, elbow, wrist)

        feedback = []

        in_motion = self.down_angle < angle < self.up_angle

        if angle < self.down_angle:
            self.stage = "down"
        elif angle > self.up_angle and self.stage == "down":
            self.stage = "up"
            self.count += 1

        if in_motion:
            hip = landmarks[23]
            shoulder_lm = landmarks[11]

            if hip["y"] < shoulder_lm["y"] - 20:
                feedback.append("Hips are piking up. Keep your body in a straight line.")
            elif hip["y"] > shoulder_lm["y"] + 40:
                feedback.append("Hips are sagging. Engage your core.")

        return {
            "angle": angle,
            "stage": self.stage,
            "count": self.count,
            "feedback": feedback,
        }