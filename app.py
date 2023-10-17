#Install libraries if not installed:
#pip install Flask
#pip install pymongo

from flask import Flask, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import json


app = Flask(__name__)

#################################################
# Database Setup
#################################################
app.config['MONGO_URI'] = "mongodb://localhost:27017/mydatabase"
client = MongoClient(app.config['MONGO_URI'])
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

@app.route('/read/<document_id>', methods=['GET'])
def read_document(document_id):
    collection = db.my_collection
    document = collection.find_one({"_id": ObjectId(document_id)})
    return jsonify(document)

if __name__ == "__main__":
    app.run(debug=True)

