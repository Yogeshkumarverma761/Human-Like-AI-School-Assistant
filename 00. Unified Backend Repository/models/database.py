from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker
import os

# Load DATABASE_URL securely from env, fallback to sqlite for local testing
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./school.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    role = Column(String)

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String, index=True)
    percentage = Column(Float)
    status_today = Column(String)

class Escalation(Base):
    __tablename__ = "escalations"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String)
    reason = Column(String)

class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String, index=True)
    subject = Column(String)
    score = Column(String)

class Timetable(Base):
    __tablename__ = "timetables"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, index=True)
    day = Column(String)
    schedule_details = Column(String)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    audience = Column(String)
    message = Column(String)

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Inject Seed Data if database is empty
    db = SessionLocal()
    try:
        if db.query(Attendance).count() == 0:
            seed_attendance = [
                Attendance(student_name="Rahul", percentage=85.0, status_today="present"),
                Attendance(student_name="Priya", percentage=92.5, status_today="present"),
                Attendance(student_name="Amit", percentage=76.0, status_today="absent")
            ]
            db.add_all(seed_attendance)
            
            seed_grades = [
                Grade(student_name="Rahul", subject="Math", score="A-"),
                Grade(student_name="Rahul", subject="Science", score="B+"),
                Grade(student_name="Priya", subject="Math", score="A+"),
            ]
            db.add_all(seed_grades)

            seed_timetable = [
                Timetable(role="student", day="Monday", schedule_details="9 AM: Math, 11 AM: Science"),
                Timetable(role="teacher", day="Monday", schedule_details="9 AM: Teach Math, 1 PM: Staff Meeting"),
            ]
            db.add_all(seed_timetable)

            seed_notifications = [
                Notification(audience="all", message="School will be closed tomorrow due to heavy rain."),
            ]
            db.add_all(seed_notifications)

            db.commit()
    except Exception as e:
        print(f"Error seeding DB: {e}")
        db.rollback()
    finally:
        db.close()
