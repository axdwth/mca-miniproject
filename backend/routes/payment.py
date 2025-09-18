import stripe
from flask import Blueprint, request, jsonify
from config import newreg_collection
import os
from dotenv import load_dotenv

# This is the correct, safe way to load the key
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

payment_bp = Blueprint("payment", __name__)
@payment_bp.route("/create-payment-intent", methods=["POST"])
def create_payment_intent_route():
    data = request.get_json()
    amount = data.get("amount")
    email = data.get("email")

    if not amount or not email:
        return jsonify({"error": "Amount and email are required"}), 400

    try:
        amount = int(amount)  # Stripe requires smallest currency unit
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="inr",
            receipt_email=email
        )
        return jsonify({"client_secret": intent.client_secret})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
@payment_bp.route("/confirm", methods=["POST"])
def confirm_payment():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    update_result = newreg_collection.update_one(
        {"stud_email": email},
        {"$set": {
            "fee_paid": True,        # ✅ flip after payment success
            "payment_status": "paid"
        }}
    )

    if update_result.matched_count == 0:
        return jsonify({"error": "Student not found"}), 404

    return jsonify({"message": "Payment status updated"})
