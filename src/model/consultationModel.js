import { defaultValueSchemable } from "sequelize/lib/utils";
import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Consultation = sequelize.define('Consultation',{
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4
    },
    patient_id:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    doctor_id:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    chief_complaint:{
        type: DataTypes.TEXT,
        allowNull:false,
    },
    priority:{
        type:DataTypes.STRING(50),
        allowNull:false,
        defaultValue:'normal,'
    },
    status:{
        type:DataTypes.STRING(50),
        allowNull:false,
    },
    comment:{
        type:DataTypes.TEXT,
        allowNull:true,
    },
    created_at:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
    },
    created_by:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    updated_at:{
        type:DataTypes.DATE,
        allowNull: true,
        defaultValue:null,
    },
    updated_by:{
        type:DataTypes.UUID,
        defaultValue:null,
    },
    is_deleted:{
        type:DataTypes.TINYINT(1),
        allowNull:false,
        defaultValue:0,
    },
    deleted_at:{
        type:DataTypes.DATE,
        allowNull:true,
        defaultValue:null,
    },
    deleted_by:{
        type:DataTypes.UUID,
        defaultvalue:null,
    },
},   
    {
        tableName:'consultation',
        timestamps:true,
})

export default Consultation;