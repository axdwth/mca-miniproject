
from flask import Blueprint, request, jsonify, session
from flask_cors import cross_origin
from pymongo import MongoClient

# Define blueprint FIRST
login_bp = Blueprint("login_bp", __name__)

# connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["mca_asiet"]
admin_collection = db["admin"]
student_collection = db["student"]  # assuming students are stored here
application_form = db["applications"]


@login_bp.route("/login", methods=["POST"])
@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # --- Check Admin Login ---
    admin = admin_collection.find_one({"email": username, "password": password})
    if admin:
        session["logged_in"] = True
        session["role"] = "admin"
        session["username"] = username
        return jsonify({"message": "Admin login successful", "role": "admin"}), 200

    # --- Check Student Login ---
    student = student_collection.find_one({"stud_email": username, "password": password})
    if student:
        session["logged_in"] = True
        session["role"] = "student"
        session["username"] = username
        return jsonify({"message": "Student login successful", "role": "student"}), 200

    return jsonify({"message": "Invalid credentials"}), 401


@login_bp.route("/logout", methods=["POST"])
@cross_origin(supports_credentials=True)
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200


# Example: Protect Admin Dashboard
@login_bp.route("/admin/dashboard", methods=["GET"])
@cross_origin(supports_credentials=True)
def admin_dashboard():
    if not session.get("logged_in") or session.get("role") != "admin":
        return jsonify({"message": "Unauthorized"}), 401
    admin = admin_collection.find_one({"email": session["username"]})
    name = admin["name"] #if admin and "name" in admin else session["username"]
    return jsonify({"message": f"Welcome {name}!"})


# Example: Protect Student Dashboard
@login_bp.route("/student/dashboard", methods=["GET"])
@cross_origin(supports_credentials=True)
def student_dashboard():
    if not session.get("logged_in") or session.get("role") != "student":
        return jsonify({"message": "Unauthorized"}), 401
    return jsonify({"message": f"Welcome Student {session['username']}!"})
