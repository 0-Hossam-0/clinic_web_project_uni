from config.db_config import get_db


def serialize_appointment_row(row):
    if row is None:
        return None
    if row.get('date') is not None:
        row['date'] = row['date'].isoformat()
    if row.get('time') is not None:
        time_value = row['time']
        if hasattr(time_value, 'strftime'):
            row['time'] = time_value.strftime('%H:%M:%S')
        else:
            row['time'] = str(time_value)
    return row


def get_appointments():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, name, phone, department, date, time FROM appointments")
    rows = cursor.fetchall()
    cursor.close()
    db.close()
    return [serialize_appointment_row(row) for row in rows]


def add_appointment(appt):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO appointments (name, phone, department, date, time) VALUES (%s, %s, %s, %s, %s)",
        (appt['name'], appt['phone'], appt['department'], appt['date'], appt['time'])
    )
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    db.close()
    return new_id


def update_appointment(appt_id, appt):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "UPDATE appointments SET name=%s, phone=%s, department=%s, date=%s, time=%s WHERE id=%s",
        (appt['name'], appt['phone'], appt['department'], appt['date'], appt['time'], appt_id)
    )
    db.commit()
    cursor.close()
    db.close()


def delete_appointment(appt_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM appointments WHERE id=%s", (appt_id,))
    db.commit()
    cursor.close()
    db.close()


def get_appointments_by_phone(phone):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, name, phone, department, date, time FROM appointments WHERE phone = %s", [phone])
    rows = cursor.fetchall()
    cursor.close()
    db.close()
    return [serialize_appointment_row(row) for row in rows]