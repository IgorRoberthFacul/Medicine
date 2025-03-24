import doctorRepository from "../repositories/DoctorRepository.js";
import Doctor from "../models/Doctor.js";
import mongoose from 'mongoose';

const getAllDoctors = async () =>{
    return await doctorRepository.getAllDoctors();
}

const getDoctor = async (id) => {
    await doctorRepository.getDoctor();
    return Doctor;
}

const saveDoctor = async ({name, login, password, medicalSpecialty, medicalRegistration, email, phone}) => {
    try {
        const doctor = new Doctor({
           name,login,password,medicalSpecialty,medicalRegistration,email,phone
        });
        await doctor.save();
        return doctor;
    } catch (error) {
        throw new Error(error);
    }
};

const updateDoctor = async (id,date) => {
    return await Doctor.findByIdAndUpdate(id, date, {new: true});
}

export const deleteDoctor = async (id) => {
    try {
        const doctor = await Doctor.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id)});
        return doctor;
    } catch (error) {
        throw new Error("Error excluding Doctor: " + error.message);
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