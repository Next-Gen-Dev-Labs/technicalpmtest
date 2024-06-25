const mongoose = require('mongoose');


const UsersSchema = mongoose.Schema (
    {
        email: {
            type: String,
            required: [true, "Enter your email address"]
        },

        user_type: {
            type: String, 
            required: false,
            default: "user",
        },

        username: {
            type: String,
            required: false,
        },

        first_name: {
            type: String,
            required: true,
        },

        last_name: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: false,
            default: 'Uganda',
        },
        phone_number: {
            type: String,
            required: false,
        },
        walletaddress: {
            type: String,
            required: false,
        },
        masked_walletaddress: {
            type: String,
            required: false,
        },
        wallet_balance: {
            type: Number,
            required: false,
            
        }
    },
    {
        timestamps: true
    }
);

const Users = mongoose.model("User", UsersSchema);
module.exports = Users;