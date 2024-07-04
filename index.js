const express = require('express');
const mongoose = require('mongoose');
const app = express();


const cors = require('cors');

process.on('uncaughtException', (error) => {
  console.error('Unhandled Error:', error.message);
  // Handle the error here (e.g., log it, send notification, etc.)
});



app.use(cors({
  origin: 'http://localhost:3000' // Replace with your frontend origin
}));




  const userSchema = new mongoose.Schema({
    email: { type: String, required: [true, "Enter your email address"], unique: true },
    user_type: { type: String, required: false, default: "user" },
    username: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    country: { type: String, required: false, default: 'Uganda' },
    phone_number: { type: String, required: true }
  }, { timestamps: true });

  
  const User = mongoose.model('User', userSchema);
  
  
  
  


app.use(express.json());


app.listen(3002, ()=> {
    console.log('Hey PM this Backend application is running on a clean Port')
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
  
  

  









app.get('/', (req, res) => {
    res.send("Hey PM this Backend application is running on a clean Port, Let's Get to Work!!")
});

mongoose.connect('mongodb+srv://jimmygodwin371:VhnvqJrJZ64rTySU@cluster0.h6malrb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected!'));
