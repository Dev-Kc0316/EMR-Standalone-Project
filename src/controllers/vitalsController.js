import { DATE, where } from "sequelize";
import Vitals from "../model/vitalsModel.js";


export const createVitals = async(req,res) => {
    try{
        const { id,patient_id } = req.params
        const {  consultation_id, weight, height, blood_pressure, temperature } = req.body;
        const created_by = req.session?.user?.id || null;
        
        const newVitals = await Vitals.create ({
            patient_id,
            consultation_id,
            weight,
            height,
            blood_pressure,
            temperature,
            created_by
        })
        return res.status(201).json({
            success: true,
            message:"vitals recorded successfully",
            data: newVitals
        });
    }catch(err) {
        res.status(500).json({
            success: false,
            message:"vitals unsuccesfully recorded",
            error:err.message
        })
    }
}

export const getAllVitals = async(req,res) => {
    try{

        const allVitals = await Vitals.findAll({
            where: {is_deleted: false}
        });    

        return res.status(200).json({
            success:true,
            message:"successfully got all vitals",
            data: allVitals
        })
    }catch(err) {
        res.status(500).json({
            success:false,
            message:"couldn't retrieve vitals",
            error: err.message
        })
    }
}

export const getVitalsByPatient = async (req, res) => {
    try {
        const { patient_id } = req.params;

        const vitalsByPatient = await Vitals.findAll({
            where: {
                patient_id
            },
            order: [
                ['created_at', 'DESC']
            ]
        });

        if(!vitalsByPatient){
            return res.status(404).json({
                success: false,
                message: "Could not get patient vitals"
            })
        }
        return res.status(200).json({
         success: true,
          message: "Successfully retrieved patient vitals history",
          data: vitalsByPatient
});

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server couldn't retrieve vitals",
            error: err.message
        });
    }
};


export const getVitalsById = async(req,res) => {
    try{
        //extracts id from route params
        const {id} = req.params;
        //query the DB
        const vitalsById = await Vitals.findOne({ where: {id} });
        //checks if the record exist 
     if(!vitalsById) {
        res.status(404).json({
            success: false,
            message: "vitals record not found",
            error: err.message, 
        });
        
        //returns found record
        return res.status(200).json({
        success: true,
        message: "gotten vitals by id",
        data: vitalsById
    })
}

    }catch(err){
        //catches the error if caused by server or database
        res.status(500).json({
            success: false,
            message: "server error retrieving vitals",
            error: err.message, 
        });
    }
};

export const updateVitals = async(req,res) => {
    try{
        const {id} = req.params;

        const existingVitals = await Vitals.findOne({where: {id, is_deleted:false}});

        if(!existingVitals){
            return res.status(404).json({
                success:false,
                message:"not found"
            })
        }

        const  updatedVitals = await existingVitals.update(req.body);

        return res.status(200).json({
            success:true,
            message:"updated succesfully",
            data:updatedVitals
        })
    }catch(err){
        return res.status(500).json({
            success:true,
            message:"server error updating vitals "
        })
    }
}

export const deleteVitals = async(req,res) =>{
   try{

         const {id} = req.params;

        const vitals = await Vitals.findOne({where: {id, is_deleted: false}});
            
        if(!vitals){
            return res.status(404).json({
            success: false,
            message:"record not found "
        });
    }

    await vitals.update({
        is_deleted: true,
        delete_at: new Date()
    });

    return res.status(200).json({
            success: true,
            message: "deleted all record",
    });

    }catch(err){
        return res.status(500).json({
            success:false,
            message: "server couldn't delete all",
            error: err.message
        })
    }
}