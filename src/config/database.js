import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

//   const sequelize = new Sequelize("mysql://localhost:3306/emr_db", "root");
const sequelize = new Sequelize({
  dialect: process.env.DB_NAME,
  storage: process.env.DB_PATH,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established Successfully");
    return sequelize;
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
}

export default sequelize;
