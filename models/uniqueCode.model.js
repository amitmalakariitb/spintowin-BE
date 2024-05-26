const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uniqueCodeSchema = new Schema({
    unique_number: {
        type: Number,
        required: true,
        unique: true
    },
    random_code: {
        type: String,
        required: true
    },
    hash_key: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['used', 'unused', 'scanned'],
        default: 'unused'
    },
    prize: {
        type: String,
        required: true
    },
    winner_name: {
        type: String,
        default: null
    },
    winner_contact: {
        type: String,
        default: null
    }
});

const UniqueCode = mongoose.model('UniqueCode', uniqueCodeSchema);

module.exports = UniqueCode;
