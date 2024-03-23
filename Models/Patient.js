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
    gender: {
        type: Boolean,
        required:true
    },
    medicineList: [
        {
            medicineName: {
                type:String,
                required:true
            },
            morning:{
                before:{
                    type:Boolean,
                    required:true
                },
                msk:{
                    type:Boolean,
                    required:true
                }
            },
            afternoon:{
                before:{
                    type:Boolean,
                    required:true
                },
                msk:{
                    type:Boolean,
                    required:true
                }
            },
            night:{
                before:{
                    type:Boolean,
                    required:true
                },
                msk:{
                    type:Boolean,
                    required:true
                }
            }
        }
    ]
})

module.exports = new mongoose.model('patient', patientSchema);