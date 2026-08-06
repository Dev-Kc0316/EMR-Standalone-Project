import Lab_orders from '../model/lab_ordersModel.js'


export const createLabOrders = async(req,res) => {
    try{
    const {patient_id,doctor_id,clinical_note_id,test_name,status,ordered_by, ordered_at} = req.body;

    const newLabOrders = await Lab_orders.create({
        patient_id,
        doctor_id,
        clinical_note_id,
        test_name,
        status,
        ordered_by,
        ordered_at
    });

    return res.status(201).json({
        success:true,
        message:"successfully created laborders",
        data: newLabOrders
    })
  }catch(err){
    return res.status(500).json({
        success:false,
        message:"Server couldn't create laborders",
        error: err.message,
    })
  }
}



export const getAllLabOrders = async(req,res) => {
    try{
        const allLabOrders = await Lab_orders.findAll({where: {is_deleted:false}});

        return res.status(200).json({
            success:true,
            message:"Successfully got all laborders",
            data: allLabOrders,
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Server couldn't get all laborders",
            error:err.message
        });
    }
}

export const getLabOrdersById = async(req,res) =>{
    try{
        const {id} = req.params;

        const labOrdersById = await Lab_orders.findOne({where: {id, is_deleted:false}});

        if(!labOrdersById){
            return res.status(404).json({
                success:false,
                message:"Couldn't find specific rceord",
        });
      }else{
        return res.status(200).json({
            success: true,
            message:"Successfully got specific record",
            data: labOrdersById
        })
      }
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Sever couldn't get specific record",
            error:err.message
        });
    }
}

export const addLabResult = async (req, res) => {
    try {
        // 1. Get the text data from the form
        const { patient_id, consultation_id, test_name } = req.body;
        
        // We use a ternary operator to prevent a crash if no file was uploaded
        const file_url = req.file ? req.file.path : null;
        
        // 3. Get the session user
        const uploaded_by = req.session?.user?.id || null;

        console.log('Uploaded File:', req.file); // Multer attaches file data here
        console.log('Text Fields:', req.body);
        
        if(!file_url) {
            return res.status(400).json({
            success: false,
            message: "A file attachment is required"
    });
        }

        const newLabResult = await lab_ordersModel.create({
            patient_id,
            consultation_id,
            test_name,
            file_url,
            uploaded_by
    });

        return res.status(201).json({
            success:true,
            message: "Successfully upload lab result",
            data: newLabResult
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server couldn't upload lab result",
            error: err.message
        });
    }
};

export const updateLabOrders = async(req,res) =>{
    try{
        const {id} = req.params;
        const existinglabOrders = await Lab_orders.findOne({where: {id, is_deleted:false}});

     if(!existinglabOrders){
        return res.status(404).json({
            success:false,
            message:"Record couln't be found",
        })
     }
        const updatedlaborders = await existinglabOrders.update(req.body);

        return res.status(200).json({
            success:true,
            message:"Successfully updated record",
            data: updatedLabOrders,
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Server could not update record",
            error:err.message
        })
    }
}

export const deleteLabOrders = async(req,res) =>{
   try{

         const {id} = req.params;

        const labOrders = await Lab_orders.findOne({where: {id, is_deleted: false}});
            
        if(!labOrders){
            return res.status(404).json({
            success: false,
            message:"record not found "
        });
    }

    await labOrders.update({
        is_deleted: true,
        deleted_at: new Date()
    });

    return res.status(200).json({
            success: true,
            message: "Record has been deleted",
    });

    }catch(err){
        return res.status(500).json({
            success:false,
            message: "server couldn't delete all",
            error: err.message
        })
    }
}