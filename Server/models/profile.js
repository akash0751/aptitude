const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, ref: "AptitudeUser", required: true
    },
    name:{
        type:String,
        required:true
    },
    role:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    image:{
        type:String,
    }

})

const AptitudeProfile = mongoose.model('AptitudeProfile', profileSchema)
module.exports = AptitudeProfile;