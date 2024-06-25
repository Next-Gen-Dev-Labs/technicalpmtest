const mongoose = require('mongoose');


const TokensSchema = mongoose.Schema (
    {
        Token: {
            type: String,
            required: true,
        },

        token_tag: {
            type: String, 
            required: true,
        },
        chain: {
            type: String, 
            required: true,
        },
        token_image: {
            type: String, 
            required: false,
        },
    },
    {
        timestamps: true
    }
);

const Tokens = mongoose.model("Token", TokensSchema);
module.exports = Tokens;