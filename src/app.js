import express from 'express';
import  { sequelize, Consultation, Vitals, Lab_orders} from "./model/index.js";

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true}));


const startServer = async () => {
    try {
        await sequelize.sync({ alter: true});
        console.log("connected succesfully");

        app.listen(PORT, () => {
         console.log(`should work at http://localhost${PORT}`)
    });
    } catch(err){
        console.log("couldn't connect ", err)
    }
};

startServer();