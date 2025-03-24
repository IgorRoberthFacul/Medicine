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
            return res.status(404).send({ message: "Not found Doctor" });
        }
        res.status(200).send(doctors);
    } catch (error) {
        console.error("Mistake when looking for doctors:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

router.get('/getDoctor/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).send({ message: "Not found Doctor" });
        }
        res.send(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
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

        if (doctor.error) {
            return res.status(400).json({ message: doctor.error });
        }

        res.status(201).send(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failure to register a doctor " + error);
    }
});

router.put('/doctors/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, login, password, medicalSpecialty, medicalRegistration, email, phone } = req.body;

    if (!name && !login && !password && !medicalSpecialty && !medicalRegistration && !email && !phone) {
        return res.status(400).json({ message: "Not data to update has been sent" });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const existingDoctor = await DoctorService.updateDoctor(id, req.body);
        if (!existingDoctor) {
            return res.status(404).json({ message: "Not found Doctor" });
        }

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

        const updatedDoctor = await DoctorService.updateDoctor(id, updateData);
        if (!updatedDoctor) {
            return res.status(500).json({ message: "Error updating Doctor" });
        }

        res.status(200).json({
            message: "Doctor successfully updated",
            doctor: updatedDoctor
        });
    } catch (error) {
        console.error("Error updating Doctor", error);
        res.status(500).json({ message: "Error updating doctor", error });
    }
});

router.delete('/doctors/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    try {
        const doctor = await DoctorService.deleteDoctor(id);

        if (!doctor) {
            return res.status(404).send({ message: "Not found Doctor" });
        }

        res.send({ message: "Doctor successfully excluded" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message || "Internal server error" });
    }
});

export default router;