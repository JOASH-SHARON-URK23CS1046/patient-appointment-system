const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/appointmentsDb';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Appointment Service Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const appointmentSchema = new mongoose.Schema({
  patientId: String,
  patientName: String,
  date: String,
  time: String,
  status: { type: String, default: 'scheduled' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

app.get('/health', (req, res) => res.status(200).send('Appointment Service OK'));

app.post('/appointments/book', async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.status(201).json(appointment);
});

app.get('/appointments', async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});

app.listen(PORT, () => console.log(`Appointment Service running on port ${PORT}`));
