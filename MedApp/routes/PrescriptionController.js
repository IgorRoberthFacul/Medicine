import express from "express";
import PrescriptionService from "../services/PrescriptionService.js";
import verifyToken from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, "C:/Users/igorr/OneDrive/Desktop/Aula pdf Facul/Programação II/MediApp");
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});

router.post('/uploadPrescription/:id', verifyToken, upload.single('file'), async (req, res) => {

     try {
        const {id} = req.params;
        let prescription = await PrescriptionService.getPrescription(id);
        const file = "C:/Users/igorr/OneDrive/Desktop/Aula pdf Facul/Programação II/MediApp" + req.file.originalname;
        prescription = await PrescriptionService.updatePrescription(id,{file});

        return res.status(200).send(prescription);

     } catch (error) {
        console.error(error);
        res.status(500).send(error);
     }
});

router.get('/prescriptions', verifyToken, async (req, res) => {
    try {
        const prescriptions = await PrescriptionService.getAllPrescriptions();
        res.status(200).json(prescriptions); 
    } catch (error) {
        console.error(error);
        res.status(500).send({message: error.message});
    }
});

router.get('/prescription/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    
    try { 
        const prescription = await PrescriptionService.getPrescription(id);
        res.status(200).json(prescription);

    } catch (error) {
        console.error(error);
        res.status(404).send({ message: error.message });
    }
});

router.post('/postPrescription', verifyToken, async (req, res) => {
    const { date, appointmentId, medicine, dosage, instructions } = req.body;

    try {
   
        const result = await PrescriptionService.savePrescription({ date, appointmentId, medicine, dosage, instructions });
        if (result.success) {
            res.status(201).json(result.prescription);
        } else {
            res.status(400).json({ error: result.message });
        }

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Error saving the prescription" });
    }
});

router.put('/prescription/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { date, appointmentId, medicine, dosage, instructions } = req.body;

    try {
        const result = await PrescriptionService.updatePrescription(id, { date, appointmentId, medicine, dosage, instructions });

        if (result.success) {
            res.status(200).json({ message: result.message, prescription: result.prescription });
        } else {
            res.status(400).json({ error: result.message });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete('/prescription/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await PrescriptionService.deletePrescription(id);

        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/generatePrescription/:id', verifyToken, async (req, res) =>  {

    const {id} = req.params;

    try {
        const prescription = await PrescriptionService.getPrescription(id);
        const generatePrescription = await PrescriptionService.generatePrescriptionFile(prescription);
        res.send(generatePrescription);

    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

export default router;