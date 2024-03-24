const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const patientSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    age: {
        type: Number,
        required:true
    },
    phoneNo:{
        type: String,
        required:true
    },
    gender: {
        type: String,
        required:true
    },
    medicineList: [
        {
            medicineName: {
                type:String,
                required:false
            },
            time: {
                type:String,
                required:false
            },
            before: {
                type:String,
                required:false
            }
        }
    ]
})

module.exports = new mongoose.model('patient', patientSchema);