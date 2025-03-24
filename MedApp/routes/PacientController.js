import express from "express";
import PacientService from "../services/PacientService.js";
import Pacient from "../models/Pacient.js";
import PacientRepository from "../repositories/PacientRepository.js";
import mongoose from "mongoose";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/pacient', verifyToken, async(req,res) =>{

    try {
        const pacient = await PacientService.getAllPacient();
        res.json(pacient);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});

router.get('/getPacient/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {

        const pacient = await Pacient.findById(id);
        if (!pacient) {
            return res.status(404).json({ message: "Pacient not found" });
        }
        res.json(pacient);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.post('/pacient', verifyToken, async (req, res) => {
    try {
        const { name, birthDate, email, phone } = req.body;

        if (!name || !birthDate || !email || !phone) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }

        const newPacient = await PacientService.savePacient({ name, birthDate, email, phone });
        res.status(201).json(newPacient);
    } catch (error) {
        console.log("Error in saving patient: ", error);
        res.status(500).send(error.message);
    }
});


router.put('/pacient/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, birthDate, email, phone } = req.body;

    try {
        const updatedPacient = await PacientService.updatePacient(id, { name, birthDate, email, phone });

        if (!updatedPacient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json(updatedPacient);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
 
router.delete('/pacient/:id', verifyToken, async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid ID" });
        }

    try {
        const pacient = await PacientService.deletePacient(id);
        if (!pacient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.send({ message: 'Patient successfully excluded.', pacient });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

export default router;