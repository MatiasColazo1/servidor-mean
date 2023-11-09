const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    lastWeekValue: Number,
    thisWeekValue: Number
});

const Balance = mongoose.model('Balance', balanceSchema);

module.exports = Balance;