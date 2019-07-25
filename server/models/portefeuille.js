const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reponseSchema = new Schema({
    IdPersonne: Number,
    IdCompteTitre: Number,
    Actif: String,
    typeActif: String,
    Solde: Number,
    SoldeNet: Number,
    CMPABrute: Number,
    CMPANet: Number,
    QteExecutee: Number,
    Sens: Number,
    PlusValue: Number,
    Date: Date,
    secteur: String,
});

module.exports = mongoose.model('portefeuille', reponseSchema);
