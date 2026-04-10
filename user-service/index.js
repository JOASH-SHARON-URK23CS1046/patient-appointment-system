const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/usersDb';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('User Service Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, default: 'patient' }
});

const User = mongoose.model('User', userSchema);

app.get('/health', (req, res) => res.status(200).send('User Service OK'));

app.post('/users/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
