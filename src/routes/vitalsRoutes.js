import express,{Router} from 'express';
import { createVitals, deleteVitals, getAllVitals, 
    getVitalsByPatient,getVitalsById, updateVitals } from '../controllers/vitalsController.js';
import { verifyAuth,requireRole } from '../middlewares/requireRole.js';

const vitalsRouter = express.Router();
// 1. Record new patient vitals (Nurses and Doctors)
vitalsRouter.post(
    '/',
    verifyAuth,
    requireRole(['Nurse', 'Doctor']),
    createVitals
);

// 2. Retrieve all recorded vitals (Doctors, Nurses, and Admins)
vitalsRouter.get(
    '/',
    verifyAuth,
    requireRole(['Doctor', 'Nurse', 'Admin']),
    getAllVitals
);

// 3. Retrieve vitals history for a specific patient
vitalsRouter.get(
    '/patient/:patient_id',
    verifyAuth,
    requireRole(['Doctor', 'Nurse', 'Admin']),
    getVitalsByPatient
);

export default vitalsRouter;


