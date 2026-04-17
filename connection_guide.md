# SkillX Connection & Running Guide

This guide explains how to manage your server connections and run the project at any time.

## 🔗 How to Set Connection

### 1. MongoDB Database (Backend)
The backend connects to your MongoDB Atlas database using the `.env` file.
- **File**: `backend/.env`
- **What to change**: Update the `MONGO_URI` value with your connection string.
- **Example**:
  ```env
  MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/skillx_db
  ```

### 2. API & WebSocket URL (Frontend)
The frontend now uses a central configuration file. You only need to change it once here.
- **File**: `frontend/config.js`
- **What to change**: Update `API_BASE_URL` or `WS_URL` if your backend port or server address changes.
- **Example**:
  ```javascript
  const CONFIG = {
      API_BASE_URL: "http://localhost:8080/api",
      WS_URL: "http://localhost:8080/ws"
  };
  ```

---

## 🚀 Commands to Run (at any time)

### Method A: One-Click (Recommended)
You can run both the backend and frontend simultaneously by double-clicking:
👉 **`run_skillx.bat`** (located in the root directory).

### Method B: Manual (PowerShell)
Run these commands from the **root** folder of the project:

**Run Backend**:
```powershell
.\backend\apache-maven-3.9.6\bin\mvn.cmd -f backend/pom.xml spring-boot:run
```

**Run Frontend**:
```powershell
npx serve frontend
```
*(Once running, visit `http://localhost:3000` in your browser)*

---

## 🛠 Project Health Check
- **Java version**: 23 (Verified)
- **Database**: MongoDB (Configured in `.env`)
- **Backend Port**: 8080 (Default)
- **Frontend Port**: 3000 (When using `npx serve`)
