import Prescription from "../models/Prescription.js";
import PrescriptionRepository from "../repositories/PrescriptionRepository.js";
import mongoose from 'mongoose';

const getAllPrescriptions = async () => {
    try {
        return await PrescriptionRepository.getAllPrescriptions();  // Agora utilizando o método correto do repositório
    } catch (error) {
        throw new Error('Error fetching all prescriptions');
    }
};

const getPrescription = async (id) => {
    try {
        return await PrescriptionRepository.getPrescription(id);  // Certifique-se de usar o método correto do repositório
    } catch (error) {
        throw new Error('Error fetching the prescription');
    }
};

const savePrescription = async ({ date, appointmentId, medicine, dosage, instructions }) => {
    try {
        const newPrescription = new Prescription({
            date,
            appointmentId,
            medicine,
            dosage,
            instructions,
        });
        await newPrescription.save();
        return newPrescription;
    } catch (error) {
        throw new Error('Error saving the prescription');
    }
};

const updatePrescription = async (id, { date, appointmentId, medicine, dosage, instructions }) => {
    try {
        const updatedPrescription = await Prescription.findByIdAndUpdate(
            id, 
            { date, appointmentId, medicine, dosage, instructions }, 
            { new: true, runValidators: true }
        );

        if (!updatedPrescription) {
            throw new Error("Prescription not found");
        }

        return updatedPrescription;
    } catch (error) {
        throw new Error("Error updating the prescription: " + error.message);
    }
};


const deletePrescription = async (id) => {
    try {
        const deletedPrescription = await Prescription.findByIdAndDelete(id);
        return deletedPrescription;
    } catch (error) {
        throw new Error('Error deleting the prescription');
    }
};

const prescriptionService = {
    getAllPrescriptions,
    getPrescription,
    savePrescription,
    updatePrescription,
    deletePrescription,
};

export default prescriptionService;