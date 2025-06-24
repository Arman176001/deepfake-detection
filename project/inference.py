import cv2
import numpy as np
import tensorflow as tf
from mtcnn import MTCNN
from concurrent.futures import ThreadPoolExecutor

model = tf.keras.models.load_model('model/xception_5o.h5')

IMAGE_SIZE = (224, 224)
MAX_SEQ_LENGTH = 20 
BATCH_SIZE = 32  
FRAME_SAMPLE_RATE = 10  
feature_extractor = tf.keras.applications.Xception(weights="imagenet", include_top=False, pooling="avg")

detector = MTCNN()

def extract_frames_from_video(video_path, sample_rate=FRAME_SAMPLE_RATE):
    frames = []
    vidcap = cv2.VideoCapture(video_path)
    success, image = vidcap.read()
    count = 0
    while success:
        if count % sample_rate == 0:
            frames.append(image)
        success, image = vidcap.read()
        count += 1
    return frames

def detect_and_crop_faces(frame):
    faces = []
    detections = detector.detect_faces(frame)
    for detection in detections:
        x, y, width, height = detection['box']
        face = frame[y:y+height, x:x+width]
        face = cv2.resize(face, IMAGE_SIZE)
        faces.append(face)
    return faces

def preprocess_faces(faces):
    face_features = np.zeros((len(faces), *IMAGE_SIZE, 3))
    for i, face in enumerate(faces):
        face_features[i] = tf.keras.applications.xception.preprocess_input(face)
    return face_features

def detect_faces_parallel(frames):
    with ThreadPoolExecutor() as executor:
        results = executor.map(detect_and_crop_faces, frames)
    all_faces = []
    for faces in results:
        all_faces.extend(faces)
    return all_faces

def predict_fake_real(video_path):
    frames = extract_frames_from_video(video_path)
    all_faces = detect_faces_parallel(frames)
    
    if not all_faces:
        print("No faces detected!")
        return None, None

    all_faces = all_faces[:MAX_SEQ_LENGTH]
    preprocessed_faces = preprocess_faces(all_faces)

    predictions = []
    for i in range(0, len(preprocessed_faces), BATCH_SIZE):
        batch_faces = preprocessed_faces[i:i+BATCH_SIZE]
        batch_predictions = model.predict(np.array(batch_faces))
        predictions.extend(batch_predictions)

    avg_prediction = float(np.mean(predictions))
    label = 'FAKE' if avg_prediction >= 0.5 else 'REAL'
    return label, avg_prediction


def predict_from_image(image_path):
    image = cv2.imread(image_path)
    faces = detect_and_crop_faces(image)

    if not faces:
        print("No faces detected!")
        return None, None

    preprocessed_faces = preprocess_faces(faces)
    predictions = model.predict(np.array(preprocessed_faces))
    avg_prediction = float(np.mean(predictions))

    label = 'FAKE' if avg_prediction >= 0.5 else 'REAL'
    return label, avg_prediction


# Example usage:
if __name__ == "__main__":
    video_path = '410298807-2e9b9b82-fa04-4b70-9f56-b1f68e7672d0 (online-video-cutter.com).mp4' 
    result = predict_fake_real(video_path)
    print(f'The video is {result}')
    image_path = 'test.jpg'
    result = predict_from_image(image_path)
    print(f'The image is {result}')