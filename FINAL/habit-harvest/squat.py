from utils2 import calculate_angle


class SquatTracker:

    def __init__(self, down_angle=100, up_angle=160):
        self.count = 0
        self.stage = "up"
        self.down_angle = down_angle
        self.up_angle = up_angle

    def update(self, landmarks):

        left_hip = landmarks[23]
        right_hip = landmarks[24]

        left_knee = landmarks[25]
        right_knee = landmarks[26]

        left_ankle = landmarks[27]
        left_toe = landmarks[31]

        hip = (left_hip["x"], left_hip["y"])
        knee = (left_knee["x"], left_knee["y"])
        ankle = (left_ankle["x"], left_ankle["y"])

        angle = calculate_angle(hip, knee, ankle)

        feedback = []

        # Only give form feedback if actually mid-rep
        in_motion = self.down_angle < angle < self.up_angle

        # Rep counting state machine
        if angle < self.down_angle:
            self.stage = "down"
        elif angle > self.up_angle and self.stage == "down":
            self.stage = "up"
            self.count += 1

        if in_motion:
            knee_width = abs(left_knee["x"] - right_knee["x"])
            hip_width = abs(left_hip["x"] - right_hip["x"])

            if knee_width < hip_width * 0.8 and left_knee["y"] > left_hip["y"]:
                feedback.append("Knees are collapsing inward during the squat.")

            if left_knee["x"] > left_toe["x"]:
                feedback.append("Knees are travelling too far over the toes.")

        return {
            "angle": angle,
            "stage": self.stage,
            "count": self.count,
            "feedback": feedback,
        }