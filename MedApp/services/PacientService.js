import PacientRepository from "../repositories/PacientRepository.js";
import Pacient from "../models/Pacient.js";

const getAllPacient = async () => {
    return await Pacient.find();
}

const getPacient = async (id) => {
    const pacientData = await PacientRepository.getPacient(id);
    return pacientData;
}

const savePacient = async ({ name, birthDate, email, phone }) => {
    try {
        const newPacient = new Pacient({ name, birthDate, email, phone });
        return await newPacient.save();
    } catch (error) {
        throw new Error(error);
    }
};

const updatePacient = async (id, { name, birthDate, email, phone }) => {
    return await PacientRepository.updatePacient(id, { name, birthDate, email, phone });
}

const deletePacient = async (id) => {
    return await PacientRepository.deletePacient(id);
}

const pacientService = {
    getAllPacient,
    getPacient,
    savePacient,
    updatePacient,
    deletePacient
}

export default pacientService;
