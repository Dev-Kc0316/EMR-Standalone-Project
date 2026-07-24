import { Sequelize } from "sequelize";

// storing database in variables
const db_Name = "emr_db"
const db_Username = "username"
const db_Password = "password"

//connecting to database
const sequelize = new Sequelize(db_Name,db_Username,db_Password, {
    host: '127.0.0.1', 
    dialect: 'mysql' // the dialect the database will use
});

//Function to connect to MySQL
export const connectMySQL = async () => {
    try{
        await sequelize.authenticate();
        console.log("Sucessfully connected to database"); //test connection
        // await sequelize.sync(); // makes sure the models are sync to the database
    }catch(error) {
        console.error("Unable to connect to database", error)
    }
}

export default sequelize;

