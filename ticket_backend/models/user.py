from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(255), nullable=False)
    designation = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    company_name = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    adopted_students = db.Column(db.Integer, default=0)
    role = db.Column(db.String(20), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
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