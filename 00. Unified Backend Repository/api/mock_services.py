from models.database import SessionLocal, Attendance, Escalation, Grade, Timetable, Notification

def get_attendance(student_name: str, role: str) -> str:
    """Fetch attendance from DB."""
    if role.lower() not in ["student", "parent", "teacher", "principal", "system"]:
        return "Unauthorized: Invalid role."

    db = SessionLocal()
    try:
        record = db.query(Attendance).filter(Attendance.student_name.ilike(f"%{student_name}%")).first()
        if record:
            return f"{record.student_name}'s attendance is {record.percentage}%. Status today: {record.status_today}."
        else:
            return f"Could not find attendance records for {student_name}."
    finally:
        db.close()

def mark_attendance(student_name: str, status: str, role: str) -> str:
    """Mark attendance in DB."""
    if role.lower() not in ["teacher", "principal"]:
        return "Unauthorized: Only teachers and principals can mark attendance."
        
    db = SessionLocal()
    try:
        record = db.query(Attendance).filter(Attendance.student_name.ilike(f"%{student_name}%")).first()
        if record:
            record.status_today = status
            db.commit()
            return f"Successfully marked {record.student_name} as {status}."
        else:
            return f"Could not find student {student_name} to mark attendance."
    except Exception as e:
        db.rollback()
        return f"Error updating attendance: {e}"
    finally:
        db.close()

def escalate_to_human(role: str, reason: str) -> str:
    """Record an escalation in the DB."""
    db = SessionLocal()
    try:
        new_escalation = Escalation(role=role, reason=reason)
        db.add(new_escalation)
        db.commit()
        return f"Escalation ticket created successfully for reason: {reason}. A human agent will take over shortly."
    except Exception as e:
        db.rollback()
        return f"Error creating escalation ticket: {e}"
    finally:
        db.close()

def get_grades(student_name: str, role: str) -> str:
    """Fetch student grades."""
    db = SessionLocal()
    try:
        records = db.query(Grade).filter(Grade.student_name.ilike(f"%{student_name}%")).all()
        if records:
            grades = ", ".join([f"{r.subject}: {r.score}" for r in records])
            return f"Grades for {student_name} - {grades}"
        return f"No grades found for {student_name}."
    finally:
        db.close()

def get_timetable(role: str, day: str) -> str:
    """Fetch timetable based on role and day."""
    db = SessionLocal()
    try:
        record = db.query(Timetable).filter(Timetable.role == role.lower(), Timetable.day.ilike(f"%{day}%")).first()
        if record:
            return f"{day} Schedule for {role}: {record.schedule_details}"
        return f"No schedule found for {role} on {day}."
    finally:
        db.close()

def send_notification(audience: str, message: str, role: str) -> str:
    """Send a school-wide notification (Principal only)."""
    if role.lower() != "principal":
        return "Unauthorized: Only principals can send school-wide notifications."
    
    db = SessionLocal()
    try:
        new_notif = Notification(audience=audience, message=message)
        db.add(new_notif)
        db.commit()
        return f"Notification successfully sent to {audience}: {message}"
    except Exception as e:
        db.rollback()
        return f"Error sending notification: {e}"
    finally:
        db.close()

