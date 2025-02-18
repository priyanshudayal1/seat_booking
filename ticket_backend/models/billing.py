from app import db
from datetime import datetime
from sqlalchemy import DECIMAL

class Billing(db.Model):
    __tablename__ = 'billing'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    selected_courses = db.Column(db.JSON, nullable=False)
    total_price = db.Column(DECIMAL(10,2), nullable=False)
    otp = db.Column(db.String(10))
    payment_status = db.Column(db.Enum('pending', 'completed'), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'selected_courses': self.selected_courses,
            'total_price': str(self.total_price),
            'payment_status': self.payment_status,
            'created_at': self.created_at.isoformat()
        }