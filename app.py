from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json, os

app = Flask(__name__, static_folder='.')
CORS(app)

DATA_FILE = 'appointments.json'

def load():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/appointments', methods=['GET'])
def get_appointments():
    return jsonify(load())

@app.route('/appointments', methods=['POST'])
def add_appointment():
    appt = request.json
    data = load()
    data.append(appt)
    save(data)
    return jsonify({'ok': True})

@app.route('/appointments/<int:appt_id>', methods=['DELETE'])
def delete_appointment(appt_id):
    data = [a for a in load() if a['id'] != appt_id]
    save(data)
    return jsonify({'ok': True})

if __name__ == '__main__':
    app.run(debug=True)