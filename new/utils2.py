import math


def calculate_angle(a, b, c):

    ax, ay = a
    bx, by = b
    cx, cy = c

    angle = math.degrees(
        math.atan2(cy - by, cx - bx) -
        math.atan2(ay - by, ax - bx)
    )

    angle = abs(angle)

    if angle > 180:
        angle = 360 - angle

    return angle


def calculate_vertical_angle(top, bottom):
    """
    Angle (degrees) between the line top->bottom and true vertical.

    0   degrees = perfectly vertical   (e.g. standing upright)
    90  degrees = perfectly horizontal (e.g. lying in a plank)

    Used to tell whether someone is standing (squat territory) or
    horizontal (plank / push-up territory) without needing a manual
    exercise selection.
    """

    dx = bottom[0] - top[0]
    dy = bottom[1] - top[1]

    return math.degrees(math.atan2(abs(dx), abs(dy) + 1e-6))