const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reponseSchema = new Schema({
    action: String,
    slug: String,
    count: Number,
    polariy: Number,
    tweets: Array
});

module.exports = mongoose.model('tweet', reponseSchema);