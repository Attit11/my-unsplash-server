const mongoose = require("mongoose")

const ImageDetails = mongoose.model("ImageDetails", {
    label:{
        type: String,
        required: true
    },
    picture:{
        type:Buffer,
        required: true
    }
})

module.exports = ImageDetails