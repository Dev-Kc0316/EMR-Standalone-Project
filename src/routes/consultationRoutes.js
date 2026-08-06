import express from 'express';
import { createConsultation,            deleteConsultation, 
    addNotes,
    getPatientConsultations,
    getAllConsultation, getConsultationById, updateConsultation } from '../controllers/consultationController.js';
import { verifyAuth,requireRole } from '../middlewares/requireRole.js';

const consultationRouter = express.Router();

// 1. Create a consultation (Receptionist, Admin)
consultationRouter.post(
    '/', 
    verifyAuth, 
    requireRole(['Receptionist', 'Admin']), 
    createConsultation
);

// 2. Add clinical notes to a consultation (Doctor only)
consultationRouter.patch(
    '/:id/notes', 
    verifyAuth, 
    requireRole(['Doctor']), 
    addNotes
);

// 3. Get consultation by ID (Doctor, Nurse, Admin)
consultationRouter.get(
    '/:id', 
    verifyAuth, 
    requireRole(['Doctor', 'Nurse', 'Admin']), 
    getConsultationById
);

// 4. Get all consultations for a patient
consultationRouter.get(
    '/patient/:patient_id', 
    verifyAuth, 
    requireRole(['Doctor', 'Nurse', 'Admin']), 
    getPatientConsultations
);

export default consultationRouter;
