const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reponseSchema = new Schema({
    nom: String,
    prenom: String,
    genre: String,
    age: Number,
    etat: String,
    emploi: String,
    enfantcharge: Number,
    autrecharge: Number,
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
    minrendement: String,
    maxpert: String,
});

module.exports = mongoose.model('reponse', reponseSchema);