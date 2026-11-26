# SkyFlow - Airline Management System (AMS)

A full-stack airline management and booking platform built with **React** and **Spring Boot**.

---

## Prerequisites

Before running the project on your machine, ensure you have installed:
1. **Node.js** (v18 or higher)
2. **Java 21 LTS**
3. **MySQL Server** (running on default port `3306`)

---

## Quick Start Guide

### 1. Backend Setup (Spring Boot & MySQL)

1. Make sure your local MySQL service is running.
2. **Database Password**:
   The default MySQL password in `application.properties` is `root`.
   - If your local MySQL password is `root`, you don't need to do anything!
   - If your password is different, create `Server/src/main/resources/application-local.properties` with:
     ```properties
     spring.datasource.password=YOUR_LOCAL_PASSWORD
     ```
     *(This file is ignored by Git, so your password stays private and will never cause git conflicts).*
3. Start the Spring Boot server:
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
   The backend will start at **`http://localhost:8080`** and automatically create the `skyflow_db` database and its tables (`users` and `google_users`).

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
├── client/          # React 19 frontend (Vite, Tailwind, React Router)
├── Server/          # Spring Boot 3 REST API (Java 21, JPA, MySQL)
├── Admin/           # Admin console components
└── README.md
```
