import sequelize from "../config/database.js";
import Consultation from "./consultationModel.js";
import Vitals from "./vitalsModel.js";
import Lab_orders from "./lab_ordersModel.js";




export {sequelize, Consultation, Vitals, Lab_orders};