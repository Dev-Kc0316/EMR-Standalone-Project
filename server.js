import app from "./src/app.js";
import sequelize from "./src/config/database.js";
import { Consultation, Vitals, Lab_orders} from "./src/model/index.js"

const PORT = process.env.PORT || 8080;


const startServer = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true});
        console.log("Database connected succesfully");

        app.listen(PORT, () => {
         console.log(`should work at http://localhost:${PORT}`);
    });
    } catch(err){
        return ("couldn't connect to the database", err.message);
        process.exit(1);
    }
};

startServer();