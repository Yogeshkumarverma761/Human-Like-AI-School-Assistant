# XYZ AI - Human-Like School Assistant

XYZ AI is a standalone Applied AI solution built for a School ERP Ecosystem. It interacts with Students, Parents, Teachers, and Principals via text and voice, adapting its persona based on the user's role.

## Features
- **Role-Based Personas**: AI adapts behavior for Student, Parent, Teacher, and Principal.
- **Voice Interactions**: Speech-to-Text and Text-to-Speech support via Web Speech API.
- **AI Avatar**: Dynamic UI Avatar that visually responds when the AI is speaking.
- **Multilingual Support**: Supports English, Hindi, Tamil, Telugu, and Marathi.
- **Secure Function Calling**: Role-based access control enforced before LLM executes tools (e.g., retrieving attendance or escalating to human staff).

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (SQLAlchemy models included)
- **AI Engine**: Google Gemini API (gemini-1.5-flash)

## Running the Application

### 1. Prerequisites
- Node.js (v18+)
- Python (3.9+)
- A Gemini API Key from Google AI Studio.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set your API Key:
   ```bash
   # On Windows (PowerShell):
   $env:GEMINI_API_KEY="your_api_key_here"
   # On Mac/Linux:
   export GEMINI_API_KEY="your_api_key_here"
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Demo Instructions
1. Open the React app in your browser (usually `http://localhost:5173`).
2. Select your **Role** and **Language** from the Settings panel.
3. Try typing a message or clicking the microphone icon to speak.
4. Try asking "What is my attendance?" as a Student.
5. Try asking "Mark Rahul absent" as a Student (should be denied) and then as a Teacher (should be approved).
6. Tell the AI "I want to talk to a human" to trigger the escalation function.
