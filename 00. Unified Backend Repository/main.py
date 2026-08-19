import os
from dotenv import load_dotenv
load_dotenv()

import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from api.mock_services import escalate_to_human, get_attendance, mark_attendance
from ai.engine import process_chat
from models.database import init_db, SessionLocal, Grade, Attendance, Timetable

app = FastAPI(title="XYZ AI Backend")

@app.on_event("startup")
def on_startup():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    role: str
    language: str = "en"
    session_id: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "XYZ AI is running"}

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        response_text = await process_chat(req.message, req.role, req.language, req.session_id)
        return {"response": response_text}
    except Exception as e:
        print(f"Error in chat_endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/student/{student_name}/grades")
def get_student_grades(student_name: str):
    db = SessionLocal()
    try:
        records = db.query(Grade).filter(Grade.student_name.ilike(f"%{student_name}%")).all()
        return [{"subject": r.subject, "score": r.score} for r in records]
    finally:
        db.close()

@app.get("/api/student/{student_name}/attendance")
def get_student_attendance(student_name: str):
    db = SessionLocal()
    try:
        record = db.query(Attendance).filter(Attendance.student_name.ilike(f"%{student_name}%")).first()
        if record:
            return {"percentage": record.percentage, "status_today": record.status_today}
        return {"percentage": 0, "status_today": "Unknown"}
    finally:
        db.close()

@app.get("/api/timetable/student/{day}")
def get_student_timetable(day: str):
    db = SessionLocal()
    try:
        record = db.query(Timetable).filter(Timetable.role == "student", Timetable.day.ilike(f"%{day}%")).first()
        if record:
            return {"day": record.day, "schedule": record.schedule_details}
        return {"day": day, "schedule": "No schedule"}
    finally:
        db.close()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
