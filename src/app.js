import express from 'express';
import { connectMySQL } from "./config/database.js";
 
const app = express();


app.listen(8080, () => {
    console.log(`should work 8080`)
})