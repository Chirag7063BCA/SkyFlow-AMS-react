# SkyFlow - Airline Management System (AMS)

A full-stack airline management and booking platform built with **React** and **Spring Boot**.

---

## Prerequisites

Before running the project on your machine, ensure you have installed:
1. **Node.js** (v18 or higher)
2. **Java 21 LTS**

*(Note: MySQL is hosted on the cloud via **Clever Cloud**, so you and your team do **NOT** need to install or run MySQL locally!)*

---

## Quick Start Guide

### 1. Backend Setup (Spring Boot)

The backend is pre-configured to connect to the unified, live Clever Cloud MySQL database.

Start the Spring Boot server:
- **Windows PowerShell**:
  ```powershell
  cd Server
  .\mvnw.cmd spring-boot:run
  ```
- **macOS / Linux**:
  ```bash
  cd Server
  ./mvnw spring-boot:run
  ```

The backend will start at **`http://localhost:8080`** and automatically sync with the shared database tables (`users` and `google_users`).

---

### 2. Frontend Setup (React + Vite)

Open a second terminal window:
```powershell
cd client
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## Project Structure

```
SkyFlow-AMS-react/
├── client/          # React 19 frontend (Vite, Tailwind CSS, React Router)
├── Server/          # Spring Boot 3 REST API (Java 21, JPA, Clever Cloud MySQL)
├── Admin/           # Admin console components
└── README.md
```
