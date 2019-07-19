const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reponseSchema = new Schema({
    nom: String,
    genre: String,
    age: Number,
    etat: String,
    emploi: String,
    object1: Number,
    object2: Number,
    object3: Number,
    horizon: Number,
    tolerance1: Number,
    tolerance2: Number,
    tolerance3: Number,
    tolerance4: Number,
    renseignement1: Number,
    renseignement2: Array,
    renseignement22: Number,
    renseignement3: Number,
    minrendement: Number,
    maxpert: Number,
    created:{type: Date, default:Date.now}
});

module.exports = mongoose.model('reponse', reponseSchema);
