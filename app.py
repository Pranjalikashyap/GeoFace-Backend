from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import cv2
import os
import uuid
import numpy as np
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

client = MongoClient("mongodb://localhost:27017/")
db = client["face_db"]
collection = db["users"]

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Face API Running"})

# ---------------- REGISTER FACE ----------------
@app.route("/register-face", methods=["POST"])
def register_face():
    if "image" not in request.files:
        return jsonify({"error": "No image sent"}), 400

    file = request.files["image"]
    file_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}.jpg")
    file.save(file_path)

    img = cv2.imread(file_path)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encodings = face_recognition.face_encodings(rgb)

    if not encodings:
        return jsonify({"error": "No face detected"}), 400

    new_encoding = encodings[0]

    for user in collection.find():
        existing_encoding = np.array(user["encoding"])
        matches = face_recognition.compare_faces(
            [existing_encoding],
            new_encoding,
            tolerance=0.5
        )
        if True in matches:
            return jsonify({
                "status": "Face already registered",
                "user_id": str(user["_id"])
            })

    collection.insert_one({
        "encoding": new_encoding.tolist(),
        "imagePath": file_path
    })

    return jsonify({"status": "Face registered successfully"})

# ---------------- MATCH FACE ----------------
@app.route("/match-face", methods=["POST"])
def match_face():
    if "image" not in request.files:
        return jsonify({"error": "No image sent"}), 400

    file = request.files["image"]
    file_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}.jpg")
    file.save(file_path)

    img = cv2.imread(file_path)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encodings = face_recognition.face_encodings(rgb)

    if not encodings:
        return jsonify({"error": "No face detected"}), 400

    new_encoding = encodings[0]

    for user in collection.find():
        existing_encoding = np.array(user["encoding"])
        matches = face_recognition.compare_faces(
            [existing_encoding],
            new_encoding,
            tolerance=0.5
        )
        if True in matches:
            return jsonify({
                "status": "Face matched successfully",
                "user_id": str(user["_id"])
            })

    return jsonify({"status": "No match found"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
