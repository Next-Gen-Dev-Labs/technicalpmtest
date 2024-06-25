const mongoose = require('mongoose');


const RatesSchema = mongoose.Schema (
    {
        rate_type: {
            type: String,
            required: true,
        },

        rate_amount: {
            type: Number, 
            required: false,
        },
    },
    {
        timestamps: true
    }
);

const Rates = mongoose.model("Rate", RatesSchema);
module.exports = Rates;