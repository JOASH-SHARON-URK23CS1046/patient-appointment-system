import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_GATEWAY = process.env.REACT_APP_API_GW || 'http://localhost:8080';

function App() {
  const [activeTab, setActiveTab] = useState('book');
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);

  const [form, setForm] = useState({
    patientName: '',
    date: '',
    time: ''
  });

  const loadData = async () => {
    try {
      const apptRes = await axios.get(`${API_GATEWAY}/appointments`);
      setAppointments(apptRes.data);
      const queueRes = await axios.get(`${API_GATEWAY}/queue`);
      setQueue(queueRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_GATEWAY}/appointments/book`, {
        patientId: `PAT-${Math.floor(Math.random() * 1000)}`,
        patientName: form.patientName,
        date: form.date,
        time: form.time
      });
      alert('Booked successfully!');
      
      // Auto join queue for simplicity
      await axios.post(`${API_GATEWAY}/queue/join`, {
        patientId: res.data.patientId,
        patientName: form.patientName,
        appointmentId: res.data._id
      });
      
      setForm({ patientName: '', date: '', time: '' });
      loadData();
    } catch (e) {
      alert('Error booking');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Hospital System</h1>
        <nav>
          <button onClick={() => setActiveTab('book')} className={activeTab === 'book' ? 'active' : ''}>Book Appt</button>
          <button onClick={() => setActiveTab('queue')} className={activeTab === 'queue' ? 'active' : ''}>View Queue</button>
        </nav>
      </header>

      <main>
        {activeTab === 'book' && (
          <div className="card">
            <h2>Book Appointment</h2>
            <form onSubmit={handleBook}>
              <input type="text" placeholder="Patient Name" value={form.patientName} onChange={e => setForm({...form, patientName: e.target.value})} required/>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required/>
              <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} required/>
              <button type="submit" className="primary-btn">Book Now</button>
            </form>
          </div>
        )}

        {activeTab === 'queue' && (
          <div className="card">
            <h2>Live Queue</h2>
            <div className="queue-list">
              {queue.map(q => (
                <div key={q._id} className="queue-item">
                  <span className="q-num">#{q.queueNumber}</span>
                  <span className="q-name">{q.patientName}</span>
                  <span className={`q-status ${q.status}`}>{q.status}</span>
                </div>
              ))}
              {queue.length === 0 && <p>No one in queue.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
