const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reponseSchema = new Schema({
    Connaissance_marche: Number,
    Tolerance_risque: Number,
    Objectifs_Investissement: Number,
    Q36: Number,
    Q47: Number,
    IdPersonne: Number,
    Situation_Patrimoniale: Number,
    Horizon: Number,
    Temps_Disponible: Number,
    Mode_Gestion: Number,
    ScoreFinal: Number,
    ProfilStatique: String,

});

module.exports = mongoose.model('profilestatique', reponseSchema);
