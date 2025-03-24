import Prescription from "../models/Prescription.js";
import PrescriptionRepository from "../repositories/PrescriptionRepository.js";
import mongoose from 'mongoose';

const getAllPrescriptions = async () => {
    try {
        const prescriptions = await Prescription.find({});
        return prescriptions;
    } catch (error) {
        throw new Error('Error fetching all prescriptions');
    }
};

const getPrescription = async (id) => {
    
    try {
        const prescription = await Prescription.findById(id);
        return prescription;
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
            instructions
        });
        return await newPrescription.save();
    } catch (error) {
        console.log("Error saving the prescription:", error);
        throw new Error("Error saving the prescription");
    }
}

const updatePrescription = async (id, { date, appointmentId, medicine, dosage, instructions, file}) => {
    try {
        const updatedPrescription = await Prescription.findByIdAndUpdate(
            id,
            { date, appointmentId, medicine, dosage, instructions, file},
            { new: true, runValidators: true }
        );

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