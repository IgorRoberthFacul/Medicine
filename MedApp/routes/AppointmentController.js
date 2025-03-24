import express from "express";
import AppointmentService from "../services/AppointmentService.js";  
import db from "../database/database.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/appointments', verifyToken, async (req, res) => {
    try{
       const appointments = await AppointmentService.getAllAppointment();
       res.json(appointments);
    } catch(error) {
       console.log(error);
       res.status(500).send(error);
    }
});

router.get('/getAppointment/:id', verifyToken, async (req, res) => {
   try {
       const appointment = await AppointmentService.getAppointment(req.params.id);
       if (!appointment) {
           return res.status(404).json({ message: "Appointment not found" });
       }
       res.json(appointment);
   } catch (error) {
       console.error("Error when searching for an appointment:", error);
       res.status(500).json({ error: error.message });
   }
});

router.post('/appointments', verifyToken, async (req, res) => {
    const { date, doctor, pacientId } = req.body; 
    try {
        
        const appointment = await AppointmentService.saveAppointment({
            date,
            doctor, 
            pacientId
        });
        res.status(201).json(appointment);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.put('/appointments/:id', verifyToken, async(req,res) =>{
   const {id} = req.params;
   const {date, doctorId, pacientId} = req.body;
   try {
       const appointment = await AppointmentService.updateAppointment(id,{date, doctorId, pacientId});
       res.send(appointment);
   } catch (error) {
       console.log(error);
       res.status(500).send(error);
   }
});

router.delete('/appointments/:id', verifyToken, async(req,res) =>{
    const {id} = req.params;
    try {
        const appointment = await AppointmentService.deleteAppointment(id);
        res.send(appointment);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.put("/reschedule/:id", verifyToken, async(req, res) => {
    const {id} = req.params;
    const {date} = req.body;
    
    try {
        let appointment = await AppointmentService.getAppointment(id);
        appointment.date = date;
    
        appointment = await AppointmentService.updateAppointment(id, {date});
        res.send(appointment);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

export default router