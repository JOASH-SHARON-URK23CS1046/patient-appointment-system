const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5004;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27020/notificationsDb';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Notification Service Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const notificationSchema = new mongoose.Schema({
  patientId: String,
  message: String,
  sentAt: { type: Date, default: Date.now },
  status: { type: String, default: 'sent' }
});

const Notification = mongoose.model('Notification', notificationSchema);

app.get('/health', (req, res) => res.status(200).send('Notification Service OK'));

app.post('/notifications/send', async (req, res) => {
  const notification = new Notification(req.body);
  await notification.save();
  console.log(`Notification sent to ${req.body.patientId}: ${req.body.message}`);
  res.status(201).json(notification);
});

app.get('/notifications', async (req, res) => {
  const notifications = await Notification.find();
  res.json(notifications);
});

app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));
