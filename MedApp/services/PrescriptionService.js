import doctor from "../models/Doctor.js";
import Prescription from "../models/Prescription.js";
import PrescriptionRepository from "../repositories/PrescriptionRepository.js";
import AppointmentService from "../services/AppointmentService.js";
import PacientService from "../services/PacientService.js";
import DoctorService from "../services/DoctorService.js";
import PDFdocument from "pdfkit";
import fs from 'fs';
import mongoose from 'mongoose';

const getAllPrescriptions = async () => {
    try {
        return await PrescriptionRepository.getAllPrescriptions(); 
    } catch (error) {
        throw new Error('Error fetching all prescriptions');
    }
};

const getPrescription = async (id) => {
    try {
    
        const prescription = await PrescriptionRepository.getPrescription(id);

        if (!prescription) {
            throw new Error("Prescription not found");
        }
        return prescription;
        
    } catch (error) {
        throw new Error('Error fetching the prescription: ' + error.message);
    }
};

const savePrescription = async ({ date, appointmentId, medicine, dosage, instructions }) => {

    if (!date || !appointmentId || !medicine || !dosage) {
        return { success: false, message: 'All fields (date, appointmentId, medicine, dosage) are required.' };
    }

    try {
        const newPrescription = new Prescription({
            date,
            appointmentId,
            medicine,
            dosage,
            instructions,
        });

        await newPrescription.save();
        return { success: true, prescription: newPrescription };

    } catch (error) {
        return { success: false, message: 'Error saving the prescription', error };
    }
};

const updatePrescription = async (id, { date, appointmentId, medicine, dosage, instructions, file }) => {
    try {
        if (!date || !appointmentId || !medicine || !dosage) {
            return { success: false, message: 'All fields (date, appointmentId, medicine, dosage) are required.' };
        }

        const updatedPrescription = await Prescription.findByIdAndUpdate(
            id, 
            { date, appointmentId, medicine, dosage, instructions, file}, 
            { new: true, runValidators: true }
        );

        if (!updatedPrescription) {
            return { success: false, message: "Prescription not found" };
        }
        return { success: true, message: "Prescription updated successfully", prescription: updatedPrescription };
    
    } catch (error) {
        return { success: false, message: "Error updating the prescription", error: error.message };
    }
};

const deletePrescription = async (id) => {
    try {
        const deletedPrescription = await Prescription.findByIdAndDelete(id);

        if (!deletedPrescription) {
            return { success: false, message: "Prescription not found to delete" };
        }

        return { success: true, message: "Prescription deleted successfully" };
    } catch (error) {
        return { success: false, message: "Error deleting the prescription", error: error.message };
    }
};

const generatePrescriptionFile = async (prescription) => {
    const appointment = await AppointmentService.getAppointment(prescription.appointmentId);
    const pacient = await PacientService.getPacient(appointment.pacientID);
    const doctor = await DoctorService.getDoctor(appointment.doctor);
    
    const id = prescription._id;
    const document = new PDFdocument({font: 'Courier'});
    const filePath = "C:/Users/igorr/OneDrive/Desktop/Aula pdf Facul/Programação II/MediApp" + id + ".pdf";

    document.pipe(fs.createWriteStream(filePath));
    document.fontSize(14).text("Pacient Name: " + pacient.name);
    document.fontSize(14).text("Doctor Name: " + doctor.name);

    const recipe = "Medicine: " + prescription.medicine;
    document.fontSize(14).text(recipe);

    document.fontSize(14).text("Dose: " + prescription.dosage);
    document.fontSize(14).text("Instructions: " + prescription.instructions);

    document.end();

    return prescription;

}

const prescriptionService = {
    getAllPrescriptions,
    getPrescription,
    savePrescription,
    updatePrescription,
    deletePrescription,
    generatePrescriptionFile
};

export default prescriptionService;