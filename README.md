# 📄 Classroom Spark AI Mentor Assistant

![intel-banner](https://user-images.githubusercontent.com/placeholder/intel-banner.png)

# 🚀 Project Title

> **Classroom Spark AI Mentor Assistant**

---

## 📌 Problem Statement

Develop an AI-driven system that supports educators by analyzing student attentiveness and visualizing engagement trends, thereby enhancing the quality of education through real-time insights and intelligent feedback.

---

## 🎯 Objective

Current education systems lack tools that give teachers visibility into real-time student engagement.
**Classroom Spark AI Mentor Assistant** addresses this gap by using the system's **webcam** and **AI models** to monitor attentiveness and display visual feedback to instructors.

Built under the **Intel Unnati Programme 2025**, this tool ensures:

* **Live engagement tracking** with face detection.
* **Realtime graphs and stats** on student focus.
* **Interactive AI Chat Assistant** to support educators and learners.

---

## 🧠 Team & Approach

### Team Name:

`Hack Riders`

### Team Members:

* Kunal
* Suhani Prasad
* Vaibhav Gupta

### Mentor:

* Mr. Mohit Tiwari

### Our Approach:

* Designed a seamless **React + TypeScript UI** with a modern component-based architecture.
* Used **face-api.js** to perform facial detection and engagement monitoring directly in-browser (no OpenCV used).
* Created a **FastAPI backend** in Python for API services and future scalability.
* Emphasized modularity, responsiveness, and real-time interactions.

---

## 🛠️ Tech Stack

### Frontend:

* **Vite** + **React** + **TypeScript**
* **Tailwind CSS**
* **Shadcn/ui**
* **face-api.js** (for engagement detection)

### Backend:

* **Python 3.10+**
* **FastAPI**
* **Uvicorn** (for ASGI serving)

---

## ✨ Key Features

* ✅ **Engagement Monitoring** using webcam (facial cues via face-api.js)
* ✅ **AI Assistant** to help navigate content or answer queries
* ✅ **Analytics Dashboard** to show focus trends
* ✅ **Component-based Frontend** with responsive UI
* ✅ **FastAPI Backend** with modular REST API setup

---

## 📽️ Demo

*Coming soon or provided upon request.*

---

## 🧪 How to Run the Project Locally

### Prerequisites:

* Node.js (v18+ recommended)
* Python 3.10+
* Git

---

### Step-by-step Setup

#### 1️⃣ Clone the Repository

```bash
git clone <YOUR_GIT_REPO_URL>
cd intel-1
```

#### 2️⃣ Install Frontend Dependencies

```bash
npm install
```

#### 3️⃣ Setup the Python Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Use `source venv/bin/activate` on macOS/Linux
pip install -r requirements.txt
```

---

### 🧑‍💻 Running the Project

#### 🟢 Terminal 1: Start the Backend

```bash
cd backend
venv\Scripts\activate
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

#### 🟢 Terminal 2: Start the Frontend

```bash
npm run dev
```

The frontend will run at: `http://localhost:5173/`
The backend will run at: `http://127.0.0.1:8000/`

---

## 📸 Camera Permissions Required

This project requires **webcam access** to perform real-time engagement detection.
Your facial data is only processed **locally in the browser** and is not stored or sent to any external server.

The **Engagement** page displays your attentiveness data and graphs for a clearer understanding of focus levels.

---

## 📁 Folder Structure (Simplified)

```
intel-1/
├── backend/                 # Python FastAPI backend
├── public/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── AiAssistant.tsx
│   │       ├── EngagementMonitor.tsx
│   │       └── FaceEngagement.tsx
│   ├── hooks/
│   ├── pages/               # Route-level pages (e.g., AiChat, Analytics)
│   ├── services/            # API integrations
│   └── types/
├── App.tsx
├── main.tsx
├── vite.config.ts
```

---

## 🔮 Future Scope

* Exportable analytics reports per student/session.
* Emotion classification model integration.
* Role-based login for teachers and students.
* Live session alerts based on attention dips.
* More detailed Power BI dashboards.

---

## 📚 Credits & Acknowledgments

* Developed as part of **Intel Unnati Programme 2025**
* Thanks to mentor **Mr. Mohit Tiwari**
* Inspired by the goal of enhancing real-time classroom experiences through AI

---

> "Technology is best when it brings people together to learn better."

---

# 🌟 Thank you for checking out our project!
