from utils2 import calculate_angle, calculate_vertical_angle


class ExerciseClassifier:
    """
    Looks at raw landmarks each frame and decides what the person is
    actually doing right now: "Squat", "Push-Up", "Plank", or "Static"
    (standing around / not exercising).

    This is what was missing before. Previously the exercise label came
    only from whatever key was last pressed (or the hardcoded default),
    so it always said "Squat" no matter what the body was doing. This
    class reads real body geometry instead:

      1. Torso angle (shoulder -> hip vs. vertical) tells us if the
         person is standing upright or lying horizontal.
      2. If standing upright: knee angle tells us if they're mid-squat
         or just standing still ("Static").
      3. If horizontal: elbow angle tells us if they're actively
         pushing (Push-Up) or holding steady (Plank).
    """

    def __init__(self,
                 vertical_threshold=45,     # torso angle below this = standing
                 squat_knee_angle=160,      # knee angle below this while standing = squatting
                 pushup_elbow_angle=160):   # elbow angle below this while horizontal = push-up

        self.vertical_threshold = vertical_threshold
        self.squat_knee_angle = squat_knee_angle
        self.pushup_elbow_angle = pushup_elbow_angle

    def classify(self, landmarks):

        try:
            shoulder = (landmarks[12]["x"], landmarks[12]["y"])
            hip = (landmarks[24]["x"], landmarks[24]["y"])
            knee = (landmarks[26]["x"], landmarks[26]["y"])
            ankle = (landmarks[28]["x"], landmarks[28]["y"])
            elbow = (landmarks[14]["x"], landmarks[14]["y"])
            wrist = (landmarks[16]["x"], landmarks[16]["y"])
        except (IndexError, KeyError):
            return "Static"

        torso_angle = calculate_vertical_angle(shoulder, hip)

        if torso_angle < self.vertical_threshold:
            # Standing / vertical body
            knee_angle = calculate_angle(hip, knee, ankle)

            if knee_angle < self.squat_knee_angle:
                return "Squat"
            return "Static"

        else:
            # Horizontal body -> plank position, either holding or pushing
            elbow_angle = calculate_angle(shoulder, elbow, wrist)

            if elbow_angle < self.pushup_elbow_angle:
                return "Push-Up"
            return "Plank"