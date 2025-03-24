import express from "express";
import Doctor from "../models/Doctor.js";

const getAllDoctors = async() =>{
    try {
        const doctors = await Doctor.find({});
        return doctors;
    } catch (error) {
        console.error("Error when looking for doctors at the bank: ", error);
    }
};

const getDoctor = async (id) => {
    try {
        const doctor = await Doctor.findById(id);
        return doctor;
    } catch (error) {
        throw new Error(error);
    }
};

const saveDoctor = async({name, login, password, medicalSpecialty, medicalRegistration, email, phone}) => {
    
    try {
        const doctor = new Doctor({
            doctorId, name, login, password, medicalSpecialty, medicalRegistration, email, phone
        });
        return await doctor.save();
    } catch (error) {
        throw new Error(error);
    }
};

const updateDoctor = async (id, updateData) => {
    try {
        return Doctor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } catch (error) {
        throw new Error(error);
    }
}

const deleteDoctor = async (id) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(id);
        return doctor;
    } catch (error) {
        throw new Error(error);
    }
}

const getDoctorByLogin = async (login) => {

    try {
        return await Doctor.findOne({"login":login});
    } catch (error) {
        throw new Error(error);
    }
}

const doctorRepository = {

    getAllDoctors,
    getDoctor,
    saveDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorByLogin
}

export default doctorRepository;