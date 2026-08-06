import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

//   const sequelize = new Sequelize("mysql://localhost:3306/emr_db", "root");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

// export async function connectDB() {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established Successfully");
//     return sequelize;
//   } catch (error) {
//     console.error("Unable to connect to the database: ", error);
//   }
// }

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection Established Successfully");

    if (process.env.ENV_STATUS !== "production") {
      console.log("database tables created/updated");
      const rebuild = await sequelize.sync({ force: true });
      if (!rebuild) {
        console.log("Unable to rebuild");
      }
    }
  } catch (error) {
    console.log("Error connecting:", error);
    throw error;
  }
}

export default sequelize;
