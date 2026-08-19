# XYZ AI - System Architecture & Developer Guide

This document explains the technical architecture, design decisions, and internal workflows of the **XYZ AI** School Assistant project.

---

## 1. High-Level Overview

XYZ AI is a full-stack, AI-powered conversational agent designed to serve four primary personas in a school ecosystem: **Students, Parents, Teachers, and Principals**.

The system is built on a modern, decoupled architecture:
- **Frontend**: A React application powered by Vite, featuring a glassmorphic UI, smooth animations (Framer Motion), and built-in Speech-to-Text (STT) and Text-to-Speech (TTS).
- **Backend**: A robust API built with FastAPI (Python) that handles routing, database connections, and orchestrates the AI logic.
- **AI Brain**: Powered by the **Mistral AI** SDK (`mistral-large-latest`), featuring advanced Function Calling (Tool Use) to interact dynamically with the database.
- **Database**: A PostgreSQL relational database (hosted on Neon DB) managed via SQLAlchemy ORM.

---

## 2. Frontend Architecture (React + Vite + Tailwind CSS v4)

The frontend is located in the `/frontend` directory and is responsible for rendering the user interface and handling browser-level interactions.

### Key Technologies:
- **React Router (`react-router-dom`)**: Handles navigation between the secure `Login` screen and the main `ChatInterface`.
- **Tailwind CSS v4**: Provides utility-first styling for the stunning neon/glassmorphism aesthetics.
- **Framer Motion**: Drives the micro-animations (e.g., messages popping in, the pulsing AI avatar, background mesh effects).
- **Web Speech API**: Handles native Speech-to-Text (Microphone input) and Text-to-Speech (AI Voice output).

### Core Components:
- **`Login.jsx`**: A secure mock-authentication portal. Based on the username (e.g., `rahul` vs `principal`), it determines the user's `role` and securely passes this state to the chat.
- **`ChatInterface.jsx`**: The main chat window. It maintains the conversation history in the UI, handles voice interactions, and sends POST requests to the FastAPI backend. It also prepends a hidden system instruction to user prompts so the AI always knows exactly *who* it is talking to.
- **`AIAvatar.jsx`**: A visual, pulsing CSS representation of "Aether AI" that reacts when the AI is speaking.

---

## 3. Backend Architecture (FastAPI + Python)

The backend is located in the `/backend` directory and acts as the secure middleman between the frontend, the PostgreSQL database, and the Mistral AI model.

### Key Technologies:
- **FastAPI**: Provides incredibly fast, async REST API endpoints.
- **SQLAlchemy**: An Object-Relational Mapper (ORM) used to write Python code that dynamically translates into SQL queries for PostgreSQL.
- **Mistral SDK (`mistralai`)**: The official Python client for communicating with Mistral's LLM endpoints.

### Core Modules:
- **`main.py`**: The entry point. It loads environment variables (`.env`), initializes the database (`init_db()`), sets up CORS for the frontend, and exposes the `/chat` POST endpoint.
- **`models/database.py`**: Defines the SQL schemas (Tables) for `User`, `Attendance`, `Grade`, `Timetable`, and `Notification`. It also includes the `init_db()` function which auto-generates these tables on startup and injects **seed data** so the database is never empty during testing.
- **`api/mock_services.py`**: The Data Access Layer. It contains the Python functions that execute real SQL `SELECT` and `UPDATE` queries against the Neon PostgreSQL database.
- **`ai/engine.py`**: The "Brain" of the operation. This is where the Mistral AI tool-calling loop lives.

---

## 4. The AI Tool-Calling Workflow (How it works)

When a user sends a message, a fascinating sequence of events occurs in `engine.py`. Mistral AI isn't just generating text—it is actively executing Python code!

Here is the exact lifecycle of a chat request:

1. **The Request**: The frontend sends the user's message, their `role` (e.g., student), and `language` to the `/chat` endpoint.
2. **System Prompt Generation**: `engine.py` generates a strict System Prompt telling Mistral who it is talking to, what language to speak, and security rules (e.g., "Only principals can send notifications").
3. **First Mistral Call (The Decision)**: The backend sends the conversation history to Mistral, along with a **JSON Schema of Tools** (e.g., `get_grades_tool`, `mark_attendance_tool`). 
4. **Tool Execution**: 
   - Mistral analyzes the user's message. If the user asks *"What did I get in Math?"*, Mistral responds with a JSON command telling the backend to execute `get_grades_tool(student_name="Rahul")`.
   - The Python backend intercepts this JSON, halts the AI response, and executes the SQL query in `mock_services.py`.
5. **Second Mistral Call (The Synthesis)**: The backend appends the SQL query results (e.g., "Math: A-") back into the conversation history as a "Tool Response" and sends it *back* to Mistral.
6. **Final Response**: Mistral reads the raw database data and formulates a natural, friendly response (e.g., *"Great job Rahul! You got an A- in Math!"*) which is sent back to the React frontend.

---

## 5. Database Schema (Neon DB PostgreSQL)

The system automatically manages the following tables:
- **`users`**: Manages identities and roles.
- **`attendance`**: Tracks student attendance percentages and daily status (`present`/`absent`).
- **`grades`**: Tracks academic performance across subjects.
- **`timetables`**: Stores daily schedules for both students and teachers.
- **`notifications`**: Stores school-wide announcements dispatched by the Principal.
- **`escalations`**: A ticketing system for when the AI cannot resolve a user's problem and must escalate to a human.

---

## 6. How it was Built (Project Evolution)

1. **Phase 1 (Setup)**: Initialized the React + Vite frontend and FastAPI backend.
2. **Phase 2 (UI/UX)**: Replaced standard CSS with Tailwind v4 and Framer Motion to create the dark-mode, neon glassmorphism aesthetic. Built the animated AIAvatar.
3. **Phase 3 (AI Integration)**: Integrated the Mistral AI SDK. Built the `engine.py` loop to handle tool-calling.
4. **Phase 4 (Database & Auth)**: Replaced in-memory mock data with a live remote Neon PostgreSQL database using SQLAlchemy. Added React Router to build a secure Login portal, eliminating manual role selection and enforcing secure state-based data fetching.
