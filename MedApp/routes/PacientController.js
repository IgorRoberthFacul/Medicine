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
        if (!pacient || pacient.length === 0) {
            return res.status(404).send(error);
        }
        res.status(200).send(pacient);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: error.message});
    }

});

router.get('/getPacient/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const pacient = await PacientService.getPacient(id);
        res.status(200).send(pacient);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ message: error.message });
    }
});

router.post('/pacient', verifyToken, async (req, res) => {
    try {
        const { name, birthDate, email, phone } = req.body;
        const newPacient = await PacientService.savePacient({ name, birthDate, email, phone });
        res.status(201).json(newPacient);

    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message});
    }
});

router.put('/pacient/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, birthDate, email, phone } = req.body;

    try {
        const updatedPacient = await PacientService.updatePacient(id, { name, birthDate, email, phone });
        res.json(updatedPacient);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
});
 
router.delete('/pacient/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await PacientService.deletePacient(id);

        if (result.success) {
            return res.send({ message: result.message, pacient: result.pacient });
        }

        return res.status(400).json({ message: result.message });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An unexpected error occurred." });
    }
});

export default router;