const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reponseSchema = new Schema({
    seance: Date,
    designation: String,
    slug: String,
    premierCours: Number,
    dernierCours: Number,
    Hjours: Number,
    Bjours: Number,
    titres: Number,
    cap: Number,
});

module.exports = mongoose.model('row', reponseSchema);