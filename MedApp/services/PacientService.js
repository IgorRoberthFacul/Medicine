import Pacient from "../models/Pacient.js";
import pacientRepository from "../repositories/PacientRepository.js";
import PacientRepository from "../repositories/PacientRepository.js";
import mongoose from 'mongoose';

const getAllPacient = async () => {
    
    const pacient = await PacientRepository.getAllPacient();
    if (!pacient || pacient.length === 0) {
        throw { status: 404, message: "No pacient found" };
    }
    return await pacient;
}

const getPacient = async (id) => {

     if (!mongoose.Types.ObjectId.isValid(id)) {
            throw { status: 400, message: "Invalid ID" }; 
        }

    const pacientData = await PacientRepository.getPacient(id);
    if(!pacientData){
        throw { status: 404, message: "Pacient not found" }; 
    }
    return pacientData;
};

const savePacient = async ({ name, birthDate, email, phone }) => {
    try {
        if (!name || !birthDate || !email || !phone) {
            throw new Error("All fields are mandatory");
        }
        const newPacient = new Pacient({ name, birthDate, email, phone });
        return await newPacient.save();
    } catch (error) {
        throw new Error(error.message); 
    }
};

const updatePacient = async (id, { name, birthDate, email, phone }) => {

    const updatedPacient = await Pacient.findByIdAndUpdate(id, { name, birthDate, email, phone });
    if (!updatedPacient) {
        return res.status(404).json({ message: "Patient not found" });
    }
    return await PacientRepository.updatePacient(id, { name, birthDate, email, phone });
}

const deletePacient = async (id) => {
   
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, message: "Invalid ID" };
    }

    const pacient = await pacientRepository.deletePacient(id);

    if (!pacient) {
        return { success: false, message: "Patient not found" };
    }
    return { success: true, message: 'Patient successfully excluded.', pacient };
};

const pacientService = {
    getAllPacient,
    getPacient,
    savePacient,
    updatePacient,
    deletePacient
}

export default pacientService;
