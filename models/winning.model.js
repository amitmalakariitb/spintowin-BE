const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const winningSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    unique_code_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UniqueCode',
        required: true
    },
    prize: {
        type: String,
        required: true
    },
    redemption_status: {
        type: String,
        enum: ['redeemed', 'not_redeemed'],
        default: 'not_redeemed'
    }
});

const Winning = mongoose.model('Winning', winningSchema);

module.exports = Winning;
