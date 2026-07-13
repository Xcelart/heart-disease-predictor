from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the trained model
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array(data['features']).reshape(1, -1)
    prediction = model.predict(features)
    probability = model.predict_proba(features)[0][1]
    result = {
        'prediction': int(prediction[0]),
        'probability': round(float(probability) * 100, 2)
    }
    return jsonify(result)


@app.route('/static/<filename>')
def serve_image(filename):
    static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static'))
    print("Looking for images in:", static_folder)
    print("File exists:", os.path.exists(os.path.join(static_folder, filename)))
    return send_from_directory(static_folder, filename)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)