const express = require('express');
const mongoose = require('mongoose');
const app = express();


const cors = require('cors');

// const User = require('./models/users.model.js');
// const Transaction = require('./models/transactions.model.js');
const Rate = require('./models/Rates.js');
const Token = require('./models/Tokens.js');




app.use(cors({
  origin: 'http://localhost:3000' // Replace with your frontend origin
}));





const transactionSchema = new mongoose.Schema({
    txn_id: { type: String, required: true, unique: true },
    txn_type: { type: String, required: true }, // buy or sell
    txn_status: { type: String, required: false }, // status of the transaction
    amount_ugx: { type: Number, required: true }, // amount in UGX
    token: { type: String, required: true }, // token involved in the transaction
    chain: { type: String, required: true }, // blockchain chain
    token_amount: { type: Number, required: true }, // amount of token
    current_rate: { type: Number, required: true }, // current rate
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // reference to user
  }, { timestamps: true });

  const userSchema = new mongoose.Schema({
    email: { type: String, required: [true, "Enter your email address"], unique: true },
    user_type: { type: String, required: false, default: "user" },
    username: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    country: { type: String, required: false, default: 'Uganda' },
    phone_number: { type: String, required: true },
    walletaddress: { type: String, required: true },
    masked_walletaddress: { type: String, required: true },
    wallet_balance: { type: Number, required: false, default: 0 }
  }, { timestamps: true });

  const Transaction = mongoose.model('Transaction', transactionSchema);
  const User = mongoose.model('User', userSchema);
  
  
  
  
  const generateTxnId = (txn_type) => {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    return `${txn_type}-${randomNumber}`;
  };

app.use(express.json());


app.listen(3001, ()=> {
    console.log('Server is running on Clean port')
});

// {/Users Section (add user, getusers, get single users by id)/}

app.post('/api/newuser', async (req, res) => {
    try {
      const { email } = req.body; // Extract email from request body
  
      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' }); // Return error if duplicate
      }
  
      const user = await User.create(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  


app.get('/api/users', async (req,res)=> {
    try {
        const user = await User.find({});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message:error.message});

    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id); // Use the defined method
  
      if (user) { // Check if user exists before sending response
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' }); // Handle user not found case
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/users/email/:email', async (req, res) => {
    try {
      const { email } = req.params;
      if (!email) {
        return res.status(400).json({ message: 'Email parameter is missing' });
      }
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

  app.put('/api/users/email/:email', async (req, res) => {
    try {
      const { email } = req.params;
      const { username } = req.body;
  
      // Check if the username is already taken by another user
      if (username) {
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser.email !== email) {
          return res.status(400).json({ message: 'Username is already taken' });
        }
      }
  
      // Update the user profile
      const updatedUser = await User.findOneAndUpdate(
        { email },
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User Data Updated', data: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  



// {/Transaction Section (create txn, get txns, get single txn id)/}

app.post('/api/createtxn', async (req, res) => {
    try {
      const { txn_type, email, ...rest } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: 'User email is required' });
      }
  
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const txn_id = generateTxnId(txn_type);
  
      const transaction = await Transaction.create({ ...rest, txn_id, txn_type, user: user._id });
      res.status(200).json({ message: "Transaction Successful", transaction });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  


app.get('/api/alltxn', async (req,res)=> {
    try {
        const user = await Transaction.find({});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message:error.message});

    }
});

app.get('/api/transaction/:txn_id', async (req, res) => {
    try {
      const { txn_id } = req.params;
  
      // Find the transaction by txn_id and populate the user field
      const transaction = await Transaction.findOne({ txn_id }).populate('user');
  
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


app.put('/api/updatetxn/:txn_id', async (req, res) => {
    try {
      const { txn_id } = req.params;
      const { txn_status } = req.body;
  
      // Find and update the transaction status
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { txn_id },
        { txn_status },
        { new: true, runValidators: true }
      ).populate('user'); // Populate the user field
  
      if (!updatedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
  
      // If the transaction status is "success", update the user's wallet balance
      if (txn_status === 'success' && updatedTransaction.user) {
        const user = updatedTransaction.user;
        if (user) {
          console.log(`User found: ${JSON.stringify(user, null, 2)}`);
          console.log(`Current wallet balance: ${user.wallet_balance}`);
          console.log(`Transaction amount_ugx: ${updatedTransaction.amount_ugx}`);
  
          // Update the wallet balance directly
          user.wallet_balance += updatedTransaction.amount_ugx;
  
          // Save the user document explicitly
          await user.save();
  
          console.log(`Updated wallet balance: ${user.wallet_balance}`);
        } else {
          console.log(`User not found with ID: ${updatedTransaction.user}`);
        }
      }
  
      res.status(200).json({ message: 'Transaction Status Updated', data: updatedTransaction });
    } catch (error) {
      console.error(`Error updating transaction: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  });
  
  
  



//Rates
app.post( '/api/addrate', async (req, res)=>{
    try {
        const rate = await Rate.create(req.body);
        res.status(200).json({message: "Rate Created"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

app.get('/api/rate/:rate_type', async (req, res) => {
    try {
      const { rate_type } = req.params;
      const rate = await Rate.findOne({ rate_type });
  
      if (!rate) {
        return res.status(404).json({ message: 'Rate not found' });
      }
  
      res.status(200).json({ data: rate });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


app.put('/api/updaterate/:rate_type', async (req, res) => {
  try {
    const { rate_type } = req.params;
    const updatedRate = await Rate.findOneAndUpdate(
      { rate_type },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRate) {
      return res.status(404).json({ message: 'Rate not found' });
    }

    res.status(200).json({ message: 'Rate Updated', data: updatedRate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



//Tokens

app.post('/api/createtoken', async (req, res)=>{
    try {
        const token = await Token.create(req.body);
        res.status(200).json({message: "Token added Successfully"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});


app.get('/api/getalltokens', async (req, res)=>{
    try {
        const token = await Token.find({});
        res.status(200).json(token)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
});


app.get('/api/getbytokentag/:token_tag', async (req, res) => {
    try {
      const { token_tag } = req.params;
      const token = await Token.findOne({ token_tag });
  
      if (!token) {
        return res.status(404).json({ message: 'Token not found' });
      }
  
      res.status(200).json(token); // Send the token data back to the client
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  app.put('/api/updatetoken/:token_tag', async (req, res) => {
    try {
      const { token_tag } = req.params;
      const updateData = req.body;
  
      // Find the token by token_tag and update it
      const updatedToken = await Token.findOneAndUpdate(
        { token_tag },
        updateData,
        { new: true, runValidators: true }
      );
  
      if (!updatedToken) {
        return res.status(404).json({ message: 'Token not found' });
      }
  
      res.status(200).json({ message: 'Token updated successfully', data: updatedToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  









app.get('/', (req, res) => {
    res.send("Hello from the Node API New update")
});

mongoose.connect('mongodb+srv://inviciblewlbe:KxiJ0LT7kg3ZT9cJ@wlbedb.ujcqlmh.mongodb.net/?retryWrites=true&w=majority&appName=wlbedb')
  .then(() => console.log('Connected!'));
