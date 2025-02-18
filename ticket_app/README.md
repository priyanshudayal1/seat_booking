# **Revised Detailed Steps for Developing the Ticket Booking Portal**

---

## **1️⃣ Project Setup**
### **Frontend (React)**
1. Initialize a React project:  
   ```sh
   npx create-react-app gis-portal
   cd gis-portal
   npm install axios react-router-dom redux react-redux tailwindcss
   ```
2. Set up Tailwind CSS for styling.
3. Structure the app into components:
   - **Auth**: `Register.js`, `Login.js`
   - **Profile**: `Profile.js`
   - **Dashboard**: `Dashboard.js`
   - **Course Selection**: `CourseForm.js`
   - **OTP & Payment**: `OTPVerification.js`, `Payment.js`

### **Backend (Flask)**
1. Set up Flask and required dependencies:
   ```sh
   pip install flask flask-cors flask-sqlalchemy flask-jwt-extended flask-bcrypt pymysql
   ```
2. Create a `config.py` file for database connection.
3. Structure backend into modules:
   - **Authentication** (`auth.py`)
   - **Courses Management** (`courses.py`)
   - **Booking & Payment** (`billing.py`)

---

## **2️⃣ Database Schema**
### **Tables:**
✅ `users` – Stores user details and adopted students.  
✅ `admin` – Admin authentication.  
✅ `courses` – Stores course details, available seats, and locked seats.  
✅ `billing` – Manages OTP and payment status.

---

### **📌 `users` Table (User Registration)**
| Column Name       | Data Type     | Constraints                     |
|------------------|--------------|---------------------------------|
| id              | INT          | Primary Key, Auto Increment     |
| full_name       | VARCHAR(255) | NOT NULL                        |
| designation     | VARCHAR(255) | NOT NULL                        |
| email           | VARCHAR(255) | UNIQUE, NOT NULL                |
| phone_number    | VARCHAR(20)  | UNIQUE, NOT NULL                |
| company_name    | VARCHAR(255) | NOT NULL                        |
| password        | VARCHAR(255) | Hashed using Bcrypt             |
| adopted_students| INT          | Default `0` (Students booked)   |
| created_at      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP       |

---

### **📌 `admin` Table**
| Column Name | Data Type     | Constraints                     |
|------------|--------------|---------------------------------|
| id         | INT          | Primary Key, Auto Increment     |
| email      | VARCHAR(255) | UNIQUE, NOT NULL                |
| password   | VARCHAR(255) | Hashed using Bcrypt             |
| role       | VARCHAR(50)  | DEFAULT 'admin'                 |

---

### **📌 `courses` Table**
| Column Name    | Data Type     | Constraints                   |
|---------------|--------------|-------------------------------|
| id            | INT          | Primary Key, Auto Increment   |
| course_name   | VARCHAR(255) | NOT NULL                      |
| branch        | VARCHAR(255) | NOT NULL                      |
| total_seats   | INT          | NOT NULL                      |
| locked_seats  | INT          | Default `0` (Reserved Seats)  |
| left_seats    | INT          | NOT NULL                      |
| price_per_seat| DECIMAL(10,2)| NOT NULL                      |

**Seat Availability Formula:**  
```sql
left_seats = total_seats - locked_seats - booked_seats
```

---

### **📌 `billing` Table**
| Column Name    | Data Type     | Constraints                      |
|---------------|--------------|----------------------------------|
| id            | INT          | Primary Key, Auto Increment      |
| user_id       | INT          | Foreign Key (users.id)           |
| selected_courses | JSON       | Stores selected courses & seats |
| total_price   | DECIMAL(10,2)| NOT NULL                         |
| otp           | VARCHAR(10)  | OTP for verification             |
| payment_status| ENUM('pending', 'completed') | Default 'pending' |

---

## **3️⃣ Backend (Flask) - API Endpoints**
### **🔹 Admin Operations**
✅ `POST /admin/login` – Admin authentication  
✅ `GET /admin/courses` – Get all courses with details  
✅ `PUT /admin/course/:id` – Update course details (seats/price)  
✅ `POST /admin/course` – Add new course  
✅ `DELETE /admin/course/:id` – Remove course

### **🔹 User Authentication**
✅ `POST /register` – Register with full name, email, phone, etc.  
✅ `POST /login` – Login using email/phone & password.  
✅ `GET /user/profile` – Fetch user profile.  
✅ `PUT /user/profile/update` – Update profile.

---

### **🔹 Course Selection**
✅ `GET /courses` – Get available courses, locked seats, left seats.  
✅ `POST /course/select` – User selects branches/seats, updates `adopted_students`.

---

### **🔹 OTP & Payment**
✅ `POST /generate-otp` – Generate OTP before payment.  
✅ `POST /verify-otp` – Verify OTP.  
✅ `POST /process-payment` – Integrate Razorpay/Stripe.

---

## **4️⃣ Frontend (React) - Stepwise Implementation**
### **🔹 Authentication (Login & Signup)**
- **Register Page** (`Register.js`):  
  - Collect full name, designation, email, phone, company name, and password.
  - Send data to `POST /register`.
  - On success, redirect to login.

- **Login Page** (`Login.js`):  
  - Allow login via **email/phone + password**.
  - Store JWT token.

---

### **🔹 Profile Management (`Profile.js`)**
- Fetch user details from `GET /user/profile`.
- Allow profile updates (`PUT /user/profile/update`).

---

### **🔹 Multi-Step Course Selection (`CourseForm.js`)**
#### **Step 1: Choose Course**
- Display available **M.Tech, B.Tech, Diploma, ITI**.

#### **Step 2: Select Branches & Seats**
- Show **total seats, locked seats, left seats**.
- Allow users to select multiple branches and seats.
- Show total price calculation (`selected seats × price per seat`).

#### **Step 3: Repeat for All Courses**
- Allow selection for all four courses.

#### **Step 4: Show Summary & OTP Verification**
- Display **selected courses, total price**.
- Generate OTP (`POST /generate-otp`).
- Verify OTP (`POST /verify-otp`).

---

### **🔹 Payment (`Payment.js`)**
- On OTP verification, redirect to **payment gateway**.
- Use Razorpay/Stripe for processing.
- Update `payment_status = 'completed'` after success.

---

### **🔹 Admin Dashboard**
- **Course Management** (`AdminDashboard.js`):
  - View all courses and their details
  - Update total seats, left seats, and price per seat
  - Add new courses
  - Remove existing courses
  - Monitor seat availability

---

## **5️⃣ Deployment & Hosting**
### **Backend (Flask)**
- Host on **AWS EC2**.
- Use **MySQL RDS** for database.
- Deploy with **Nginx & Gunicorn**.

### **Frontend (React)**
- Deploy on **Vercel / Netlify**.

---

## **6️⃣ Summary - Features Covered**
✅ **User Registration & Login** (Email/Phone + Password).  
✅ **Profile Management** (Update details).  
✅ **Course Selection** (Multi-step form with seat availability).  
✅ **Locked Seats Handling** (Reserved seats for specific quota).  
✅ **Adopted Students Tracking** (Total students a user booked).  
✅ **OTP Verification** (Before payment).  
✅ **Payment Processing** (Stripe/Razorpay).  

---

## **7️⃣ Next Steps**
💡 **Would you like me to generate backend authentication code in Flask first?** 🚀