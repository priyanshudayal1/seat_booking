from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from extensions import db
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect()
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@csrf.exempt
def register():
    try:
        data = request.get_json()
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "Email already registered"}), 400
            
        if User.query.filter_by(phone_number=data['phone_number']).first():
            return jsonify({"message": "Phone number already registered"}), 400
        
        hashed_password = generate_password_hash(data['password'])
        
        new_user = User(
            full_name=data['full_name'],
            designation=data['designation'],
            email=data['email'],
            phone_number=data['phone_number'],
            company_name=data['company_name'],
            password=hashed_password
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred during registration", "error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
@csrf.exempt
def login():
    try:
        data = request.get_json()
        identifier = data.get('email') or data.get('phone_number')
        password = data['password']
        
        user = User.query.filter((User.email == identifier) | 
                               (User.phone_number == identifier)).first()
        
        if not user or not check_password_hash(user.password, password):
            return jsonify({"message": "Invalid credentials"}), 401
        
        return jsonify({
            "user": user.to_dict()
        })
    except Exception as e:
        return jsonify({"message": "An error occurred during login", "error": str(e)}), 500

@auth_bp.route('/user/profile/<int:user_id>', methods=['GET'])
@csrf.exempt
def get_profile(user_id):
    try:
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict())
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@auth_bp.route('/user/profile/update/<int:user_id>', methods=['PUT'])
@csrf.exempt
def update_profile(user_id):
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        # Update allowed fields
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'designation' in data:
            user.designation = data['designation']
        if 'company_name' in data:
            user.company_name = data['company_name']
        if 'phone_number' in data:
            # Check if phone number is not already taken
            existing_user = User.query.filter_by(phone_number=data['phone_number']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({"message": "Phone number already in use"}), 400
            user.phone_number = data['phone_number']
        if 'password' in data:
            user.password = generate_password_hash(data['password'])
            
        db.session.commit()
        return jsonify({"message": "Profile updated successfully", "user": user.to_dict()})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500