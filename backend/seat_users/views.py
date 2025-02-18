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

def send_sms(phone_number, otp):
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

@csrf_exempt
@require_POST
def generate_otp(request):
    user_id = request.user.id
    data = json.loads(request.body)
    
    user = User.objects.get(pk=user_id)
    if not user or not user.phone_number:
        return JsonResponse({"message": "User phone number not found"}, status=400)
    
    otp = ''.join(random.choices(string.digits, k=6))
    sms_response = send_sms(user.phone_number, otp)
    if not sms_response or not sms_response.get("return"):
        return JsonResponse({"message": "Failed to send OTP"}, status=500)
    
    billing, created = Billing.objects.get_or_create(user=user, payment_status='pending')
    billing.otp = otp
    billing.selected_courses = data.get('selected_courses')
    billing.total_price = data.get('total_price')
    billing.save()
    
    return JsonResponse({
        "message": "OTP sent successfully",
        "phone": f"xxxxxx{user.phone_number[-4:]}"
    })

@csrf_exempt
@require_POST
def verify_otp(request):
    user_id = request.user.id
    data = json.loads(request.body)
    
    try:
        billing = Billing.objects.get(user_id=user_id, payment_status='pending')
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

def create_sample_data(request):
    try:
        sample_courses = [
            # ...sample course data...
        ]

        Course.objects.all().delete()

        for course_data in sample_courses:
            course_data['left_seats'] = course_data['total_seats'] - course_data['locked_seats']
            course = Course(**course_data)
            course.save()

        return JsonResponse({"message": "Sample courses created successfully", "count": len(sample_courses)}, status=201)
    except Exception as e:
        return JsonResponse({"message": "Error creating sample data", "error": str(e)}, status=500)

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
