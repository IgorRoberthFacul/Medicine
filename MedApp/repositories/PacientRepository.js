import Pacient from "../models/Pacient.js";
import mongoose from "mongoose";

const getAllPacient = async () => {
    return await Pacient.find();
}

const getPacient = async (id) => {
    return await Pacient.findById(id);
}

const savePacient = async ({ name, birthDate, email, phone }) => {
    const newPacient = new Pacient({ name, birthDate, email, phone });
    return await newPacient.save();
}

const updatePacient = async (id, data) => {
    return await Pacient.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

const deletePacient = async (id) => {
    return await Pacient.findByIdAndDelete(id);
}

const pacientRepository = {
    getAllPacient,
    getPacient,
    savePacient,
    updatePacient,
    deletePacient
}

export default pacientRepository;
