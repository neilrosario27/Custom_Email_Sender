# Email Sender App

This is a full-stack email-sending application that allows users to upload a CSV file, personalize email content, schedule emails, and track the status of email deliveries. It uses **Flask** for the backend and **React.js (Vite)** for the frontend.

---

## Features

- User Authentication (Supabase)
- CSV file upload and processing
- Dynamic email personalization
- Email scheduling within a 3-day limit
- Real-time email tracking (status updates)
- OpenAI API integration for email content generation

---

## Prerequisites

- **Python** (>= 3.8)
- **Node.js** (>= 16.x)
- **npm**
- **Mailgun Account** (for email delivery)
- **Supabase Account** (for database and authentication)
- **OpenAI API Key** (for email content generation)

---

## Steps to Run the App

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/email-sender-app.git
cd email-sender-app
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

#### Backend will run at

```bash
http://127.0.0.1:5000
```

### 3. Frontend Setup

```bash
cd frontend/email-sender
npm install
npm run dev
```

#### Frontend will run at

```bash
http://localhost:5173/
```

## .env Setup

### Backend

```bash
cd backend
touch .env
```

#### Add the following keys to .env:

```bash
MAILGUN_DOMAIN=
MAILGUN_API_KEY=
MAILGUN_API_URL=
SUPABASE_URL=
SUPABASE_KEY=
OPENAI_API_KEY=
```

### Frontend

```bash
cd frontend\email-sender
touch .env
```

#### Add the following keys to .env

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
```

## Directory Structure

```bash
backend/
    app.py
    requirements.txt
    .env
frontend/
    email-sender/
        src/
        components/
        services/
        .env
        App.jsx
        package.json
```
