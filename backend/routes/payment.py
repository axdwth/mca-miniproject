import stripe
from flask import Blueprint, request, jsonify
from config import newreg_collection
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")  

payment_bp = Blueprint("payment", __name__)

def create_payment_intent(amount, currency="inr"):
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount) * 100,  # convert INR to paise
            currency=currency,
            payment_method_types=["card"]
        )
        return {"client_secret": intent.client_secret}
    except Exception as e:
        return {"error": str(e)}

@payment_bp.route("/create-payment-intent", methods=["POST"])
def payment_intent_route():
    data = request.json
    amount = data.get("amount")
    print(amount)
    email = data.get("email")
    print(email)

    if not amount or not email:
        return jsonify({"error": "Amount and email are required"}), 400

    try:
        amount = int(amount)
    except ValueError:
        return jsonify({"error": "Invalid amount"}), 400

    result = create_payment_intent(amount)
    if "error" in result:
        return jsonify(result), 400

    update_result = newreg_collection.update_one(
        {"stud_email": email},
        {"$set": {"payment_status": "pending"}}
    )
    if update_result.matched_count == 0:
        return jsonify({"error": "Student not found"}), 404

    return jsonify(result)

@payment_bp.route("/confirm", methods=["POST"])
def confirm_payment():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email required"}), 400

    update_result = newreg_collection.update_one(
        {"stud_email": email},
        {"$set": {"payment_status": "paid"}}
    )
    if update_result.matched_count == 0:
        return jsonify({"error": "Student not found"}), 404

    return jsonify({"message": "Payment status updated"})
