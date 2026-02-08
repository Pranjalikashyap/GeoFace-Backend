from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import cv2
import os
import uuid

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Face Encoder Running", "routes": ["/encode-face"]})

@app.route("/encode-face", methods=["POST"])
def encode_face():
    if "image" not in request.files:
        return jsonify({"error": "No image sent"}), 400

    file = request.files["image"]
    filename = f"{uuid.uuid4()}.jpg"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    img = cv2.imread(file_path)

    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encodings = face_recognition.face_encodings(rgb)

    if len(encodings) == 0:
        return jsonify({"error": "No face detected"}), 400

    return jsonify({
        "encoding": encodings[0].tolist(),
        "imagePath": file_path
    })


# 🔥 Railway / Production compatible
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
