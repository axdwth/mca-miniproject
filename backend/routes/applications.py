
from flask import Blueprint, jsonify
from pymongo import MongoClient

applications_bp = Blueprint("applications_bp", __name__, url_prefix="/applications")

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["mca_asiet"]

new_reg_col = db["newreg"]
accepted_col = db["accepted"]
rejected_col = db["rejected"]
queue_col = db["qeued"]
def move_application_by_email(email, target_col, status):
        # Find in newreg
    app = new_reg_col.find_one({"stud_email": email})
    if not app:
        return None

    # Copy and update status
    app_copy = app.copy()
    app_copy.pop("_id", None)  # remove _id to avoid duplicate key error
    app_copy["status"] = status  # set status: "accepted", "rejected", "queued"

    # Insert into target collection
    target_col.insert_one(app_copy)

    # Delete from newreg
    new_reg_col.delete_one({"stud_email": email})
    return app_copy



@applications_bp.route("/accepted", methods=["GET"])
def get_accepted_applications():
    apps = list(accepted_col.find({}))
    for app in apps:
        app["_id"] = str(app["_id"])
    return jsonify(apps), 200


@applications_bp.route("/accept/<email>", methods=["PUT"])
def accept_application(email):
    app = move_application_by_email(email, accepted_col, "accepted")
    if not app:
        return jsonify({"error": "Application not found"}), 404
    return jsonify({"message": f"{app['stud_name']} moved to Accepted"}), 200


@applications_bp.route("/reject/<email>", methods=["PUT"])
def reject_application(email):
    app = move_application_by_email(email, rejected_col, "rejected")
    if not app:
        return jsonify({"error": "Application not found"}), 404
    return jsonify({"message": f"{app['stud_name']} moved to Rejected"}), 200

@applications_bp.route("/rejected", methods=["GET"])
def get_rejected_applications():
    apps = list(rejected_col.find({}))
    for app in apps:
        app["_id"] = str(app["_id"])
    return jsonify(apps), 200


@applications_bp.route("/queue/<email>", methods=["PUT"])
def queue_application(email):
    app = move_application_by_email(email, queue_col, "waiting")
    if not app:
        return jsonify({"error": "Application not found"}), 404
    return jsonify({"message": f"{app['stud_name']} moved to Queue"}), 200

@applications_bp.route("/queue", methods=["GET"])
def get_queue_applications():
    apps = list(queue_col.find({}))
    for app in apps:
        app["_id"] = str(app["_id"])
    return jsonify(apps), 200