import { DATE, where } from "sequelize"
import Consultation from "../model/consultationModel.js"

export const createConsultation = async(req,res) => {
    try{
        const {patient_id, doctor_id, chief_complaints, priority,comment} = req.body

        const newConsultation = await Consultation.create({
            patient_id,
            doctor_id,
            chief_complaints,
            priority,
            status: 'waiting',
            comment,
            created_by: req.session?.user?.id || null,
     })
     return res.status(201).json({
        success:true,
        message:"successfully created consultation",
        data: newConsultation,
     })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Server couldn't create",
            error: err.message
        });
    }
}

export const getAllConsultation = async(req,res) =>{
    try{
        const allConsulation = await Consultation.findAll({where: {
            is_deleted: false,
            status:['Waiting', 'in Consultation']
        },
        order: [
            ['createdAt', 'ASC']
        ]
    });

        return res.status(200).json({
            success:true,
            message:"successfully got all consulation",
            data: allConsulation
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"server could not get all consulation",
            error: err.message
        });
    }
}
    export const getPatientConsultations = async (req, res, next) => {
       try {
         return res.status(501).json({
                success: false,
                message: 'Endpoint not implemented yet'
         });
      } catch (error) {
           next(error);
    }
};

export const updateStatus = async(req,res) => {
    try{

        const {id} = req.params;
        const {status} = req.body

        const consultation = await Consultation.findOne({
            where: {id, is_deleted:false }});

            if(!consultation){
                return res.status(404).json({
                    success:false,
                    message:"consultation not found",
                })
            }

        const newConsultation = await consultation.update({ status });
        
        return res.status(200).json({
            success:true,
            message:"succesfully updated status",
            data: newConsultation
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"server couldn't update status",
            error:err.message
        })
    }
}

export const addNotes = async(req,res) =>{
    try{
        const {id} = req.params;
        const {comment} = req.body;

        const consultation = await Consultation.findOne({where: {id, is_deleted:false}});

        if(!consultation){
            return res.status(404).json({
                success:false,
                message:"consulation not found"
            });
        };

        const notes = await consultation.update({ comment, status: 'Completed'})

        return res.status(200).json({
            success:true,
            message: "succesfully added note"
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"server couldn't add notes",
            error: err.message  
        })
    }
}

export const getConsultationById = async(req,res) =>{
    try{
        const {id} = req.params;

        const consultationById = await Consultation.findOne({where: {id, is_deleted:false}});

        if(!consultationById){
            return res.status(404).json({
                success: false,
                message:"specific record not found",
            });
        }else{
            return res.status(200).json({
                success: true,
                message:"successfully got record",
                data: consultationById
            });
        }

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "sever couldn't get record",
            error: err.message
        })
    }
}

export const updateConsultation = async(req,res) =>{
    try{
        const {id} = req.params;

        const consultation = await Consultation.findOne({where: {id, is_deleted:false}});

        if(!consultation){
            return res.status(404).json({
                success: false,
                message:"Record not found"
            });
        }

        const newConsultation = await consultation.update(req.body);
        
        return res.status(200).json({
            success: true,
            message: "successfully updated record",
            data: newConsultation
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message: "server couldn't update record"
        })
    }
}

export const deleteConsultation = async(req,res) =>{
    try{
        const {id} = req.params;

        const consultation = await Consultation.findOne({where: {id, is_deleted:false}});

        if(!consultation){
           return res.status(404).json({
                success: false,
                message:"record not found",
            });
        }

        await consultation.update({
            is_deleted: true,
            deleted_at: new Date()
        });

        return res.status(200).json({
            success: true,
            message: "record has been deleted",
            data: consultation
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message: "sever couldn't delete record",
            error: err.message
        })
    }
}