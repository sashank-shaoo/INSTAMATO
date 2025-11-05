const { default: mongoose } = require("mongoose");

const foodPartnerSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    }, 
    contactName : {
        type : String,
        require : true
    },
    phone : {
        type : Number,
        require : true
    },
    address : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true,
        unique : true
    }, 
    password : {
        type : String,
        require : true
    }
}, {timestamps : true});

const foodPartnerModel = mongoose.model("foodPartner", foodPartnerSchema);

module.exports = foodPartnerModel;