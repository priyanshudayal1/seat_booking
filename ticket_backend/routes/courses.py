from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.course import Course
from models.user import User
from extensions import db
import random
import json
from sqlalchemy import func

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/courses', methods=['GET'])
def get_available_courses():
    courses = Course.query.all()
    print('Courses:', courses)
    return jsonify([course.to_dict() for course in courses])

@courses_bp.route('/course/select', methods=['POST'])
@jwt_required()
def select_courses():
    try:
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        selected_courses = data.get('selected_courses', [])
        total_students = 0
        
        # Validate and update course seats
        for selection in selected_courses:
            course = Course.query.get_or_404(selection['course_id'])
            seats_requested = selection['seats']
            
            if course.left_seats < seats_requested:
                return jsonify({
                    "message": f"Not enough seats available for {course.course_name}"
                }), 400
                
            course.left_seats -= seats_requested
            total_students += seats_requested
        
        # Update user's adopted students count
        user.adopted_students += total_students
        db.session.commit()
        
        return jsonify({
            "message": "Courses selected successfully",
            "total_students": total_students
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500

@courses_bp.route('/<course_name>', methods=['GET'])
@jwt_required()
def get_course_details(course_name):
    try:
        # Get course branches and their details
        branches = Course.query.filter_by(course_name=course_name).all()
        
        if not branches:
            return jsonify({'message': 'Course not found'}), 404
            
        branches_data = {}
        for branch in branches:
            branches_data[str(branch.id)] = {
                'name': branch.branch,
                'totalSeats': branch.total_seats,
                'leftSeats': branch.left_seats,
                'lockedSeats': branch.locked_seats
            }
            
        return jsonify({
            'branches': branches_data,
            'pricePerSeat': branch.price_per_seat
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@courses_bp.route('/generate-otp', methods=['POST'])
@jwt_required()
def generate_otp():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        # Generate 6-digit OTP
        otp = str(random.randint(100000, 999999))
        
        # Store OTP and selections in user session
        user.otp = otp
        user.course_selections = json.dumps(request.json.get('selections'))
        db.session.commit()
        
        # TODO: Send OTP via email/SMS
        
        return jsonify({'message': 'OTP generated successfully'})
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@courses_bp.route('/verify-otp', methods=['POST'])
@jwt_required()
def verify_otp():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        submitted_otp = request.json.get('otp')
        
        if not submitted_otp or submitted_otp != user.otp:
            return jsonify({'message': 'Invalid OTP'}), 400
            
        # Clear OTP after successful verification
        user.otp = None
        db.session.commit()
        
        return jsonify({
            'message': 'OTP verified successfully',
            'selections': json.loads(user.course_selections)
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@courses_bp.route('/create-sample-data', methods=['GET'])
def create_sample_data():
    try:
        # Sample course data without institute_name, city, and left_seats (computed dynamically)
        sample_courses = [
            # B.Tech Courses
            {'course_name': 'B.Tech', 'branch': 'Computer Science', 'total_seats': 100, 'locked_seats': 0, 'price_per_seat': 1499.99},
            {'course_name': 'B.Tech', 'branch': 'Mechanical Engineering', 'total_seats': 80, 'locked_seats': 0, 'price_per_seat': 1299.99},
            {'course_name': 'B.Tech', 'branch': 'Civil Engineering', 'total_seats': 70, 'locked_seats': 0, 'price_per_seat': 1199.99},
            {'course_name': 'B.Tech', 'branch': 'Electronics & Communication', 'total_seats': 90, 'locked_seats': 0, 'price_per_seat': 1399.99},
            {'course_name': 'B.Tech', 'branch': 'Electrical Engineering', 'total_seats': 85, 'locked_seats': 0, 'price_per_seat': 1349.99},
            {'course_name': 'B.Tech', 'branch': 'Artificial Intelligence & Data Science', 'total_seats': 95, 'locked_seats': 0, 'price_per_seat': 1599.99},
            {'course_name': 'B.Tech', 'branch': 'Information Technology', 'total_seats': 88, 'locked_seats': 0, 'price_per_seat': 1449.99},
            {'course_name': 'B.Tech', 'branch': 'Automobile Engineering', 'total_seats': 75, 'locked_seats': 0, 'price_per_seat': 1299.99},

            # M.Tech Courses
            {'course_name': 'M.Tech', 'branch': 'Artificial Intelligence', 'total_seats': 40, 'locked_seats': 0, 'price_per_seat': 1999.99},
            {'course_name': 'M.Tech', 'branch': 'Data Science', 'total_seats': 35, 'locked_seats': 0, 'price_per_seat': 1899.99},
            {'course_name': 'M.Tech', 'branch': 'Robotics', 'total_seats': 30, 'locked_seats': 0, 'price_per_seat': 1999.99},
            {'course_name': 'M.Tech', 'branch': 'Cyber Security', 'total_seats': 38, 'locked_seats': 0, 'price_per_seat': 1899.99},
            {'course_name': 'M.Tech', 'branch': 'VLSI Design', 'total_seats': 32, 'locked_seats': 0, 'price_per_seat': 1849.99},
            {'course_name': 'M.Tech', 'branch': 'Machine Learning', 'total_seats': 37, 'locked_seats': 0, 'price_per_seat': 1949.99},

            # Polytechnic Courses (Diploma)
            {'course_name': 'Diploma', 'branch': 'Electrical Engineering', 'total_seats': 50, 'locked_seats': 0, 'price_per_seat': 599.99},
            {'course_name': 'Diploma', 'branch': 'Automobile Engineering', 'total_seats': 45, 'locked_seats': 0, 'price_per_seat': 649.99},
            {'course_name': 'Diploma', 'branch': 'Mechanical Engineering', 'total_seats': 55, 'locked_seats': 0, 'price_per_seat': 625.99},
            {'course_name': 'Diploma', 'branch': 'Civil Engineering', 'total_seats': 48, 'locked_seats': 0, 'price_per_seat': 620.99},
            {'course_name': 'Diploma', 'branch': 'Electronics Engineering', 'total_seats': 42, 'locked_seats': 0, 'price_per_seat': 610.99},

            # Diploma Courses
            {'course_name': 'Diploma', 'branch': 'Software Development', 'total_seats': 60, 'locked_seats': 0, 'price_per_seat': 749.99},
            {'course_name': 'Diploma', 'branch': 'Cyber Security', 'total_seats': 55, 'locked_seats': 0, 'price_per_seat': 799.99},
            {'course_name': 'Diploma', 'branch': 'Graphic Designing', 'total_seats': 52, 'locked_seats': 0, 'price_per_seat': 699.99},
            {'course_name': 'Diploma', 'branch': 'Digital Marketing', 'total_seats': 58, 'locked_seats': 0, 'price_per_seat': 749.99},
            {'course_name': 'Diploma', 'branch': 'Game Development', 'total_seats': 40, 'locked_seats': 0, 'price_per_seat': 849.99},

            # ITI Courses
            {'course_name': 'ITI', 'branch': 'Electrician', 'total_seats': 40, 'locked_seats': 0, 'price_per_seat': 449.99},
            {'course_name': 'ITI', 'branch': 'Fitter', 'total_seats': 35, 'locked_seats': 0, 'price_per_seat': 429.99},
            {'course_name': 'ITI', 'branch': 'Welder', 'total_seats': 30, 'locked_seats': 0, 'price_per_seat': 399.99},
            {'course_name': 'ITI', 'branch': 'Mechanic Diesel', 'total_seats': 38, 'locked_seats': 0, 'price_per_seat': 449.99},
            {'course_name': 'ITI', 'branch': 'Plumber', 'total_seats': 42, 'locked_seats': 0, 'price_per_seat': 399.99},
            {'course_name': 'ITI', 'branch': 'Carpenter', 'total_seats': 36, 'locked_seats': 0, 'price_per_seat': 429.99},
            {'course_name': 'ITI', 'branch': 'Turner', 'total_seats': 34, 'locked_seats': 0, 'price_per_seat': 419.99},
            {'course_name': 'ITI', 'branch': 'Electronics Mechanic', 'total_seats': 37, 'locked_seats': 0, 'price_per_seat': 469.99}
        ]

        # Clear existing courses
        Course.query.delete()

        # Add new sample courses, computing left_seats dynamically
        for course_data in sample_courses:
            course_data['left_seats'] = course_data['total_seats'] - course_data['locked_seats']
            course = Course(**course_data)
            db.session.add(course)

        db.session.commit()
        return jsonify({"message": "Sample courses created successfully", "count": len(sample_courses)}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating sample data", "error": str(e)}), 500

@courses_bp.route('/courses/update-multiple', methods=['GET'])
def update_multiple_courses():
    try:
        Course.query.filter_by(course_name='B.Tech').update({'price_per_seat': 250000})
        Course.query.filter_by(course_name='M.Tech').update({'price_per_seat': 300000})
        Course.query.filter_by(course_name='Polytechnic').update({'price_per_seat': 150000, 'course_name': 'Diploma'})
        Course.query.filter_by(course_name='Diploma').update({'price_per_seat': 150000})
        Course.query.filter_by(course_name='ITI').update({'price_per_seat': 100000})
        db.session.commit()
        
        return jsonify({
            "message": "Courses updated successfully",
            "updated_courses": "B.Tech, M.Tech, Polytechnic, Diploma, ITI"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500

@courses_bp.route('/seats-by-city', methods=['GET'])
def get_seats_by_city():
    try:
        # Query to get total and available seats by city
        seats_by_city = db.session.query(
            Course.city,
            func.sum(Course.total_seats).label('total_seats'),
            func.sum(Course.available_seats).label('available_seats')
        ).group_by(Course.city).all()
        
        # Convert to dictionary format
        result = {
            city: {
                'totalSeats': int(total_seats),
                'availableSeats': int(available_seats)
            }
            for city, total_seats, available_seats in seats_by_city
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500