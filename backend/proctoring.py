# import cv2
# import time
# import os  # Import os to use afplay for playing sound

# # Global variables to track proctoring status
# warnings = 0
# end_proctoring = False
# warning_cooldown = 10  # Cooldown period to prevent repeated warnings (seconds)

# # Initialize face detector
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# # Function to play a beep sound using afplay
# def play_beep():
#     os.system("afplay /System/Library/Sounds/Glass.aiff")  # Play a default system sound

# # Function to start proctoring
# def start_proctoring():
#     global warnings, end_proctoring
#     print("Proctoring started...")

#     cap = cv2.VideoCapture(0)
#     face_missing_count = 0
#     face_multiple_count = 0
#     missing_threshold = 10
#     multiple_threshold = 10
#     waiting_time = 10

#     # Track time of the last warning to prevent duplicates
#     last_warning_time = time.time() - warning_cooldown

#     while True:
#         if end_proctoring:
#             break

#         ret, frame = cap.read()
#         if not ret:
#             print("Error: Failed to read from camera.")
#             break

#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))

#         current_time = time.time()

#         if len(faces) == 0:
#             face_missing_count += 1
#             if face_missing_count >= missing_threshold and current_time - last_warning_time >= warning_cooldown:
#                 warnings += 1
#                 last_warning_time = current_time
#                 print(f"Warning {warnings}: No face detected.")
#                 play_beep()  # Play beep sound
#                 face_missing_count = 0
#                 time.sleep(waiting_time)

#         elif len(faces) > 1:
#             face_multiple_count += 1
#             if face_multiple_count >= multiple_threshold and current_time - last_warning_time >= warning_cooldown:
#                 warnings += 1
#                 last_warning_time = current_time
#                 print(f"Warning {warnings}: Multiple faces detected.")
#                 play_beep()  # Play beep sound
#                 face_multiple_count = 0
#                 time.sleep(waiting_time)

#         else:
#             face_missing_count = 0
#             face_multiple_count = 0

#         if warnings >= 3:
#             print("Proctoring ended due to multiple warnings.")
#             play_beep()  # Final beep sound for proctoring end
#             end_proctoring = True
#             break

#         time.sleep(0.1)

#     cap.release()
#     print("Proctoring has stopped.")







# proctoring.py

import cv2
import time
import os

# Global variables to track proctoring status
warnings = 0
end_proctoring = False
warning_cooldown = 10  # Cooldown period to prevent repeated warnings (seconds)
last_warning = ""  # Store the last warning message

# Initialize face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def get_last_warning():
    """Return the last warning message."""
    return last_warning

def play_beep():
    os.system("afplay /System/Library/Sounds/Glass.aiff")

def start_proctoring():
    global warnings, end_proctoring, last_warning
    print("Proctoring started...")


    cap = cv2.VideoCapture(0)
    face_missing_count = 0
    face_multiple_count = 0
    missing_threshold = 10
    multiple_threshold = 10
    waiting_time = 10

    last_warning_time = time.time() - warning_cooldown

    while True:
        if end_proctoring:
            break

        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to read from camera.")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
        current_time = time.time()

        if len(faces) == 0:
            face_missing_count += 1
            if face_missing_count >= missing_threshold and current_time - last_warning_time >= warning_cooldown:
                warnings += 1
                last_warning = f"Warning {warnings}: No face detected."
                print(last_warning)
                play_beep()
                last_warning_time = current_time
                face_missing_count = 0
                time.sleep(waiting_time)

        elif len(faces) > 1:
            face_multiple_count += 1
            if face_multiple_count >= multiple_threshold and current_time - last_warning_time >= warning_cooldown:
                warnings += 1
                last_warning = f"Warning {warnings}: Multiple faces detected."
                print(last_warning)
                play_beep()
                last_warning_time = current_time
                face_multiple_count = 0
                time.sleep(waiting_time)

        else:
            face_missing_count = 0
            face_multiple_count = 0

        if warnings >= 3:
            last_warning = "Proctoring ended due to multiple warnings."
            print(last_warning)
            play_beep()
            end_proctoring = True
            break

        time.sleep(0.1)

    cap.release()
    print("Proctoring has stopped.")