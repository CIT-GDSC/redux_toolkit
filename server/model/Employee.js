const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeschema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true},
}, { collection: "employees" });


module.exports = mongoose.modell('Employee', employeeschema);
