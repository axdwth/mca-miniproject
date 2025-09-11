from flask import Flask, request, jsonify     
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import secrets
from bson import ObjectId
from flask import Flask
from routes.newreg import newreg_bp

tokens={}

app = Flask(__name__)
#CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
CORS(app)
client = MongoClient("mongodb://localhost:27017/")
database = client["mca_asiet"]
faculty_collection = database["faculty"]
application_form=database["applications"]
admin= database["admin"]
critera= database["eligibility"]

#***********upload folder for photos*************
UPLOAD_FOLDER = "uploads"
PHOTO_FOLDER = os.path.join(UPLOAD_FOLDER, "photos")
CERTIFICATE_FOLDER = os.path.join(UPLOAD_FOLDER, "certificates")
ID_PROOF_FOLDER = os.path.join(UPLOAD_FOLDER, "id_proof")

# Create folders if not exist
for folder in [PHOTO_FOLDER, CERTIFICATE_FOLDER, ID_PROOF_FOLDER]:
    os.makedirs(folder, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Allowed extensions (optional)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/upload", methods=["POST"])
def upload_files():
    # Student photo/id proof/certificate upload
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

#********API FACULTY_REG***********************
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
#********************API ADMIN_REGISTRATION******************
@app.route("/register_admin", methods=["POST"])
def register_admin():
    data=request.json
    print("Recived",data)
    Admin_name=data.get("Admin_name")
    Admin_email=data.get("Admin_email")
    Admin_password=data.get("Admin_password")
    if not all([Admin_name,Admin_email, Admin_password]):
        return jsonify({"message":"allfields are required"}),400    
    # Check if the email already exists
    if admin.find_one({"email":Admin_email}):
        return jsonify({"message":"Admin email already exists"}),400
    
    new_admin={
        "name":Admin_name,
        "email":Admin_email,
        "password":Admin_password,
        "last_login": datetime.now().isoformat() # Store the last login time
    }
    print("Inserting admin:", new_admin)
    admin.insert_one(new_admin)
    return jsonify({"message":"Admin added successfully"}),201

#**********************API STUDENTS APPLICATIONS*******************************
@app.route("/student_applications", methods=["POST"])
def student_applications():
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

        # --- Academics ---
        sslc_school = request.form.get("sslc_school")
        sslc_year = request.form.get("sslc_year")
        sslc_marks = request.form.get("sslc_marks")
        plustwo_school = request.form.get("plustwo_school")
        plustwo_year = request.form.get("plustwo_year")
        plustwo_marks = request.form.get("plustwo_marks")
        ug_college = request.form.get("ug_college")
        ug_year = request.form.get("ug_year")
        ug_marks = request.form.get("ug_marks")
        stud_qualification = request.form.get("stud_qualification") # boolean true/false
        entrance_exam_score = request.form.get("entrance_exam_score")
        entrance_exam_rank = request.form.get("entrance_exam_rank")
        entrance_exam_reg_no = request.form.get("entrance_exam_reg_no")

        # --- Parents ---
        father_name = request.form.get("father_name")
        father_occupation = request.form.get("father_occupation")
        father_phone = request.form.get("father_phone")
        mother_name = request.form.get("mother_name")
        mother_occupation = request.form.get("mother_occupation")
        mother_phone = request.form.get("mother_phone")

        # --- File uploads ---
        stud_photo = request.files.get("stud_photo")
        stud_id = request.files.get("stud_id")
        stud_10_certificate = request.files.get("stud_10_certificate")
        stud_plustwo_certificate = request.files.get("stud_plustwo_certificate")
        stud_degree_certificate = request.files.get("stud_degree_certificate")
        stud_lbs_result = request.files.get("stud_lbs_result")

        # Validate required fields
        required_fields = [
            stud_name, stud_email, stud_dob, stud_phone, stud_address,
            stud_qualification, stud_category
        ]
        if not all(required_fields):
            return jsonify({"message": "All required fields must be filled"}), 400

        # Prevent duplicates
        if application_form.find_one({"stud_email": stud_email}):
            return jsonify({"message": f"Application with email {stud_email} already exists"}), 400
        if application_form.find_one({"stud_phone": stud_phone}):
            return jsonify({"message": f"Application with phone {stud_phone} already exists"}), 400

        # Save files if present
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

        # --- Save application in MongoDB ---
        new_application = {
            "stud_regid": f"MCA{int(datetime.now().timestamp())}",
            
            # Personal
            "stud_name": stud_name,
            "stud_email": stud_email,
            "stud_dob": stud_dob,
            "stud_gender": stud_gender,
            "stud_religion": stud_religion,
            "stud_phone": stud_phone,
            "stud_address": stud_address,
            "stud_nationality": stud_nationality,
            "stud_category": stud_category,

            # Academics
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

            # Parents
            "father_name": father_name,
            "father_occupation": father_occupation,
            "father_phone": father_phone,
            "mother_name": mother_name,
            "mother_occupation": mother_occupation,
            "mother_phone": mother_phone,

            # Files
            "stud_photo": file_paths.get("stud_photo"),
            "stud_id": file_paths.get("stud_id"),
            "stud_10_certificate": file_paths.get("stud_10_certificate"),
            "stud_plustwo_certificate": file_paths.get("stud_plustwo_certificate"),
            "stud_degree_certificate": file_paths.get("stud_degree_certificate"),
            "stud_lbs_result": file_paths.get("stud_lbs_result"),

            # Submitted time
            "submitted_at": datetime.now().isoformat()
        }

        result=application_form.insert_one(new_application)
        new_application["_id"] = str(result.inserted_id)
        return jsonify({"message": "Application submitted successfully!", "data": new_application}), 201

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500


#*********VIEW APPLICATIONS*************

@app.route("/Viewapplications", methods=["GET"])
def viewapplications():
    applications = list(application_form.find({}, {"_id": 0}))
    for i in applications:
        token=secrets.token_urlsafe(8)
        tokens[token]=i['stud_email']
        i['token']=token
    return jsonify(applications),200


#*********VIEW APPLICATIONdeatil*************

@app.route("/Viewapplicationdetails/<token>", methods=["GET"])
def view_application_detail_token(token):
    email=tokens.get(token)
    if not email:
        return jsonify({"message":"Invalid or expired token"}),404
    applications = application_form.find_one({"stud_email":email},{"_id": 0})
    if applications is None:
        return jsonify({"message":"Application not found"}),404
    return jsonify(applications), 200

#*********UPDATE CRITERIA*************
from flask import send_from_directory

@app.route('/uploads/photos/<path:filename>')
def get_photo(filename):
    return send_from_directory("uploads/photos", filename)


#**************HOME ROUTE*********************
@app.route("/")
def home():
    return jsonify({"message": "connected"}) 
# Register the newreg blueprint
app.register_blueprint(newreg_bp, url_prefix="/newreg")
@app.route("/login", methods=["POST"])
def admin_login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    admincred = admin.find_one({"email": username, "password": password})
    if not admincred:
        return jsonify({"message": "Invalid credentials"}), 401
    return jsonify(
        {
        "message": "Login successful", 
    }), 200
if __name__ == "__main__":
    app.run(debug=True)
