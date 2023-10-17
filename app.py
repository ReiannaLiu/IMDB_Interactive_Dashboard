#Install libraries if not installed:
#pip install Flask
#pip install pymongo

from flask import flask

app =   Flask(__name__)

# Configure MongoDB connection
app.config['MONGO_URI'] = "mongodb://localhost:27017/mydatabase"
client = MongoClient(app.config['MONGO_URI'])
db = client.get_database()

if __name__ == "__main__":
    app.run()

#Sample get request:
@app.route('/read/<document_id>', methods=['GET'])
def read_document(document_id):
    collection = db.my_collection
    document = collection.find_one({"_id": ObjectId(document_id)})
    return jsonify(document)

