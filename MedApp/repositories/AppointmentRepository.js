import Appointment from "../models/Appointment.js";

const getAllAppointment = async () => {
    return await Appointment.find();
}

const getAppointment = async (id) => {
    try {
        return await Appointment.findById(id);
    } catch (error) {
        throw new Error(error);
    }
}

const saveAppointment = async ({date, doctor, pacientId}) => {  
    try {
       
        const existingAppointment = await Appointment.findOne({
            doctor, 
            pacientId,
            date
        });

        if (existingAppointment) {
            throw new Error('Appointments already exist for the doctor and patient on this date.');
        }

        const appointment = new Appointment({
            date,
            doctor,  
            pacientId
        });

        return await appointment.save();
    } catch (error) {
        throw new Error(error);
    }
}

const updateAppointment = async (id, {date, doctorId, pacientId}) => {
    try {
        return await Appointment.findByIdAndUpdate(id, {date, doctorId, pacientId}, {new: true});
    } catch (error) {
        throw new Error(error);
    }
}

const deleteAppointment = async (id) => {
    try {
        return await Appointment.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(error);        
    }
}

const appointmentRepository = {
    getAllAppointment,
    getAppointment,
    saveAppointment,
    updateAppointment,
    deleteAppointment
}

export default appointmentRepository;
