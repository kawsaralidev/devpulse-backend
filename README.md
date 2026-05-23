DevPulse Backend API

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

Live URL

Backend Live Link: https://devpulse-backend-six.vercel.app/

Features
User Registration
User Login with JWT Authentication
Password Hashing using bcrypt
Role-based Authorization
Create Issues
Get All Issues
Get Single Issue
Update Issues
Delete Issues
Issue Filtering & Sorting
PostgreSQL Database Integration
Raw SQL Queries using pg
Tech Stack
Node.js
Express.js
TypeScript
PostgreSQL
Raw SQL
JWT (jsonwebtoken)
bcryptjs
pg
Project Setup

1. Clone the repository
   git clone https://github.com/kawsaralidev/devpulse-backend.git
2. Move into the project folder
   cd devpulse-backend
3. Install dependencies
   npm install
4. Create .env file

Create a .env file in the root directory and add:

PORT=5000
DATABASE_URL
JWT_SECRET

npm run dev
API Endpoints
Authentication
Register User
POST /api/auth/signup
Login User
POST /api/auth/login
Issues
Create Issue
POST /api/issues
Get All Issues
GET /api/issues
Get Single Issue
GET /api/issues/:id
Update Issue
PATCH /api/issues/:id
Delete Issue
DELETE /api/issues/:id

Database Schema Summary
Users Table
Field Type
id SERIAL PRIMARY KEY
name VARCHAR(100)
email VARCHAR(100) UNIQUE
password TEXT
role VARCHAR(20)
created_at TIMESTAMP
updated_at TIMESTAMP
Issues Table
Field Type
id SERIAL PRIMARY KEY
title VARCHAR(150)
description TEXT
type VARCHAR(30)
status VARCHAR(30)
reporter_id INT
created_at TIMESTAMP
updated_at TIMESTAMP
Authentication

Protected routes require JWT token in Authorization header.

Example:

Authorization: your_jwt_token
