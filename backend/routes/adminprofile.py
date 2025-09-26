from flask import Blueprint, request, jsonify, session
from pymongo import MongoClient
from datetime import datetime

# Setup blueprint
adminprofile_bp = Blueprint("adminprofile_bp", __name__)

# Connect to DB
client = MongoClient("mongodb://localhost:27017/")
db = client["mca_asiet"]
admin_collection = db["admin"]

# --- View admin profile ---
@adminprofile_bp.route("/admin/profile", methods=["GET"])
def get_admin_profile():
	username = session.get("username")
	if not username:
		return jsonify({"message": "Unauthorized"}), 401
	admin = admin_collection.find_one({"email": username}, {"_id": 0, "password": 0})
	if not admin:
		return jsonify({"message": "Admin not found"}), 404
	return jsonify(admin)

# --- Update admin profile ---
@adminprofile_bp.route("/admin/update-profile", methods=["POST"])
def update_admin_profile():
	username = session.get("username")
	if not username:
		return jsonify({"message": "Unauthorized"}), 401
	data = request.json
	update_fields = {}
	if "name" in data and data["name"]:
		update_fields["name"] = data["name"]
	if "email" in data and data["email"]:
		update_fields["email"] = data["email"]
	if "password" in data and data["password"]:
		update_fields["password"] = data["password"]
	if not update_fields:
		return jsonify({"message": "No fields to update"}), 400
	result = admin_collection.update_one({"email": username}, {"$set": update_fields})
	if result.matched_count == 0:
		return jsonify({"message": "Admin not found"}), 404
	# If email changed, update session
	if "email" in update_fields:
		session["username"] = update_fields["email"]
	admin = admin_collection.find_one({"email": session["username"]}, {"_id": 0, "password": 0})
	return jsonify(admin)



