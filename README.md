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

To inspect all registered users directly in your browser:
Visit **`http://localhost:8080/api/auth/users`**.

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

## Shared Cloud Database (Clever Cloud MySQL)

All collaborators share the same synchronized cloud database. No local MySQL installation is needed.

### Connecting via MySQL Workbench / DBeaver / DataGrip:
- **Host**: `bfqi1o7y16bhcle8bt1n-mysql.services.clever-cloud.com`
- **Port**: `3306`
- **Database / Schema**: `bfqi1o7y16bhcle8bt1n`
- **Username**: `ug0vaiox7yegqoc9`
- **Password**: `nwVcQivhd9fes4CczWzR`

> [!TIP]
> **Connection Limit Notice:**
> Clever Cloud free tier allows a maximum of 5 concurrent connections. Spring Boot is tuned with a small HikariCP pool (`maximum-pool-size=2`). Please close GUI tools like MySQL Workbench when not actively inspecting tables to keep connection slots open for teammates.

---

## Project Structure

```
SkyFlow-AMS-react/
├── client/          # React 19 frontend (Vite, Tailwind CSS, React Router)
├── Server/          # Spring Boot 3 REST API (Java 21, JPA, Clever Cloud MySQL)
├── Admin/           # Admin console components
└── README.md
```
