
# app.py — cleaned and ordered version

from flask import Flask, request, jsonify, send_from_directory, session
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import secrets
from bson import ObjectId

# --- App & config ---
app = Flask(__name__)
app.secret_key = "supersecretkey"  # change this to a secure value in production

app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True 

# Restrict CORS to your React dev server and allow cookies/sessions
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# --- Database ---
client = MongoClient("mongodb://localhost:27017/")
database = client["mca_asiet"]
faculty_collection = database["faculty"]
application_form = database["applications"]
admin = database["admin"]
critera = database["eligibility"]
newreg = database["newreg"]
accepted_apps= database["accepted"]

# --- Upload folders & helpers ---
UPLOAD_FOLDER = "uploads"
PHOTO_FOLDER = os.path.join(UPLOAD_FOLDER, "photos")
CERTIFICATE_FOLDER = os.path.join(UPLOAD_FOLDER, "certificates")
ID_PROOF_FOLDER = os.path.join(UPLOAD_FOLDER, "id_proof")

for folder in [PHOTO_FOLDER, CERTIFICATE_FOLDER, ID_PROOF_FOLDER]:
    os.makedirs(folder, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
# (optional) app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB limit

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# --- Tokens store (temporary) ---
tokens = {}


# --- Routes that were in the file (kept intact) ---
# --- Dashboard Stats & Trends API ---
@app.route("/admin/dashboard-stats", methods=["GET"])
def dashboard_stats():
    # Count applications by status
    new_count = newreg.count_documents({})
    accepted_count = accepted_apps.count_documents({})
    # For demo, let's assume waiting and rejected are separate collections or status fields
    waiting_count = newreg.count_documents({"status": "waiting"})
    rejected_count = newreg.count_documents({"status": "rejected"})

    # Example: Monthly trends (group by month)
    # This assumes each doc has a 'submitted_at' field (ISO string)
    from collections import defaultdict
    import calendar
    monthly_data = defaultdict(lambda: {"New": 0, "Accepted": 0})
    # Use (year, month) tuple as key
    for app in newreg.find({}, {"submitted_at": 1}):
        if "submitted_at" in app:
            dt = None
            try:
                dt = datetime.fromisoformat(app["submitted_at"])
            except Exception:
                continue
            key = (dt.year, dt.month)
            monthly_data[key]["New"] += 1
    for app in accepted_apps.find({}, {"submitted_at": 1}):
        if "submitted_at" in app:
            dt = None
            try:
                dt = datetime.fromisoformat(app["submitted_at"])
            except Exception:
                continue
            key = (dt.year, dt.month)
            monthly_data[key]["Accepted"] += 1

    # Format for recharts: label as 'Sep 2025'
    chart_data = []
    # Sort keys chronologically
    for (year, month) in sorted(monthly_data.keys()):
        label = f"{calendar.month_abbr[month]} {year}"
        chart_data.append({
            "name": label,
            "New": monthly_data[(year, month)]["New"],
            "Accepted": monthly_data[(year, month)]["Accepted"]
        })

    return jsonify({
        "stats": {
            "new": new_count,
            "accepted": accepted_count,
            "waiting": waiting_count,
            "rejected": rejected_count
        },
        "chart": chart_data
    })

@app.route("/upload", methods=["POST"])
def upload_files():
    photo = request.files.get("stud_photo")
    certificate = request.files.get("certificate")
    id_proof = request.files.get("id_proof")

    saved_files = {}

    if photo and allowed_file(photo.filename):
        filename = secure_filename(photo.filename)
        photo.save(os.path.join(PHOTO_FOLDER, filename))
        saved_files["photo"] = f"/uploads/photos/{filename}"

    if certificate and allowed_file(certificate.filename):
        filename = secure_filename(certificate.filename)
        certificate.save(os.path.join(CERTIFICATE_FOLDER, filename))
        saved_files["certificate"] = f"/uploads/certificates/{filename}"

    if id_proof and allowed_file(id_proof.filename):
        filename = secure_filename(id_proof.filename)
        id_proof.save(os.path.join(ID_PROOF_FOLDER, filename))
        saved_files["id_proof"] = f"/uploads/id_proof/{filename}"

    return jsonify({"status": "success", "files": saved_files})


@app.route("/add_faculty", methods=["POST"])
def add_faculty():
    data = request.json
    print("Received data:", data)
    faculty_name = data.get("faculty_name")
    faculty_email = data.get("faculty_email")
    faculty_exp = data.get("faculty_exp")
    faculty_description = data.get("faculty_description")
    faculty_qualification = data.get("faculty_qualification")

    if not all([faculty_name, faculty_email, faculty_exp, faculty_description, faculty_qualification]):
        return jsonify({"message": "All fields are required"}), 400

    new_faculty = {
        "faculty_name": faculty_name,
        "faculty_email": faculty_email,
        "faculty_exp": faculty_exp,
        "faculty_description": faculty_description,
        "faculty_qualification": faculty_qualification
    }

    print("Inserting faculty:", new_faculty)
    faculty_collection.insert_one(new_faculty)

    return jsonify({"message": "Faculty added successfully"}), 201


@app.route("/register_admin", methods=["POST"])
def register_admin():
    data = request.json
    print("Received", data)
    Admin_name = data.get("Admin_name")
    Admin_email = data.get("Admin_email")
    Admin_password = data.get("Admin_password")
    if not all([Admin_name, Admin_email, Admin_password]):
        return jsonify({"message": "allfields are required"}), 400
    if admin.find_one({"email": Admin_email}):
        return jsonify({"message": "Admin email already exists"}), 400

    new_admin = {
        "name": Admin_name,
        "email": Admin_email,
        "password": Admin_password,
        "last_login": datetime.now().isoformat()
    }
    print("Inserting admin:", new_admin)
    admin.insert_one(new_admin)
    return jsonify({"message": "Admin added successfully"}), 201


@app.route("/student_applications", methods=["POST"])
def student_applications():
    try:
        stud_name = request.form.get("stud_name")
        stud_email = request.form.get("stud_email")
        stud_dob = request.form.get("stud_dob")
        stud_phone = request.form.get("stud_phone")
        stud_address = request.form.get("stud_address")
        stud_gender = request.form.get("stud_gender")
        stud_religion = request.form.get("stud_religion")
        stud_nationality = request.form.get("stud_nationality")
        stud_category = request.form.get("stud_category")

        sslc_school = request.form.get("sslc_school")
        sslc_year = request.form.get("sslc_year")
        sslc_marks = request.form.get("sslc_marks")
        plustwo_school = request.form.get("plustwo_school")
        plustwo_year = request.form.get("plustwo_year")
        plustwo_marks = request.form.get("plustwo_marks")
        ug_college = request.form.get("ug_college")
        ug_year = request.form.get("ug_year")
        ug_marks = request.form.get("ug_marks")
        stud_qualification = request.form.get("stud_qualification")
        entrance_exam_score = request.form.get("entrance_exam_score")
        entrance_exam_rank = request.form.get("entrance_exam_rank")
        entrance_exam_reg_no = request.form.get("entrance_exam_reg_no")

        father_name = request.form.get("father_name")
        father_occupation = request.form.get("father_occupation")
        father_phone = request.form.get("father_phone")
        mother_name = request.form.get("mother_name")
        mother_occupation = request.form.get("mother_occupation")
        mother_phone = request.form.get("mother_phone")

        stud_photo = request.files.get("stud_photo")
        stud_id = request.files.get("stud_id")
        stud_10_certificate = request.files.get("stud_10_certificate")
        stud_plustwo_certificate = request.files.get("stud_plustwo_certificate")
        stud_degree_certificate = request.files.get("stud_degree_certificate")
        stud_lbs_result = request.files.get("stud_lbs_result")

        required_fields = [
            stud_name, stud_email, stud_dob, stud_phone, stud_address,
            stud_qualification, stud_category
        ]
        if not all(required_fields):
            return jsonify({"message": "All required fields must be filled"}), 400

        if application_form.find_one({"stud_email": stud_email}):
            return jsonify({"message": f"Application with email {stud_email} already exists"}), 400
        if application_form.find_one({"stud_phone": stud_phone}):
            return jsonify({"message": f"Application with phone {stud_phone} already exists"}), 400

        file_paths = {}
        if stud_photo:
            filename = secure_filename(stud_photo.filename)
            stud_photo.save(os.path.join(PHOTO_FOLDER, filename))
            file_paths["stud_photo"] = f"/uploads/photos/{filename}"

        if stud_id:
            filename = secure_filename(stud_id.filename)
            stud_id.save(os.path.join(ID_PROOF_FOLDER, filename))
            file_paths["stud_id"] = f"/uploads/id_proof/{filename}"

        if stud_10_certificate:
            filename = secure_filename(stud_10_certificate.filename)
            stud_10_certificate.save(os.path.join(CERTIFICATE_FOLDER, filename))
            file_paths["stud_10_certificate"] = f"/uploads/certificates/{filename}"

        if stud_plustwo_certificate:
            filename = secure_filename(stud_plustwo_certificate.filename)
            stud_plustwo_certificate.save(os.path.join(CERTIFICATE_FOLDER, filename))
            file_paths["stud_plustwo_certificate"] = f"/uploads/certificates/{filename}"

        if stud_degree_certificate:
            filename = secure_filename(stud_degree_certificate.filename)
            stud_degree_certificate.save(os.path.join(CERTIFICATE_FOLDER, filename))
            file_paths["stud_degree_certificate"] = f"/uploads/certificates/{filename}"

        if stud_lbs_result:
            filename = secure_filename(stud_lbs_result.filename)
            stud_lbs_result.save(os.path.join(CERTIFICATE_FOLDER, filename))
            file_paths["stud_lbs_result"] = f"/uploads/certificates/{filename}"

        new_application = {
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

            "sslc_school": sslc_school,
            "sslc_year": sslc_year,
            "sslc_marks": sslc_marks,
            "plustwo_school": plustwo_school,
            "plustwo_year": plustwo_year,
            "plustwo_marks": plustwo_marks,
            "ug_college": ug_college,
            "ug_year": ug_year,
            "ug_marks": ug_marks,
            "stud_qualification": stud_qualification,
            "entrance_exam_score": entrance_exam_score,
            "entrance_exam_rank": entrance_exam_rank,
            "entrance_exam_reg_no": entrance_exam_reg_no,

            "father_name": father_name,
            "father_occupation": father_occupation,
            "father_phone": father_phone,
            "mother_name": mother_name,
            "mother_occupation": mother_occupation,
            "mother_phone": mother_phone,

            "stud_photo": file_paths.get("stud_photo"),
            "stud_id": file_paths.get("stud_id"),
            "stud_10_certificate": file_paths.get("stud_10_certificate"),
            "stud_plustwo_certificate": file_paths.get("stud_plustwo_certificate"),
            "stud_degree_certificate": file_paths.get("stud_degree_certificate"),
            "stud_lbs_result": file_paths.get("stud_lbs_result"),

            "submitted_at": datetime.now().isoformat()
        }

        result = application_form.insert_one(new_application)
        new_application["_id"] = str(result.inserted_id)
        return jsonify({"message": "Application submitted successfully!", "data": new_application}), 201

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500


@app.route("/newapplications", methods=["GET"])
def newapplications():
    napplications = list(newreg.find({}, {"_id": 0}))
    for i in napplications:
        token = secrets.token_urlsafe(8)
        tokens[token] = i.get('stud_email')
        i['token'] = token
    return jsonify(napplications), 200

@app.route("/viewnewapplicationdetails/<token>", methods=["GET"])
def view_application_detail_token(token):
    email = tokens.get(token)
    if not email:
        return jsonify({"message": "Invalid or expired token"}), 404
    applications = newreg.find_one({"stud_email": email}, {"_id": 0})
    if applications is None:
        return jsonify({"message": "Application not found"}), 404
    return jsonify(applications), 200

@app.route('/uploads/photos/<path:filename>')
def get_photo(filename):
    return send_from_directory(PHOTO_FOLDER, filename)

@app.route('/uploads/id_proof/<path:filename>')
def get_id(filename):
    return send_from_directory(ID_PROOF_FOLDER, filename)

@app.route("/check_session")
def check_session():
    return {
        "logged_in": session.get("logged_in", False),
        "role": session.get("role"),
        "username": session.get("username")
    }


@app.route("/")
def home():
    return jsonify({"message": "connected"})

# --- External blueprints (keep these as before) ---
from routes.newreg import newreg_bp
from routes.payment import payment_bp
from routes.login import login_bp
from routes.adminprofile import adminprofile_bp

app.register_blueprint(newreg_bp, url_prefix="/newreg")
app.register_blueprint(payment_bp, url_prefix="/payment")
app.register_blueprint(adminprofile_bp)
app.register_blueprint(login_bp)

if __name__ == "__main__":
    app.run(debug=True)
