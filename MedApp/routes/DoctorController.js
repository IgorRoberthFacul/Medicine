import express from "express";
import bcrypt from 'bcrypt';
import DoctorService from "../services/DoctorService.js";
import Doctor from '../models/Doctor.js';
import mongoose from 'mongoose';
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/doctors', verifyToken, async (req, res) => {
    try {
        const doctors = await DoctorService.getAllDoctors();

        if (!doctors || doctors.length === 0) {
            return res.status(404).send(error);
        }
        res.status(200).send(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message});
    }
});

router.get('/getDoctor/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const doctor = await DoctorService.getDoctor(id); 

        res.status(200).send(doctor);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ message: error.message});
    }
});

router.post('/postDoctor', verifyToken, async (req, res) => {

    const { name, login, password, medicalSpecialty, medicalRegistration, email, phone } = req.body;
    
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const doctor = await DoctorService.saveDoctor({
            name,
            login,
            password: hashPassword,
            medicalSpecialty,
            medicalRegistration,
            email,
            phone
        });

        res.status(201).send(doctor);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ message: error.message || "Failure to register doctor" });
    }
});

router.put('/doctors/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, login, password, medicalSpecialty, medicalRegistration, email, phone } = req.body;

    if (!name && !login && !password && !medicalSpecialty && !medicalRegistration && !email && !phone) {
        return res.status(400).json({ message: "No data to update has been sent" });
    }

    try {
        const hashPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const updateData = {
            name,
            login,
            medicalSpecialty,
            medicalRegistration,
            email,
            phone
        };

        if (hashPassword) {
            updateData.password = hashPassword;
        }

        const result = await DoctorService.updateDoctor(id, updateData);

        if (result.status !== 200) {
            return res.status(result.status).json({ message: result.message });
        }
        res.status(result.status).json({
            message: result.message,
            doctor: result.doctor
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating doctor", error });
    }
});


router.delete('/doctors/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    try {
        const response = await DoctorService.deleteDoctor(id);

        if (response.status !== 200) {
            return res.status(response.status).send({ message: response.message });
        }

        res.status(200).send({ message: response.message });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message || "Internal server error" });
    }
});

export default router;