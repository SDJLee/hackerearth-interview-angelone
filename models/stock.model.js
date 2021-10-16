const mongoose = require('mongoose');


const StockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    sell: { type: Array, "default": [] },
    buy: { type: Array, "default": [] },
});


module.exports.Stock = mongoose.model('Stock', StockSchema, 'stocks');