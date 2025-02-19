from django.urls import path
from . import views

urlpatterns = [
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('profile/<int:user_id>', views.get_profile, name='get_profile'),
    path('profile/update/<int:user_id>', views.update_profile, name='update_profile'),
    path('generate-otp', views.generate_otp, name='generate_otp'),
    path('verify-otp', views.verify_otp, name='verify_otp'),
    path('process-payment', views.process_payment, name='process_payment'),
    path('courses', views.get_available_courses, name='get_available_courses'),
    path('course/select', views.select_courses, name='select_courses'),
    path('course/<str:course_name>', views.get_course_details, name='get_course_details'),
    path('course/generate-otp', views.generate_course_otp, name='generate_course_otp'),
    path('course/verify-otp', views.verify_course_otp, name='verify_course_otp'),
    path('course/update-multiple', views.update_multiple_courses, name='update_multiple_courses'),
    path('cities', views.get_cities_with_seats, name='get_cities_with_seats'),
    path('city/<str:city_name>', views.get_courses_by_city, name='get_courses_by_city'),
    path('seats-by-city', views.get_cities_with_seats, name='get_seats_by_city'),  # Fixed endpoint
    path('populate_initial_data', views.populate_initial_data, name='populate_initial_data'),
]
