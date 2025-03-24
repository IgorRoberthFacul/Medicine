import doctorRepository from "../repositories/DoctorRepository.js";
import Doctor from "../models/Doctor.js";
import mongoose from 'mongoose';

const medicalRegistrationRegex = /^[A-Za-z0-9]+$/;
const phoneRegex = /^(?:\d{2})\s9\d{4}-\d{4}$/;

const getAllDoctors = async () => {
    const doctors = await doctorRepository.getAllDoctors();
    if (!doctors || doctors.length === 0) {
        throw { status: 404, message: "No doctors found" };
    }
    return doctors;
};

const getDoctor = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw { status: 400, message: "Invalid ID" }; 
    }

    const doctor = await doctorRepository.getDoctor(id);
    if (!doctor) {
        throw { status: 404, message: "Doctor not found" }; 
    }

    return doctor;
};

const saveDoctor = async ({ name, login, password, medicalSpecialty, medicalRegistration, email, phone }) => {
    try {
        const doctor = new Doctor({
            name, login, password, medicalSpecialty, medicalRegistration, email, phone
        });
        await doctor.save();
        return doctor;
    } catch (error) {
        throw { status: 500, message: "Failed to save doctor: " + error.message };
    }
};

const updateDoctor = async (id, data) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return { status: 400, message: "Invalid ID" };
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(id, data, {
            new: true,  
            runValidators: true, 
        });

        if (!updatedDoctor) {
            return { status: 404, message: "Doctor not found" };
        }

        return { status: 200, message: "Doctor successfully updated", doctor: updatedDoctor };
    } catch (error) {
        console.error(error);
        return { status: error.status || 500, message: error.message || "Error updating doctor" };
    }
};

export const deleteDoctor = async (id) => {
    try {
        const doctor = await Doctor.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });

        if (!doctor) {
            return { status: 404, message: "Doctor not found" };
        }

        return { status: 200, message: "Doctor successfully excluded" };
    } catch (error) {
        throw new Error("Error excluding Doctor: ", error.message);
    }
};

const getDoctorByLogin = async (login) => {
    return await doctorRepository.getDoctorByLogin(login);
}

const doctorService = {

    getAllDoctors,
    getDoctor,
    saveDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorByLogin
    
}

export default doctorService;