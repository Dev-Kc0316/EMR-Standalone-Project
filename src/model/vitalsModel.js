import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Vitals = sequelize.define('Vitals',{
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
    },
    patient_id:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    consultation_id:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    weight:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    height:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    blood_pressure:{
        type:DataTypes.STRING(50),
        allowNull:false,
    },
    temperature:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
     created_at:{
        type:DataTypes.DATE,
        allowNull:false,
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
    }
},
    {
        tableName:'vitals',
        timestamps: true,
    }
)

export default Vitals;