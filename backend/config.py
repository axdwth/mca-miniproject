from pymongo import MongoClient

# Mongo connection
client = MongoClient("mongodb://localhost:27017/")
database = client["mca_asiet"]

faculty_collection = database["faculty"]
application_form = database["applications"]
admin_collection = database["admin"]
criteria_collection = database["eligibility"]
newreg_collection = database["newreg"]
student_collection = database["students"]

# Upload folder (optional, for photos)
UPLOAD_FOLDER = "uploads"
