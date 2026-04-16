# SkillX - Online Skill Exchange Platform

This project is split into a **Frontend** (Vanilla JS) and a **Backend** (Spring Boot).

## 🚀 How to Run

### 1. Backend (Spring Boot)
The backend uses MongoDB for data storage.
- **Prerequisites**: 
  - Java 17 or higher (Verified: Java 23 installed).
  - MongoDB Atlas account (configured in `.env`).
- **Run Command**:
  From the project root, run:
  ```powershell
  .\backend\apache-maven-3.9.6\bin\mvn.cmd -f backend/pom.xml spring-boot:run
  ```
  *Note: The project includes a local Maven installation to ensure it runs even if Maven is not in your system path.*

### 2. Frontend (Vanilla JS)
The frontend consists of static files. You can run it in two ways:
- **Option A (Simple)**: Open `frontend/index.html` directly in your web browser.
- **Option B (Dev Server)**: Use a local server (most reliable for Chat features):
  ```bash
  npx serve frontend
  ```

## 🛠 Project Structure
- `frontend/`: UI implementation using HTML, CSS, and Vanilla JavaScript.
- `backend/`: REST API and WebSocket server built with Spring Boot.

## ⚙️ Configuration
- **Database**: Backend settings and MongoDB URI are managed in `backend/.env`.
- **API Connection**: The frontend connects to the backend at `http://localhost:8080`.

