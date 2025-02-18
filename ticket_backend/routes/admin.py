from flask import Blueprint, request, jsonify
from models.course import Course
from models.user import User
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from app import db
from decorators.auth import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], role='admin').first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Invalid credentials"}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token})

@admin_bp.route('/courses', methods=['GET'])
@admin_required()
def get_all_courses():
    courses = Course.query.all()
    return jsonify([course.to_dict() for course in courses])

@admin_bp.route('/courses', methods=['POST'])
@admin_required()
def create_course():
    data = request.get_json()
    
    new_course = Course(
        course_name=data['course_name'],
        branch=data['branch'],
        total_seats=data['total_seats'],
        left_seats=data['total_seats'],
        price_per_seat=data['price_per_seat']
    )
    
    db.session.add(new_course)
    db.session.commit()
    
    return jsonify(new_course.to_dict()), 201

@admin_bp.route('/courses/<int:course_id>', methods=['PUT'])
@admin_required()
def update_course(course_id):
    course = Course.query.get_or_404(course_id)
    data = request.get_json()
    
    course.total_seats = data.get('total_seats', course.total_seats)
    course.locked_seats = data.get('locked_seats', course.locked_seats)
    course.price_per_seat = data.get('price_per_seat', course.price_per_seat)
    course.update_seats()
    
    db.session.commit()
    return jsonify(course.to_dict())

@admin_bp.route('/courses/<int:course_id>', methods=['DELETE'])
@admin_required()
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course deleted successfully"})