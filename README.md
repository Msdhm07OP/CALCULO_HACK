# Calcula Mental Health Platform

A comprehensive, enterprise-grade mental health and wellness platform designed for educational institutions. Calcula connects students, counselors, and administrators in a secure, multi-tenant environment to foster mental well-being on campus.

## 🚀 Overview

Calcula is a full-stack web application built with a modern technology stack, ensuring scalability, security, and a premium user experience.

-   **Frontend**: React-based responsive UI with real-time features.
-   **Backend**: Node.js/Express server with Supabase integration.
-   **Architecture**: Multi-tenant system supporting multiple colleges with strict data isolation.

## 🌟 Key Features

### For Students
-   **Mental Health Assessments**: Standardized tests (PHQ-9, GAD-7, GHQ-12) to track well-being.
-   **Wellness Tools**: Interactive journaling with AI insights, Pomodoro timers, and Eisenhower Matrix for stress management.
-   **Secure Messaging**: Real-time chat with counselors and anonymous community support groups.
-   **Video Counselling**: Integrated video calls (Jitsi/calcula-room) for remote sessions.
-   **Resource Library**: Access to curated mental health articles, videos, and guides.

### For Counselors
-   **Dashboard**: Manage appointments, view student requests, and track session history.
-   **Student Insights**: View assessment scores and progress (with privacy controls).
-   **Resource Management**: Upload and share educational materials.

### For Administrators
-   **User Management**: Onboard students and counselors.
-   **Analytics**: View aggregated anonymous data on campus mental health trends.
-   **Community Management**: Create and moderate support communities.

## 🛠️ Technology Stack

### Frontend (`Calcula-Frontend-main`)
-   **Framework**: React 18 + Vite
-   **UI Library**: shadcn/ui + Tailwind CSS
-   **State Management**: React Context API
-   **Real-time**: Socket.IO Client
-   **Languages**: Multi-language support (English, Hindi, Spanish, etc.)

### Backend (`Calcula-Backend-main`)
-   **Runtime**: Node.js 18+
-   **Framework**: Express.js
-   **Database**: Supabase (PostgreSQL)
-   **Authentication**: HTTP-only Cookie-based JWT
-   **Real-time**: Socket.IO Server
-   **Security**: Helmet, Rate Limiting, CORS, Joi Validation

## 📂 Project Structure

```
Calcula/
├── Calcula-Backend-main/    # Server-side application
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── services/
│   └── README.md            # Backend-specific documentation
│
└── Calcula-Frontend-main/   # Client-side application
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── context/
    │   │   └── data/
    │   └── README.md        # Frontend-specific documentation
```

## 🚀 Quick Start

### 1. Backend Setup
Navigate to the backend directory and install dependencies:

```bash
cd Calcula-Backend-main
npm install
```

Configure your `.env` file (see backend README) and start the server:

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup
Navigate to the frontend directory:

```bash
cd Calcula-Frontend-main/frontend
npm install
```

Start the development server:

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

## 🧪 Testing

The platform comes with a suite of testing tools and Postman collections located in `Calcula-Backend-main/postman/`.
See `Calcula-Backend-main/README.md` for detailed API documentation and testing credentials.

---

**Built with ❤️ for Calcula 2024**
