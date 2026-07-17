import cv2
import mediapipe as mp

class PoseDetector:

    def __init__(self):

        self.mp_pose = mp.solutions.pose
        self.mp_draw = mp.solutions.drawing_utils

        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            enable_segmentation=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

        self.landmarks = []

    def find_pose(self, frame, draw=True):

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(rgb)

        self.landmarks = []

        if results.pose_landmarks:

            h, w, _ = frame.shape

            for idx, lm in enumerate(results.pose_landmarks.landmark):

                self.landmarks.append({
                    "id": idx,
                    "x": int(lm.x * w),
                    "y": int(lm.y * h),
                    "z": lm.z,
                    "visibility": lm.visibility
                })

            if draw:
                self.mp_draw.draw_landmarks(
                    frame,
                    results.pose_landmarks,
                    self.mp_pose.POSE_CONNECTIONS
                )

        return frame

    def get_landmarks(self):
        return self.landmarks

    def get_landmark(self, landmark_id):
        if landmark_id < len(self.landmarks):
            return self.landmarks[landmark_id]
        return None

    def get_xy(self, landmark_id):
        lm = self.get_landmark(landmark_id)
        if lm:
            return lm["x"], lm["y"]
        return None
    #test