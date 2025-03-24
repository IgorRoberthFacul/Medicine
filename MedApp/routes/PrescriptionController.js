import express from "express";
import PrescriptionService from "../services/PrescriptionService.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/prescriptions', verifyToken, async (req, res) => {
    try {
        const prescriptions = await PrescriptionService.getAllPrescriptions();
        res.status(200).json(prescriptions); 
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.get('/prescription/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const prescription = await PrescriptionService.getPrescription(id);

        if (!prescription) {
            return res.status(404).send("Prescription not found");
        }
        res.status(200).json(prescription);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.post('/postPrescription', verifyToken, async (req, res) => {
    const { date, appointmentId, medicine, dosage, instructions } = req.body;
    
    if (!date || !appointmentId || !medicine || !dosage) {
        return res.status(400).json({ error: 'All fields (date, appointmentId, medicine, dosage) are required.' });
    }
    try {
        const prescription = await PrescriptionService.savePrescription({ date, appointmentId, medicine, dosage, instructions });
        res.status(201).json(prescription);
    } catch (error) {
        console.log("Error saving the prescription:", error);
        res.status(500).send("Error saving the prescription");
    }
});

router.put('/prescription/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { date, appointmentId, medicine, dosage, instructions } = req.body;

    try {
        const updatedPrescription = await PrescriptionService.updatePrescription(id, { 
            date, appointmentId, medicine, dosage, instructions
        });

        if (!updatedPrescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        res.status(200).json(updatedPrescription);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/prescription/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const prescription = await PrescriptionService.deletePrescription(id);
        if (!prescription) {
            return res.status(404).send("Prescription not found to delete");
        }
        res.status(200).send("Prescription deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

export default router;;