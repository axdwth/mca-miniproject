from flask import Blueprint, request, jsonify
from pymongo import MongoClient

feedetail_bp = Blueprint("feedetail_bp", __name__, url_prefix="/feedetails")

client = MongoClient("mongodb://localhost:27017/")
db = client["mca_asiet"]
feedetail_col = db["criteria"]

@feedetail_bp.route("/", methods=["GET"])
def get_feedetail():
    data = feedetail_col.find_one({}, {"_id": 0})
    return jsonify(data if data else {})

@feedetail_bp.route("/update", methods=["POST"])
def update_feedetail_criteria():
    new_data = request.json
    # Only one document (criteria) in collection
    feedetail_col.update_one({}, {"$set": new_data}, upsert=True)
    return jsonify({"message": "Fee criteria updated successfully!"})
