import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [chain, setChain] = useState([]);
  const [formData, setFormData] = useState({ name: '', crop: '', amount: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChain();
  }, []);

  const fetchChain = async () => {
    const res = await axios.get('http://localhost:5000/chain');
    setChain(res.data.chain);
  };

  const handleAddFarmer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Add record to pending
      await axios.post('http://localhost:5000/add_farmer', formData);
      // 2. Mine the block immediately for this demo
      await axios.get('http://localhost:5000/mine');
      fetchChain();
      setFormData({ name: '', crop: '', amount: '' });
    } catch (err) {
      console.error("Error updating blockchain", err);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🚜 Farmer Blockchain Ledger</h1>
      
      <div className="card">
        <h3>Add New Harvest Record</h3>
        <form onSubmit={handleAddFarmer}>
          <input 
            type="text" placeholder="Farmer Name" value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})} required 
          />
          <input 
            type="text" placeholder="Crop Type" value={formData.crop}
            onChange={(e) => setFormData({...formData, crop: e.target.value})} required 
          />
          <input 
            type="number" placeholder="Yield (kg)" value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})} required 
          />
          <button type="submit" disabled={loading}>
            {loading ? "Mining Block..." : "Secure Data to Blockchain"}
          </button>
        </form>
      </div>

      <div className="ledger-section">
        <h3>Verified Blockchain Nodes</h3>
        {chain.map((block) => (
          <div key={block.index} className="block-card">
            <div className="block-header">Block #{block.index}</div>
            <p><strong>Hash:</strong> <span className="hash">{block.previous_hash}</span></p>
            <div className="records">
              {block.records.length > 0 ? (
                block.records.map((r, i) => (
                  <div key={i} className="record-item">
                    🌾 {r.farmer_name} | {r.crop} | {r.amount_kg}kg
                  </div>
                ))
              ) : <em>Genesis Block - No Records</em>}
            </div>
            <div className="timestamp">Time: {new Date(block.timestamp * 1000).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;