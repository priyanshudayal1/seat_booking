from django.db import models
from django.utils import timezone

class Billing(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    selected_courses = models.JSONField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    otp = models.CharField(max_length=10, blank=True, null=True)
    payment_status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('completed', 'Completed')], default='pending')
    created_at = models.DateTimeField(default=timezone.now)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user.id,
            'selected_courses': self.selected_courses,
            'total_price': str(self.total_price),
            'payment_status': self.payment_status,
            'created_at': self.created_at.isoformat()
        }

class Course(models.Model):
    course_name = models.CharField(max_length=255)
    branch = models.CharField(max_length=255)
    total_seats = models.IntegerField()
    locked_seats = models.IntegerField(default=0)
    left_seats = models.IntegerField()
    price_per_seat = models.DecimalField(max_digits=10, decimal_places=2)
    institute_name = models.CharField(max_length=255, default='JEC Jabalpur')
    city = models.CharField(max_length=255, default='Jabalpur')

    def to_dict(self):
        return {
            'id': self.id,
            'course_name': self.course_name,
            'branch': self.branch,
            'total_seats': self.total_seats,
            'locked_seats': self.locked_seats,
            'left_seats': self.left_seats,
            'price_per_seat': str(self.price_per_seat),
            'institute_name': self.institute_name,
            'city': self.city
        }

    def update_seats(self):
        self.left_seats = self.total_seats - self.locked_seats

class User(models.Model):
    full_name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, unique=True)
    company_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    adopted_students = models.IntegerField(default=0)
    role = models.CharField(max_length=20, default='user')
    created_at = models.DateTimeField(default=timezone.now)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'designation': self.designation,
            'email': self.email,
            'phone_number': self.phone_number,
            'company_name': self.company_name,
            'adopted_students': self.adopted_students,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }