from functools import wraps
from flask import jsonify, request
from models.user import User

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # Skip token validation and assume admin access
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def user_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            if request.method == 'OPTIONS':
                response = jsonify({"message": "OK"})
                response.headers.add('Access-Control-Allow-Headers', 'Authorization')
                response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                return response, 200

            # Skip token validation and user checks
            return fn(*args, **kwargs)
        return decorator
    return wrapper