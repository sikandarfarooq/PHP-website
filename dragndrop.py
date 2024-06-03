import cv2
from cvzone.HandTrackingModule import HandDetector
import cvzone
import numpy as np

cap = cv2.VideoCapture(0)
cap.set(3, 1280)
cap.set(4, 720)
detector = HandDetector(detectionCon=0.8, maxHands=2)
colorR = (255, 0, 255)

class DragRect():
    def __init__(self, posCenter, size=[200, 200]):
        self.posCenter = posCenter
        self.size = size
        self.dragging = False

    def update(self, cursor):
        if self.dragging:
            self.posCenter = cursor

rectList = []
for x in range(5):
    rectList.append(DragRect([x * 250 + 150, 150]))

while True:
    success, img = cap.read()
    img = cv2.flip(img, 1)
    hands, img = detector.findHands(img)

    if hands:
        hand1 = hands[0]
        lmList = hand1["lmList"]

        if lmList:
            thumb_tip = lmList[4][:2]
            index_finger_tip = lmList[8][:2]

            # Find the distance between the thumb and index finger tips
            l, _, _ = detector.findDistance(thumb_tip, index_finger_tip)
            if l < 40:
                for rect in rectList:
                    cx, cy = rect.posCenter
                    w, h = rect.size
                    if cx - w // 2 < index_finger_tip[0] < cx + w // 2 and cy - h // 2 < index_finger_tip[1] < cy + h // 2:
                        rect.dragging = True
                        rect.update(index_finger_tip)
                    else:
                        rect.dragging = False

    imgNew = np.zeros_like(img, np.uint8)
    for rect in rectList:
        cx, cy = rect.posCenter
        w, h = rect.size
        cv2.rectangle(imgNew, (cx - w // 2, cy - h // 2), (cx + w // 2, cy + h // 2), colorR, cv2.FILLED)
        cvzone.cornerRect(imgNew, (cx - w // 2, cy - h // 2, w, h), 20, rt=0)

    out = img.copy()
    alpha = 0.5
    mask = imgNew.astype(bool)
    out[mask] = cv2.addWeighted(img, alpha, imgNew, 1 - alpha, 0)[mask]

    cv2.imshow("Image", out)
    cv2.waitKey(1)
