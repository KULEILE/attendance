import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AttendanceForm from './components/AttendanceForm';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRecordAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            Mark Attendance
          </button>
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            View Records
          </button>
        </div>

        {activeTab === 'form' ? (
          <AttendanceForm onRecordAdded={handleRecordAdded} />
        ) : (
          <Dashboard key={refreshKey} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;