const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27019/queueDb';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Queue Service Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const queueEntrySchema = new mongoose.Schema({
  patientId: String,
  patientName: String,
  appointmentId: String,
  queueNumber: Number,
  status: { type: String, default: 'waiting' } // waiting, calling, completed
});

const QueueEntry = mongoose.model('QueueEntry', queueEntrySchema);

app.get('/health', (req, res) => res.status(200).send('Queue Service OK'));

app.post('/queue/join', async (req, res) => {
  const count = await QueueEntry.countDocuments();
  const entry = new QueueEntry({ ...req.body, queueNumber: count + 1 });
  await entry.save();
  res.status(201).json(entry);
});

app.get('/queue', async (req, res) => {
  const queue = await QueueEntry.find().sort({ queueNumber: 1 });
  res.json(queue);
});

app.listen(PORT, () => console.log(`Queue Service running on port ${PORT}`));
