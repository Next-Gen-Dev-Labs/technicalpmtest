const mongoose = require('mongoose');


const TransactionsSchema = mongoose.Schema (
    {
        email: {
            type: String,
            required: [true, "Enter your email address"]
        },

        first_name: {
            type: String,
            required: true,
        },
        txn_id: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
        },
        walletaddress: {
            type: String,
            required: true,
        },
        token: {
            type: String, 
            required: true,
        },
        chain: {
            type: String, 
            required: true,
        },
        token_amount: {
            type: Number, 
            required: true,
        },
        amount_ugx: {
            type: Number, 
            required: true,
        },
        current_rate: {
            type: Number,
            required: true,
        },
        txn_type: {
            type: String,
            required: true,
        },
        txn_status: {
            type: String,
            required: true,
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Transactions = mongoose.model("Transaction", TransactionsSchema);
module.exports = Transactions;