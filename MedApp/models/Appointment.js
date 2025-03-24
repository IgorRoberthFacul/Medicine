import { mongoose } from "mongoose";

const Schema = mongoose.Schema;
const appointmentSchema = new Schema({

    date: {
        type: Date,
        required: [true, 'Appointment Date is required.']
    },
    doctor: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',  
        required: [true, 'Doctor is required.'],
    },
    pacientId:{
        type: String,
        required: [true, 'PacientId is required.']
    },
    createAt: {
        type: Date,
        default: Date.now
        }
    }
);

const appointment = mongoose.model('Appointment',appointmentSchema);
export default appointment;