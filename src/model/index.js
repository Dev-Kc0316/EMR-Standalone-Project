import Consultation from "./consultationModel.js";
import Vitals from "./vitalsModel.js";
import Lab_orders from "./lab_ordersModel.js";

/*===========================
Consultation <--> Vitals
=============================*/

const setupRelationship = () => {

Consultation.hasMany(Vitals, {
    foreignKey:'consultation_id',
    as: 'vitals'
});

Vitals.belongsTo(Consultation, {
    foreignKey: 'consultation_id',
    as: 'consultation' 
})

/*===========================
Consultation <--> Lab_orders
=============================*/
Consultation.hasMany(Lab_orders, {
    foreignKey:'clinical_note_id', 
    as:'lab_orders'
});

Lab_orders.belongsTo(Consultation, {
    foreignKey:'clinical_note_id', 
    as:'consultation'
});
}

setupRelationship();

export { Consultation, Vitals, Lab_orders};