import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY || 'http://localhost:8080/api';

function App() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  
  const [newPatient, setNewPatient] = useState('');
  const [patientIdForAppt, setPatientIdForAppt] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const u = await axios.get(`${API_GATEWAY}/users`);
      setUsers(u.data);
      const a = await axios.get(`${API_GATEWAY}/appointments`);
      setAppointments(a.data);
      const q = await axios.get(`${API_GATEWAY}/queue`);
      setQueue(q.data);
    } catch (e) {
      console.log('Error fetching data (API Gateway may not be running yet)');
    }
  };

  const registerUser = async () => {
    await axios.post(`${API_GATEWAY}/users`, { name: newPatient, role: 'Patient', email: newPatient+'@test.com' });
    setNewPatient('');
    fetchData();
  };

  const bookAppt = async () => {
    await axios.post(`${API_GATEWAY}/appointments`, { patientId: patientIdForAppt, doctorId: 'Dr. Smith', date: new Date().toISOString() });
    setPatientIdForAppt('');
    fetchData();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🏥 Medical Appointment System Dashboard</h1>
      <button onClick={fetchData}>Refresh Data</button>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid black', padding: '10px', width: '30%' }}>
          <h2>1. Users (Admin view)</h2>
          <input value={newPatient} onChange={(e) => setNewPatient(e.target.value)} placeholder="Patient Name" />
          <button onClick={registerUser}>Register</button>
          <ul>{users.map(u => <li key={u._id}>{u.name} ({u.role})</li>)}</ul>
        </div>

        <div style={{ border: '1px solid black', padding: '10px', width: '30%' }}>
          <h2>2. Book Appointment</h2>
          <input value={patientIdForAppt} onChange={(e) => setPatientIdForAppt(e.target.value)} placeholder="Patient ID / Name" />
          <button onClick={bookAppt}>Book</button>
          <ul>{appointments.map(a => <li key={a._id}>{a.patientId} - {a.doctorId}</li>)}</ul>
        </div>

        <div style={{ border: '1px solid black', padding: '10px', width: '30%' }}>
          <h2>3. Live Queue Status</h2>
          <ul>{queue.map(q => <li key={q._id}>Appt ID: {q.appointmentId} | Status: <b>{q.status}</b></li>)}</ul>
        </div>
      </div>
    </div>
  );
}

export default App;
