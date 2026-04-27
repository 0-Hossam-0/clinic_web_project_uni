from flask import Blueprint, request, jsonify
from repository.appointment_repository import (
    get_appointments,
    add_appointment,
    update_appointment,
    delete_appointment,
    get_appointments_by_phone
)

appointment_bp = Blueprint('appointment', __name__)

@appointment_bp.route('/appointments', methods=['GET'])
def get_appointments_route():
    rows = get_appointments()
    return jsonify(rows)

@appointment_bp.route('/appointments/phone/<phone>', methods=['GET'])
def get_appointments_by_phone_route(phone):
    rows = get_appointments_by_phone(phone)
    return jsonify(rows)

@appointment_bp.route('/appointments', methods=['POST'])
def add_appointment_route():
    appt = request.json
    new_id = add_appointment(appt)
    return jsonify({'ok': True, 'id': new_id})

@appointment_bp.route('/appointments/<int:appt_id>', methods=['PUT'])
def update_appointment_route(appt_id):
    appt = request.json
    update_appointment(appt_id, appt)
    return jsonify({'ok': True})

@appointment_bp.route('/appointments/<int:appt_id>', methods=['DELETE'])
def delete_appointment_route(appt_id):
    delete_appointment(appt_id)
    return jsonify({'ok': True})