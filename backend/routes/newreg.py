from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from datetime import datetime
import os
from bson import ObjectId
from config import database  # assuming you have database in config.py

newreg_bp = Blueprint("newreg_bp", __name__)
newreg_collection = database["newreg"]
student_collection = database["students"]


# Upload folders
UPLOAD_FOLDER = "uploads"
PHOTO_FOLDER = os.path.join(UPLOAD_FOLDER, "photos")
for folder in [PHOTO_FOLDER]:
    os.makedirs(folder, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@newreg_bp.route("/register", methods=["POST"])
def register_student():
    try:
        # --- Text fields ---
        stud_name = request.form.get("stud_name")
        stud_email = request.form.get("stud_email")
        stud_dob = request.form.get("stud_dob")
        stud_phone = request.form.get("stud_phone")
        stud_address = request.form.get("stud_address")
        stud_gender = request.form.get("stud_gender")
        stud_religion = request.form.get("stud_religion")
        stud_nationality = request.form.get("stud_nationality")
        stud_category = request.form.get("stud_category")

        sslc_year = request.form.get("sslc_year")
        sslc_marks = request.form.get("sslc_marks")
        plustwo_year = request.form.get("plustwo_year")
        plustwo_marks = request.form.get("plustwo_marks")
        ug_year = request.form.get("ug_year")
        ug_marks = request.form.get("ug_marks")
        stud_qualification = request.form.get("stud_qualification")
        entrance_exam_score = request.form.get("entrance_exam_score")
        stud_addmission_type = request.form.get("stud_addmission_type")

        father_name = request.form.get("father_name")
        father_phone = request.form.get("father_phone")
        mother_name = request.form.get("mother_name")
        mother_phone = request.form.get("mother_phone")

        # --- File uploads ---
        stud_photo = request.files.get("stud_photo")
    
        # Validate required fields
        required_fields = [stud_name, stud_email, stud_dob, stud_phone, stud_address, stud_category]
        if not all(required_fields):
            return jsonify({"message": "All required fields must be filled"}), 400

        # Prevent duplicates
        if newreg_collection.find_one({"stud_email": stud_email}):
            return jsonify({"message": f"Email {stud_email} already exists"}), 400
        if newreg_collection.find_one({"stud_phone": stud_phone}):
            return jsonify({"message": f"Phone {stud_phone} already exists"}), 400

        # Save files
        file_paths = {}
        if stud_photo and allowed_file(stud_photo.filename):
            filename = secure_filename(stud_photo.filename)
            stud_photo.save(os.path.join(PHOTO_FOLDER, filename))
            file_paths["stud_photo"] = f"/uploads/photos/{filename}"

        # --- Save in MongoDB ---
        student = {
            "stud_regid": f"MCA{int(datetime.now().timestamp())}",
            "stud_name": stud_name,
            "stud_email": stud_email,
            "stud_dob": stud_dob,
            "stud_gender": stud_gender,
            "stud_religion": stud_religion,
            "stud_phone": stud_phone,
            "stud_address": stud_address,
            "stud_nationality": stud_nationality,
            "stud_category": stud_category,
            "sslc_year": sslc_year,
            "sslc_marks": sslc_marks,
            "plustwo_year": plustwo_year,
            "plustwo_marks": plustwo_marks,
            "ug_year": ug_year,
            "ug_marks": ug_marks,
            "stud_qualification": stud_qualification,
            "entrance_exam_score": entrance_exam_score,
            "stud_addmission_type": stud_addmission_type,
            "father_name": father_name,
            "father_phone": father_phone,
            "mother_name": mother_name,
            "mother_phone": mother_phone,
            "stud_photo": file_paths.get("stud_photo"),
            "stud_id": file_paths.get("stud_id"),
            "fee_paid": request.form.get("fee_paid", "false").lower() == "true",
    "status": "completed" if request.form.get("fee_paid", "false").lower() == "true" else "registered",
            "submitted_at": datetime.now().isoformat()
        }

        result = newreg_collection.insert_one(student)
        student["_id"] = str(result.inserted_id)
        return jsonify({"message": "Student registered successfully", "data": student}), 201

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500
    
@newreg_bp.route("/pay_fee/<student_id>", methods=["POST"])
def mark_fee_paid(student_id):
    try:
        student = newreg_collection.find_one({"_id": ObjectId(student_id)})
        if not student:
            return jsonify({"message": "Student not found"}), 404


        newreg_collection.update_one(
            {"_id": ObjectId(student_id)},
            {"$set": {"fee_paid": True, "status": "payment_completed"}}
        )
        return jsonify({"message": "Payment status updated successfully"}), 200

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500
    
from flask import send_from_directory
@newreg_bp.route('/uploads/photos/<path:filename>')
def get_photo(filename):
    return send_from_directory("uploads/photos", filename)

@newreg_bp.route('/uploads/id_proof/<path:filename>')
def get_id(filename):
    return send_from_directory("uploads/id_proof", filename)