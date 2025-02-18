from flask import Flask
from flask_cors import CORS
from extensions import db, jwt
from config.config import config
from flask_wtf.csrf import CSRFProtect

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize CSRF protection
    csrf = CSRFProtect()
    csrf.init_app(app)
    
    # Initialize extensions with permissive CORS configuration
    CORS(app, 
         resources={r"/*": {"origins": "*"}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    # Disable CSRF globally
    app.config['WTF_CSRF_ENABLED'] = False
    
    # Initialize other extensions
    db.init_app(app)
    jwt.init_app(app)
    
    with app.app_context():
        # Import routes after db initialization
        from routes.auth import auth_bp
        from routes.courses import courses_bp
        from routes.admin import admin_bp
        
        # Register blueprints
        app.register_blueprint(auth_bp, url_prefix='//auth')
        app.register_blueprint(courses_bp, url_prefix='//courses')
        app.register_blueprint(admin_bp, url_prefix='//admin')
        
        # Create database tables
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)