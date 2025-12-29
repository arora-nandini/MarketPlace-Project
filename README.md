# Engineering Project Marketplace (MVP)

A full-stack web application that allows users to **buy, sell, and manage engineering projects**, including digital source code, documentation, demo videos, and physical kits.  
The platform also integrates an **AI-based plagiarism checker** powered by a Python microservice.

---

## Github Link:
https://github.com/arora-nandini/MarketPlace-Project

## 🚀 Features

### 👤 Authentication
- User registration & login using JWT authentication
- Role-based access (Buyer / Seller)

### 📦 Project Marketplace
- Browse all projects with images, price, and tech stack
- Detailed project view with media previews
- Support for:
  - Multiple images
  - Code ZIP files
  - Documentation PDFs
  - Demo videos (YouTube or uploaded)

### 🧑‍💻 Seller Dashboard
- Upload new projects
- Edit existing projects
- Delete projects
- View orders received from buyers

### 🛒 Orders & Payments
- Buyers can purchase projects
- Order tracking for buyers and sellers
- Digital projects unlock download access after payment
- Physical projects store shipping details

### 🤖 AI Plagiarism Checker
- Upload ZIP files containing source code
- FastAPI-based microservice analyzes similarity
- Returns plagiarism score and file comparisons
- Helps sellers verify originality before listing projects

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Redux Toolkit
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer (file handling)
- Cloudinary (media storage)

### Microservice
- Python
- FastAPI
- AI/ML similarity logic for plagiarism detection

---
# Start Plagiarism Microservice

cd microservice
python -m venv venv
venv\Scripts\activate  
pip install -r requirements.txt
uvicorn main:app --reload

# Start Frontend
cd client
npm install
npm run dev

# Start Backend
bash
cd server
npm install
npm run dev

# Notes & Assumptions

Payment flow is simulated for MVP purposes

AI plagiarism results are approximate and intended for demo use

Project focuses on functionality over UI polish

