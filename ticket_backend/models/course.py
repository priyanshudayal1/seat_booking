from app import db
from sqlalchemy import DECIMAL

class Course(db.Model):
    __tablename__ = 'courses'
    
    id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(255), nullable=False)
    branch = db.Column(db.String(255), nullable=False)
    total_seats = db.Column(db.Integer, nullable=False)
    locked_seats = db.Column(db.Integer, default=0)
    left_seats = db.Column(db.Integer, nullable=False)
    price_per_seat = db.Column(DECIMAL(10,2), nullable=False)
    institute_name = db.Column(db.String(255), nullable=False,default='JEC Jabalpur')
    city = db.Column(db.String(255), nullable=False,default='Jabalpur')
    
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