import { Sequelize } from "sequelize";
import  dotenv from "dotenv";

dotenv.config();


export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect:'mysql',
    }
);

//connecting to database
export async function connectDB(){
    try{
        await sequelize.authenticate();
        console.log("Sucessfully connected to database"); //test connection
        // await sequelize.sync(); // makes sure the models are sync to the database
    }catch(error) {
        console.error("Unable to connect to database", error)
    }
}

export default sequelize;

