import cv2
from pose_detector import PoseDetector

cap = cv2.VideoCapture(0)

detector = PoseDetector()

while True:

    success, frame = cap.read()

    if not success:
        break

    frame = detector.find_pose(frame)

    landmarks = detector.get_landmarks()

    if landmarks:

        left_shoulder = landmarks[11]
        left_elbow = landmarks[13]
        left_wrist = landmarks[15]

        cv2.putText(
            frame,
            f"Landmarks: {len(landmarks)}",
            (20,40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0,255,0),
            2
        )

    cv2.imshow("Fitness Tracker", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()