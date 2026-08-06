import express, { Router } from 'express';
import multer from 'multer';
import {
    createLabOrders,
    getAllLabOrders,
    addLabResult,
    getLabOrdersById,
    updateLabOrders,
    deleteLabOrders,
   
} from '../controllers/lab_ordersControllers.js';
import {verifyAuth,requireRole} from "../middlewares/requireRole.js";

const upload = multer({dest: 'uploads/lab_reults/'});

const labOrdersRouter = express.Router();

// 1. Create a new lab order (Doctors only)
labOrdersRouter.post('/', 
    verifyAuth,
    requireRole(['Doctor']),
    createLabOrders
);
// 2. Fetch all lab orders (Doctors, Nurses, Lab Techs, Admins)
labOrdersRouter.get('/',
    verifyAuth,
    requireRole(['Doctor','Nurse','Admin','Recieptionist']), 
    getAllLabOrders
);

// 3. Fetch single lab order by ID
labOrdersRouter.get(
    '/:id', 
    verifyAuth, 
    requireRole(['Doctor', 'Nurse', 'LabTechnician', 'Admin']), 
    getLabOrdersById
);

// 4. Attach lab result file (Lab Techs and Doctors)
labOrdersRouter.patch(
    '/:id/result', 
    verifyAuth, 
    requireRole(['Doctor', 'LabTechnician']), 
    upload.single('file'), // Multer parses the multipart/form-data here
    addLabResult
);

// 5. Update lab order status/details
labOrdersRouter.put(
    '/:id', 
    verifyAuth, 
    requireRole(['Doctor', 'LabTechnician', 'Admin']), 
    updateLabOrders
);

// 6. Soft delete lab order (Admins only)
labOrdersRouter.delete(
    '/:id', 
    verifyAuth, 
    requireRole(['Admin']), 
    deleteLabOrders
);

export default labOrdersRouter;

