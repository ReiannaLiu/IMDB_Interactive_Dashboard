#Install libraries if not installed:
#pip install Flask
#pip install pymongo

from flask import Flask, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


#################################################
# Database Setup
#################################################
app.config['MONGO_URI'] = "mongodb://localhost:27017/IMDB_MOVIES"
client = MongoClient(app.config['MONGO_URI'], serverSelectionTimeoutMS=5000)    
db = client.get_database()

class JSONEncoder(json.JSONEncoder):
    """ Extend JSONEncoder to support ObjectId. """
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

#################################################
# Flask Routes
#################################################

@app.route('/')
def index():
    return "Welcome to IMDB Interactive Dashboard API!"

@app.route('/list_collections', methods=['GET'])
def list_collections():
    collection_names = db.list_collection_names()
    return jsonify(collection_names)

@app.route('/read/<document_id>', methods=['GET'])
def read_document(document_id):
    # Check if ObjectId is valid
    if not ObjectId.is_valid(document_id):
        return jsonify({"error": "Invalid ObjectId"}), 400
    
    collection = db.movies
    document = collection.find_one({"_id": ObjectId(document_id)})

    return JSONEncoder().encode(document), 200

@app.route('/read_all', methods=['GET'])
def read_all():
    collection = db.movies
    documents = collection.find()

    return JSONEncoder().encode(list(documents)), 200

@app.route('/read_by_title/<title>', methods=['GET'])
def read_by_title(title):
    collection = db.movies
    documents = collection.find({"title": title})

    return JSONEncoder().encode(list(documents)), 200

if __name__ == "__main__":
    app.run(debug=True)

