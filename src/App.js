import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- STYLING ---
const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };
const btnStyle = { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const cardStyle = (color) => ({ flex: 1, padding: '20px', backgroundColor: 'white', borderRadius: '10px', borderLeft: `8px solid ${color}`, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' });

function App() {
  // --- STATES ---
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ business_name: '', email: '', password: '' });
  const [stats, setStats] = useState({ revenue: 0, pending: 0, total_clients: 0 });
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]); 
  const [clientForm, setClientForm] = useState({ client_name: '', email: '' });
  const [invoiceForm, setInvoiceForm] = useState({ client_id: '', invoice_num: '', due_date: '' });
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);

  // --- DATA REFRESH LOGIC ---
  const refreshDashboard = async (userId) => {
    try {
      const cRes = await axios.get(`http://localhost/billing_api/get_clients.php?user_id=${userId}`);
      setClients(cRes.data);
      
      const sRes = await axios.get(`http://localhost/billing_api/get_stats.php?user_id=${userId}`);
      setStats(sRes.data);
      
      const iRes = await axios.get(`http://localhost/billing_api/get_invoices.php?user_id=${userId}`);
      setInvoices(iRes.data);

      // --- AUTO-INCREMENT INVOICE NUMBER ---
      if (iRes.data.length > 0) {
        const lastNum = iRes.data[0].invoice_number; 
        const numericPart = parseInt(lastNum.replace(/\D/g, '')) || 0;
        setInvoiceForm(prev => ({ ...prev, invoice_num: `INV-${String(numericPart + 1).padStart(3, '0')}` }));
      } else {
        setInvoiceForm(prev => ({ ...prev, invoice_num: 'INV-001' }));
      }
    } catch (err) { console.error("Refresh Error:", err); }
  };

  // --- HANDLERS ---
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login.php' : 'register.php';
    const res = await axios.post(`http://localhost/billing_api/${endpoint}`, formData);
    if (res.data.user) { setUser(res.data.user); refreshDashboard(res.data.user.id); }
    else { alert(res.data.error || "Action Failed"); }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost/billing_api/add_client.php', { ...clientForm, user_id: user.id });
    setClientForm({ client_name: '', email: '' });
    refreshDashboard(user.id);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'desc' ? value : parseFloat(value) || 0;
    setItems(newItems);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    const total = items.reduce((sum, i) => sum + (i.qty * i.price), 0).toFixed(2);
    await axios.post('http://localhost/billing_api/create_invoice.php', { ...invoiceForm, items, total, user_id: user.id });
    setItems([{ desc: '', qty: 1, price: 0 }]);
    setInvoiceForm(prev => ({ ...prev, client_id: '', due_date: '' }));
    refreshDashboard(user.id);
  };

  const updateStatus = async (id, currentStatus) => {
    const endpoint = currentStatus === 'Pending' ? 'update_status.php' : 'unmark_paid.php';
    await axios.post(`http://localhost/billing_api/${endpoint}`, { invoice_id: id });
    refreshDashboard(user.id);
  };

  if (user) {
    return (
      <div style={{ padding: '30px', background: '#f4f7f6', minHeight: '100vh', fontFamily: 'Segoe UI, Arial' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{user.business_name} | Tech Billing</h2>
          <button onClick={() => setUser(null)} style={{ ...btnStyle, background: '#e74c3c' }}>Logout</button>
        </div>

        {/* 1. STATS SECTION */}
        <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
          <div style={cardStyle('#2ecc71')}>
            <p style={{ margin: 0, color: '#7f8c8d' }}>Revenue (Paid)</p>
            <h2 style={{ margin: '5px 0' }}>₹{stats.revenue}</h2>
          </div>
          <div style={cardStyle('#f1c40f')}>
            <p style={{ margin: 0, color: '#7f8c8d' }}>Pending Amount</p>
            <h2 style={{ margin: '5px 0' }}>₹{stats.pending}</h2>
          </div>
          <div style={cardStyle('#3498db')}>
            <p style={{ margin: 0, color: '#7f8c8d' }}>Total Clients</p>
            <h2 style={{ margin: '5px 0' }}>{stats.total_clients}</h2>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {/* 2. CLIENT MANAGER */}
<div style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
  <h3>Manage Clients</h3>
  <form onSubmit={handleAddClient} style={{ marginBottom: '20px' }}>
    <input placeholder="Client Name" style={inputStyle} value={clientForm.client_name} onChange={e => setClientForm({...clientForm, client_name: e.target.value})} required />
    <input placeholder="Client Email" style={inputStyle} value={clientForm.email} onChange={e => setClientForm({...clientForm, email: e.target.value})} required />
    <button type="submit" style={{ ...btnStyle, width: '100%' }}>Add Client</button>
  </form>

  {/* THIS IS THE PART THAT SHOWS THE LIST */}
  <div style={{ marginTop: '10px' }}>
    <p style={{ fontWeight: 'bold', color: '#666' }}>Active Clients:</p>
    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', padding: '10px' }}>
      {clients.length === 0 ? (
        <p style={{ fontSize: '12px', color: '#999' }}>No clients added yet.</p>
      ) : (
        clients.map(c => (
          <div key={c.id} style={{ padding: '8px 0', borderBottom: '1px solid #fafafa', fontSize: '14px' }}>
            <strong>{c.client_name}</strong> <br />
            <span style={{ fontSize: '11px', color: '#888' }}>{c.email}</span>
          </div>
        ))
      )}
    </div>
  </div>
</div>
          {/* 3. INVOICE GENERATOR */}
          <div style={{ flex: 2, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3>New Invoice</h3>
            <form onSubmit={handleGenerate}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select style={inputStyle} value={invoiceForm.client_id} onChange={e => setInvoiceForm({...invoiceForm, client_id: e.target.value})} required>
                  <option value="">Select Client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.client_name}</option>)}
                </select>
                <input style={inputStyle} value={invoiceForm.invoice_num} onChange={e => setInvoiceForm({...invoiceForm, invoice_num: e.target.value})} required />
                <input type="date" style={inputStyle} value={invoiceForm.due_date} onChange={e => setInvoiceForm({...invoiceForm, due_date: e.target.value})} required />
              </div>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input placeholder="Service" style={{ flex: 3, padding: '10px' }} value={item.desc} onChange={e => updateItem(idx, 'desc', e.target.value)} required />
                  <input type="number" placeholder="Qty" style={{ flex: 1, padding: '10px' }} value={item.qty} onChange={e => updateItem(idx, 'qty', e.target.value)} required />
                  <input type="number" placeholder="Price" style={{ flex: 1, padding: '10px' }} value={item.price} onChange={e => updateItem(idx, 'price', e.target.value)} required />
                  <div style={{ flex: 1, alignSelf: 'center', fontWeight: 'bold' }}>₹{(item.qty * item.price).toFixed(2)}</div>
                </div>
              ))}
              <button type="button" onClick={() => setItems([...items, { desc: '', qty: 1, price: 0 }])} style={{ ...btnStyle, background: '#95a5a6', marginBottom: '15px' }}>+ Add Row</button>
              <div style={{ textAlign: 'right', borderTop: '2px solid #eee', paddingTop: '10px' }}>
                <h2>Total: ₹{items.reduce((sum, i) => sum + (i.qty * i.price), 0).toFixed(2)}</h2>
                <button type="submit" style={btnStyle}>Generate & Save</button>
              </div>
            </form>
          </div>
        </div>

        {/* 4. HISTORY TABLE */}
        <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3>Invoice History</h3>
          {invoices.length === 0 ? <p>No invoices yet.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Inv #</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{inv.invoice_number}</td>
                    <td>{inv.client_name}</td>
                    <td>₹{inv.total_amount}</td>
                    <td style={{ color: inv.status === 'Paid' ? '#2ecc71' : '#f1c40f', fontWeight: 'bold' }}>{inv.status}</td>
                    <td>
                      <button onClick={() => updateStatus(inv.id, inv.status)} style={{ fontSize: '12px', marginRight: '5px' }}>
                        {inv.status === 'Pending' ? 'Mark Paid' : 'Unmark'}
                      </button>
                      <button onClick={() => window.print()} style={{ fontSize: '12px', background: '#34495e', color: 'white' }}>Print</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#ecf0f1' }}>
      <div style={{ width: '350px', padding: '40px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center' }}>Billing Portal</h2>
        <form onSubmit={handleAuth}>
          {!isLogin && <input placeholder="Business Name" style={inputStyle} onChange={e => setFormData({...formData, business_name: e.target.value})} required />}
          <input type="email" placeholder="Email" style={inputStyle} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" style={inputStyle} onChange={e => setFormData({...formData, password: e.target.value})} required />
          <button type="submit" style={{ ...btnStyle, width: '100%' }}>{isLogin ? "Login" : "Register"}</button>
        </form>
        <p style={{ textAlign: 'center', cursor: 'pointer', color: '#3498db', marginTop: '15px' }} onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Create an account" : "Back to login"}</p>
      </div>
    </div>
  );
}

export default App;