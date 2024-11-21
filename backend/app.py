
# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from routes.intro_routes import intro_routes
from routes.quiz_routes import quiz_routes
from pymongo import MongoClient
import logging
import threading
import proctoring  # Import the proctoring module

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

mongo_uri = "mongodb+srv://ishanjain2174:hxT517lOb9J4Jn92@cluster4.8kpvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster4"
client = MongoClient(mongo_uri)
db = client["capstone"]
app.config["db"] = db

app.register_blueprint(intro_routes)
app.register_blueprint(quiz_routes)

def initialize_proctoring():
    print("Initializing proctoring...")
    threading.Thread(target=proctoring.start_proctoring).start()

# Endpoint to check proctoring status and send the last warning
@app.route('/check_proctoring_status', methods=['GET'])
def check_proctoring_status():
    """Endpoint for the frontend to check if proctoring has ended and get the last warning message."""
    return jsonify({
        "proctoring_active": not proctoring.end_proctoring,
        "last_warning": proctoring.get_last_warning()  # Retrieve last warning from proctoring module
    })

if __name__ == '__main__':
    initialize_proctoring()
    app.run(debug=True, port=8080)


    