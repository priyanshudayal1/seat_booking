from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import User
import json
from django.views.decorators.http import require_POST
from .models import Billing
import random
import string
import requests
import os
from .models import Course

@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if User.objects.filter(email=data['email']).exists():
            return JsonResponse({"message": "Email already registered"}, status=400)
        if User.objects.filter(phone_number=data['phone_number']).exists():
            return JsonResponse({"message": "Phone number already registered"}, status=400)
        
        hashed_password = make_password(data['password'])
        new_user = User(
            full_name=data['full_name'],
            designation=data['designation'],
            email=data['email'],
            phone_number=data['phone_number'],
            company_name=data['company_name'],
            password=hashed_password
        )
        new_user.save()
        return JsonResponse({"message": "User registered successfully"}, status=201)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        identifier = data.get('email') or data.get('phone_number')
        password = data['password']
        
        try:
            user = User.objects.get(email=identifier) if '@' in identifier else User.objects.get(phone_number=identifier)
            if not check_password(password, user.password):
                print("Invalid credentials")
                return JsonResponse({"message": "Invalid credentials"}, status=401)
            return JsonResponse({"user": user.to_dict()})
        except User.DoesNotExist:
            print("User not found")
            return JsonResponse({"message": "Invalid credentials"}, status=401)

@csrf_exempt
def get_profile(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        return JsonResponse(user.to_dict())
    except User.DoesNotExist:
        return JsonResponse({"message": "User not found"}, status=404)

@csrf_exempt
def update_profile(request, user_id):
    if request.method == 'PUT':
        try:
            user = User.objects.get(pk=user_id)
            data = json.loads(request.body)
            
            if 'full_name' in data:
                user.full_name = data['full_name']
            if 'designation' in data:
                user.designation = data['designation']
            if 'company_name' in data:
                user.company_name = data['company_name']
            if 'phone_number' in data:
                if User.objects.filter(phone_number=data['phone_number']).exclude(pk=user_id).exists():
                    return JsonResponse({"message": "Phone number already in use"}, status=400)
                user.phone_number = data['phone_number']
            if 'password' in data:
                user.password = make_password(data['password'])
            
            user.save()
            return JsonResponse({"message": "Profile updated successfully", "user": user.to_dict()})
        except User.DoesNotExist:
            return JsonResponse({"message": "User not found"}, status=404)

from django.core.mail import send_mail

def send_sms(email, otp):
    subject = "Your OTP Code"
    message = f"Your OTP code is {otp}."
    from_email = os.getenv("EMAIL_HOST_USER", "your-email@example.com")
    recipient_list = [email]
    
    try:
        send_mail(subject, message, from_email, recipient_list)
        return {"status": True, "message": "Email sent successfully"}
    except Exception as e:
        print(f"Email sending failed: {str(e)}")
        return {"status": "error", "message": str(e)}

@csrf_exempt
@require_POST
def generate_otp(request):
    data = json.loads(request.body)
    
    # Get user ID and verify user exists
    user_id = data.get('userId')
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"message": "User not found"}, status=404)

    if not user.email:
        return JsonResponse({"message": "User email not found"}, status=400)
    
    # Generate OTP
    otp = ''.join(random.choices(string.digits, k=6))
    
    # Send OTP via email
    sms_response = send_sms(user.email, otp)
    
    # Create or update billing record
    billing, created = Billing.objects.get_or_create(
        user=user,
        payment_status='pending',
        defaults={
            'selected_courses': data.get('selected_courses', []),
            'total_price': data.get('total_price', 0)
        }
    )
    
    if not created:
        billing.selected_courses = data.get('selected_courses', [])
        billing.total_price = data.get('total_price', 0)
    
    billing.otp = otp
    billing.save()
    
    return JsonResponse({
        "message": "OTP sent successfully", 
        "phone": f"{'*' * (len(user.email.split('@')[0]) - 2)}{user.email[-2:]}@{user.email.split('@')[1]}"
    })

@csrf_exempt
@require_POST
def verify_otp(request):
    data = json.loads(request.body)
    user_id = data.get('userId')
    print(data)
    
    try:
        billing = Billing.objects.get(user_id=user_id)
        print(billing.otp, data['otp'])
        if billing.otp != data['otp']:
            return JsonResponse({"message": "Invalid OTP"}, status=400)
        
        billing.is_verified = True
        billing.save()
        return JsonResponse({"message": "OTP verified successfully"})
    except Billing.DoesNotExist:
        return JsonResponse({"message": "No pending transaction found"}, status=404)

@csrf_exempt
@require_POST
def process_payment(request):
    user_id = request.user.id
    data = json.loads(request.body)
    
    try:
        billing = Billing.objects.get(user_id=user_id, payment_status='pending')
        if not billing.is_verified:
            return JsonResponse({"message": "Please verify OTP before proceeding with payment"}, status=400)
        
        billing.payment_status = 'completed'
        billing.save()
        
        return JsonResponse({
            "message": "Payment processed successfully",
            "transaction_id": billing.id
        })
    except Billing.DoesNotExist:
        return JsonResponse({"message": "No pending transaction found"}, status=404)

def get_available_courses(request):
    courses = Course.objects.all()
    return JsonResponse([course.to_dict() for course in courses], safe=False)

@csrf_exempt
@require_POST
def select_courses(request):
    user_id = request.user.id
    data = json.loads(request.body)
    
    selected_courses = data.get('selected_courses', [])
    total_students = 0
    
    try:
        user = User.objects.get(pk=user_id)
        
        for selection in selected_courses:
            course = Course.objects.get(pk=selection['course_id'])
            seats_requested = selection['seats']
            
            if course.left_seats < seats_requested:
                return JsonResponse({"message": f"Not enough seats available for {course.course_name}"}, status=400)
                
            course.left_seats -= seats_requested
            total_students += seats_requested
        
        user.adopted_students += total_students
        user.save()
        return JsonResponse({"message": "Courses selected successfully", "total_students": total_students}, status=200)
    except Course.DoesNotExist:
        return JsonResponse({"message": "Course not found"}, status=404)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)

def get_course_details(request, course_name):
    try:
        branches = Course.objects.filter(course_name=course_name)
        
        if not branches:
            return JsonResponse({'message': 'Course not found'}, status=404)
            
        branches_data = {}
        for branch in branches:
            branches_data[str(branch.id)] = {
                'name': branch.branch,
                'totalSeats': branch.total_seats,
                'leftSeats': branch.left_seats,
                'lockedSeats': branch.locked_seats
            }
            
        return JsonResponse({'branches': branches_data, 'pricePerSeat': branch.price_per_seat})
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)

@csrf_exempt
@require_POST
def generate_course_otp(request):
    user_id = request.user.id
    data = json.loads(request.body)
    
    try:
        user = User.objects.get(pk=user_id)
        
        if not user:
            return JsonResponse({'message': 'User not found'}, status=404)
            
        otp = str(random.randint(100000, 999999))
        user.otp = otp
        user.course_selections = json.dumps(data.get('selections'))
        user.save()
        
        # TODO: Send OTP via email/SMS
        
        return JsonResponse({'message': 'OTP generated successfully'})
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)

@csrf_exempt
@require_POST
def verify_course_otp(request):
    user_id = request.user.id
    data = json.loads(request.body)
    
    try:
        user = User.objects.get(pk=user_id)
        
        if not user:
            return JsonResponse({'message': 'User not found'}, status=404)
            
        submitted_otp = data.get('otp')
        
        if not submitted_otp or submitted_otp != user.otp:
            return JsonResponse({'message': 'Invalid OTP'}, status=400)
            
        user.otp = None
        user.save()
        
        return JsonResponse({'message': 'OTP verified successfully', 'selections': json.loads(user.course_selections)})
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)

# NOTE : for testing data creation
@csrf_exempt
def update_multiple_courses(request):
    try:
        Course.objects.filter(course_name='B.Tech').update(price_per_seat=250000)
        Course.objects.filter(course_name='M.Tech').update(price_per_seat=300000)
        Course.objects.filter(course_name='Polytechnic').update(price_per_seat=150000, course_name='Diploma')
        Course.objects.filter(course_name='Diploma').update(price_per_seat=150000)
        Course.objects.filter(course_name='ITI').update(price_per_seat=100000)
        
        return JsonResponse({"message": "Courses updated successfully", "updated_courses": "B.Tech, M.Tech, Polytechnic, Diploma, ITI"}, status=200)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)

@csrf_exempt
def get_courses_by_city(request, city_name):
    try:
        courses = Course.objects.filter(city=city_name)
        if not courses:
            return JsonResponse({"message": "No courses found in this city"}, status=404)
            
        courses_by_type = {}
        for course in courses:
            if course.course_name not in courses_by_type:
                courses_by_type[course.course_name] = {
                    'branches': [],
                    'price_per_seat': course.price_per_seat
                }
            courses_by_type[course.course_name]['branches'].append({
                'id': course.id,
                'name': course.branch,
                'totalSeats': course.total_seats,
                'leftSeats': course.left_seats,
                'lockedSeats': course.locked_seats
            })
        
        return JsonResponse({
            'city': city_name,
            'courses': courses_by_type
        })
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)

@csrf_exempt
def get_cities_with_seats(request):
    try:
        cities = Course.objects.values('city').annotate(
            total_seats=models.Sum('total_seats'),
            available_seats=models.Sum('left_seats')
        )
        
        city_data = {
            city['city']: {
                'totalSeats': city['total_seats'],
                'availableSeats': city['available_seats']
            }
            for city in cities
        }
        
        return JsonResponse(city_data)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)

@csrf_exempt
def populate_initial_data(request):
    try:
        json_file_path = os.path.join(os.path.dirname(__file__), 'output.json')
        # Define price mapping
        price_mapping = {
            'B.Tech': 250000,  # 2.5 lakh
            'Diploma': 150000,  # 1.5 lakh
            'ITI': 100000      # 1 lakh
        }
    
        with open(json_file_path, 'r') as file:
            data = json.load(file)
            for course in data:
                # Print courses where total_seats is None
                if course.get('total_seats') is None:
                    print(f"Course with no seats: {course['course_name']} - {course['branch']} - {course['city']}")
                    continue
                
                print('course:', course)
                # Fix: Use 'institute_type ' with space to match JSON key
                new_course = Course(
                    course_name=course['course_name'],
                    branch=course['branch'],
                    city=course['city'],
                    total_seats=course['total_seats'],
                    left_seats=course['total_seats'],
                    price_per_seat=price_mapping.get(course['course_name'], 0),
                    institute_type=course['institute_type '].strip()  # Added strip() to remove whitespace
                )
                new_course.save()
        return JsonResponse({"message": "Data populated successfully"}, status=200)
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        print(f"Error details: {type(e).__name__}")
        return JsonResponse({"message": f"Error: {str(e)}", "error_type": type(e).__name__}, status=500)
