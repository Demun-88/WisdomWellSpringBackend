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
            morning:{
                before:{
                    type:Boolean,
                    required:false
                },
                msk:{
                    type:Boolean,
                    required:false
                }
            },
            afternoon:{
                before:{
                    type:Boolean,
                    required:false
                },
                msk:{
                    type:Boolean,
                    required:false
                }
            },
            night:{
                before:{
                    type:Boolean,
                    required:false
                },
                msk:{
                    type:Boolean,
                    required:false
                }
            }
        }
    ]
})

module.exports = new mongoose.model('patient', patientSchema);