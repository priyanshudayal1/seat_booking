from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.billing import Billing
from models.user import User
import random
import string
from extensions import db
import requests
import os

billing_bp = Blueprint('billing', __name__)

def send_sms(phone_number, otp):
    # Fast2SMS API endpoint and parameters
    url = "https://www.fast2sms.com/dev/bulkV2"
    headers = {
        "authorization": os.getenv("FAST2SMS_API_KEY", "your-api-key"),
        "Content-Type": "application/json"
    }
    payload = {
        "variables_values": otp,
        "route": "otp",
        "numbers": phone_number,
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        return response.json()
    except Exception as e:
        print(f"SMS sending failed: {str(e)}")
        return None

@billing_bp.route('/generate-otp', methods=['POST'])
@jwt_required()
def generate_otp():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Get user's phone number
        user = User.query.get(user_id)
        if not user or not user.phone:
            return jsonify({"message": "User phone number not found"}), 400
        
        # Generate a 6-digit OTP
        otp = ''.join(random.choices(string.digits, k=6))
        
        # Send OTP via Fast2SMS
        sms_response = send_sms(user.phone, otp)
        if not sms_response or not sms_response.get("return"):
            return jsonify({"message": "Failed to send OTP"}), 500
        
        # Create or update billing record
        billing = Billing.query.filter_by(user_id=user_id, payment_status='pending').first()
        if billing:
            billing.otp = otp
            billing.selected_courses = data.get('selected_courses')
            billing.total_price = data.get('total_price')
        else:
            billing = Billing(
                user_id=user_id,
                selected_courses=data.get('selected_courses'),
                total_price=data.get('total_price'),
                otp=otp
            )
            db.session.add(billing)
            
        db.session.commit()
        
        return jsonify({
            "message": "OTP sent successfully",
            "phone": f"xxxxxx{user.phone[-4:]}"  # Return masked phone number
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500

@billing_bp.route('/verify-otp', methods=['POST'])
@jwt_required()
def verify_otp():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        billing = Billing.query.filter_by(
            user_id=user_id, 
            payment_status='pending'
        ).first()
        
        if not billing:
            return jsonify({"message": "No pending transaction found"}), 404
            
        if billing.otp != data['otp']:
            return jsonify({"message": "Invalid OTP"}), 400
            
        billing.is_verified = True
        db.session.commit()
            
        return jsonify({"message": "OTP verified successfully"})
        
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@billing_bp.route('/process-payment', methods=['POST'])
@jwt_required()
def process_payment():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        billing = Billing.query.filter_by(
            user_id=user_id, 
            payment_status='pending'
        ).first()
        
        if not billing:
            return jsonify({"message": "No pending transaction found"}), 404
            
        if not billing.is_verified:
            return jsonify({"message": "Please verify OTP before proceeding with payment"}), 400
        
        # Here you would integrate with Razorpay/Stripe
        # For now, we'll just mark it as completed
        billing.payment_status = 'completed'
        db.session.commit()
        
        return jsonify({
            "message": "Payment processed successfully",
            "transaction_id": billing.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500