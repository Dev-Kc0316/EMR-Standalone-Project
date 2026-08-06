import sequelize from "../config/database.js";
import { DataTypes, UUIDV4 } from "sequelize";

const Lab_orders = sequelize.define('Lab_orders',{
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
    },
    patient_id:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    doctor_id:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    clinical_note_id:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    test_name:{
        type:DataTypes.STRING(50),
        allowNull:false,
    },
    priority:{
        type:DataTypes.STRING(50),
        allowNull:false,
        defaultValue:'medium',
    },
    status:{
        type:DataTypes.STRING(50),
        allowNull:false,
        defaultValue:'in progress'
    },
    result:{
        type:DataTypes.TEXT,
        allowNull:false,
        defaultValue:'\' in progress\'',
    },
    comment:{
        type:DataTypes.TEXT,
        defaultValue:null,
    },
    ordered_by:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:'nurse'
    },
    ordered_at: {
        type: DataTypes.DATE,
        allowNull: false, 
        defaultValue: DataTypes.NOW

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
    },


},
    {
        tableName: 'lab_orders',
        timestamps: true,
    }
)

export default Lab_orders;