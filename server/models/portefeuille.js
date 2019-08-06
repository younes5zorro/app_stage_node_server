const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function slugWithDate(text) {
  let myText = text.toString().toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text

    //
      return formatted + myText;

}

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
    slug: String,
    performance: Number,
});

reponseSchema.pre('save', function (next) {
  this.slug = slugWithDate(this.Actif);
  next();
});

module.exports = mongoose.model('portefeuille', reponseSchema);
