import AppointmentRepository from "../repositories/AppointmentRepository.js";

const getAllAppointment = async () => {
    const appointments = await AppointmentRepository.getAllAppointment();
    
    if (!appointments || appointments.length === 0) {
        const error = new Error("No appointments found");
        error.status = 404;
        throw error;
    }

    return appointments;
};

const getAppointment = async (id) => {
    const appointment = await AppointmentRepository.getAppointment(id);

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.status = 404;
        throw error;
    }

    return appointment;
};

const saveAppointment = async ({ date, doctor, pacientId }) => {
    if (!date || !doctor || !pacientId) {
        const error = new Error("Missing required fields: date, doctor, pacientId");
        error.status = 400;
        throw error;
    }

    return AppointmentRepository.saveAppointment({ date, doctor, pacientId });
};

const updateAppointment = async (id, { date, doctorId, pacientId }) => {
    const appointment = await AppointmentRepository.getAppointment(id);

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.status = 404;
        throw error;
    }

    return AppointmentRepository.updateAppointment(id, { date, doctorId, pacientId });
};

const deleteAppointment = async (id) => {
    const appointment = await AppointmentRepository.getAppointment(id);

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.status = 404;
        throw error;
    }

    await AppointmentRepository.deleteAppointment(id);
    return { message: "Appointment deleted successfully" };
};

const appointmentService = {
    getAllAppointment,
    getAppointment,
    saveAppointment,
    updateAppointment,
    deleteAppointment,
};

export default appointmentService;

