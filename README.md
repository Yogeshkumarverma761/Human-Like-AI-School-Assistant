# Aether: Human-Like AI School Assistant 🎓🤖

Welcome to **Aether**, a next-generation school management and assistance platform. Aether unifies the educational ecosystem by providing dedicated, AI-driven portals for **Students**, **Parents**, **Staff**, and **Management**—all powered by a single, monolithic React frontend and a powerful FastAPI backend utilizing the Google Gemini API.

---

## 🌟 Architecture & Portals

Aether has been architected for maximum scalability and ease of deployment.

- **Unified Frontend** (`05. Unified Frontend Repository/frontend`): A single React + Vite application that handles routing, dynamic CSS theming, and role-based access.
- **Unified Backend** (`00. Unified Backend Repository`): A single FastAPI application containing the database models, REST APIs, and the Gemini AI Engine.

### 👥 The Portals

When a user visits the Landing Page, they choose their role. The application dynamically adjusts its UI theme, metrics, and AI persona based on the selection:

1. **Student Portal (Blue/Purple Theme)**
   - Dashboard: Tracks attendance, active subjects, and upcoming classes.
   - AI Chat: A friendly tutor persona that helps with homework and scheduling.
2. **Parent Portal (Amber/Rose Theme)**
   - Dashboard: Tracks child's status, latest grades, and attendance.
   - AI Chat: A support assistant that answers questions about the child's academic performance.
3. **Staff/Teacher Portal (Indigo/Fuchsia Theme)**
   - Dashboard: Tracks active classes, pending assignments to grade, and schedules.
   - AI Chat: A teaching assistant persona that has the secure capability to **mark student attendance** via conversational commands.
4. **Management/Principal Portal (Emerald/Teal Theme)**
   - Dashboard: High-level analytics (Total Students, Active Staff, Avg Attendance).
   - AI Chat: A professional management assistant that has the secure capability to **send school-wide announcements/notifications**.

---

## 🚀 How to Run Locally

### 1. Start the Backend
The backend runs on Python and FastAPI. It defaults to a local SQLite database for easy testing.

```bash
cd "00. Unified Backend Repository"
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
```

Create a `.env` file inside `00. Unified Backend Repository` and add your Gemini API Key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start the server:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### 2. Start the Frontend
The frontend uses Vite and React.

```bash
cd "05. Unified Frontend Repository/frontend"
npm install
npm run dev
```
Open your browser to the local URL (usually `http://localhost:5173`) and enjoy!

---

## 🌐 Production Deployment

Aether is production-ready and configured for easy deployment to **Vercel** and **Render**.

### Backend (Render)
1. Create a "New Web Service" on Render and point it to the `00. Unified Backend Repository` directory.
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**:
   - `GEMINI_API_KEY`: Your API Key
   - `DATABASE_URL`: (Optional) Your PostgreSQL URL. If left blank, it defaults to SQLite.

### Frontend (Vercel)
1. Import the project into Vercel.
2. Set the Root Directory to `05. Unified Frontend Repository/frontend`.
3. The included `vercel.json` ensures that React Router works smoothly without 404 errors.
4. **Environment Variables**:
   - `VITE_API_URL`: Set this to your live Render backend URL (e.g., `https://my-backend.onrender.com`).

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TailwindCSS (v4), Framer Motion, React Router, Axios, Lucide Icons.
- **Backend**: Python, FastAPI, SQLAlchemy, Google Generative AI (Gemini 1.5 Flash), Uvicorn.
