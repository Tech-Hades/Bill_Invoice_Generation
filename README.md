# Small Business Invoice & Billing Portal

A full-stack web application developed during internship for managing invoices, clients, billing records, and payment tracking for small businesses. The system was built using React.js for the frontend, PHP REST APIs for the backend, and MySQL for database management following a 3-tier architecture model.

The project provides a responsive dashboard interface where businesses can securely manage clients, generate invoices dynamically, track payment statuses, and monitor business analytics efficiently.

---

## 🚀 Features

- Secure User Authentication
- Responsive Dashboard UI
- Client Management System
- Dynamic Invoice Generation
- Invoice History & Tracking
- Payment Status Monitoring
- RESTful API Integration
- Multi-Tenant Business Support
- Real-Time Dashboard Analytics
- Relational Database Management
- Prepared Statements using PDO
- Secure Password Hashing with bcrypt
- ON DELETE CASCADE Database Integrity

---

## 🛠 Technologies Used

### Frontend
- React.js
- Tailwind CSS
- Axios
- JavaScript
- HTML5
- CSS3

### Backend
- PHP 8.x
- RESTful APIs

### Database
- MySQL

### Tools & Environment
- XAMPP
- Git & GitHub
- VS Code

---

## 🏗 System Architecture

The project follows a 3-tier architecture:

1. **Presentation Layer**
   - React.js frontend for user interaction

2. **Application Layer**
   - PHP REST API backend for business logic and communication

3. **Data Layer**
   - MySQL relational database for secure data storage

---

## ⚙️ Installation & Setup

### 1. Install Required Software

Install the following before running the project:

- Node.js
- XAMPP
- Git
- VS Code (Recommended)

---

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/Small-Business-Invoice-Portal.git
```

---

### 3. Setup Frontend

Open terminal inside the `frontend` folder and run:

```bash
npm install
npm run dev
```

The React frontend will start on:

```plaintext
http://localhost:5173
```

---

### 4. Setup Backend

Copy the `backend` folder into:

```plaintext
C:\xampp\htdocs\
```

Start:
- Apache
- MySQL

from the XAMPP Control Panel.

Backend API will run on:

```plaintext
http://localhost/backend/
```

---

### 5. Setup Database

- Open phpMyAdmin
- Create a database named:

```plaintext
invoice_portal
```

- Import the SQL file located inside:

```plaintext
database/invoice_portal.sql
```

---

### 6. Configure Database Connection

Open:

```plaintext
backend/config/database.php
```

Update credentials if required:

```php
$host = "localhost";
$user = "root";
$password = "";
$database = "invoice_portal";
```

---

### 7. Run the Project

- Start XAMPP services
- Run React frontend using:

```bash
npm run dev
```

- Open browser and access:

```plaintext
http://localhost:5173
```

The Invoice & Billing Portal will now run successfully.

## ✅ Project Ready

The Invoice & Billing Portal should now be running successfully with:

- React Frontend
- PHP Backend APIs
- MySQL Database
- XAMPP Server

## 📊 Modules Implemented

### Authentication Module
- User login & registration
- Password hashing using bcrypt
- Session validation

### Client Management Module
- Add/Edit/Delete clients
- Client record maintenance

### Invoice Module
- Dynamic invoice generation
- Line item support
- Invoice tracking

### Payment Module
- Paid/Pending status tracking
- Payment monitoring dashboard

### Dashboard Analytics
- Total invoices
- Revenue statistics
- Pending payment insights

---

## 🖼 Screenshots

## Login Page
![Login Page](screenshots/login.png)

---

## Dashboard
![Dashboard](screenshots/dashboard.png)

---

## Invoice Generation
![Invoice Generation](screenshots/invoice.png)

---

## Client Management
![Client Management](screenshots/clients.png)

---

## Payment Tracking
![Payment Tracking](screenshots/payments.png)

---

## Database Schema
![Database Schema](screenshots/database-schema.png)

---

## 📈 Learning Outcomes

Through this project, the following concepts were learned and implemented:

- Full-Stack Web Development
- REST API Development
- Database Design & Relationships
- Authentication & Security
- CRUD Operations
- Responsive UI Design
- API Integration using Axios
- Backend-Frontend Communication
- Relational Database Management

---

## 🔮 Future Improvements

- PDF Invoice Export
- Email Notifications
- GST & Tax Automation
- Role-Based Access Control
- Cloud Deployment
- Advanced Reporting & Analytics

---

## 👨‍💻 Internship Major Project

This project was developed as part of an internship major project to gain practical exposure to modern full-stack web development technologies and real-world business application development.

---

## 📌 Author

Developed by: Renuka Uvaraj
Internship Project  
Electronics & Communication Engineering

---

## ⭐ GitHub Repository

If you found this project useful, consider giving it a star ⭐
