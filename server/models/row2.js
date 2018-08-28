const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reponseSchema = new Schema({
    Date: Date,
    actions: String,
    slug: String,
    Rendclose: Number,
    Rendmasi: Number,
    Sharpe: Number,
    TrackingError: Number,
    RI: Number,
    Volatility: Number,
});

module.exports = mongoose.model('rows2', reponseSchema);