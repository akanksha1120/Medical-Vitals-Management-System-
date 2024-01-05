const mongoose = require('mongoose');

const vitalsSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    vitalID: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    timestamp: {
        type: mongoose.Schema.Types.Date,
        required: true
    }
})

const vitals = mongoose.model('vitals', vitalsSchema);
module.exports = vitals;