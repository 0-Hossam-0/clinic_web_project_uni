from flask import Flask, send_from_directory
from flask_cors import CORS
from controller.appointment_controller import appointment_bp

app = Flask(__name__, static_folder='.')
CORS(app)

app.register_blueprint(appointment_bp)

# Serve
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
