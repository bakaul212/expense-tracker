import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Text } from 'recharts';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const localData = localStorage.getItem('transactions');
    return localData ? JSON.parse(localData) : [];
  });

  // State Management
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); 
  const [category, setCategory] = useState('Bills');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [filterCategory, setFilterCategory] = useState('All'); 
  const [budgetLimit, setBudgetLimit] = useState(() => { 
    const localBudget = localStorage.getItem('budgetLimit');
    return localBudget ? parseFloat(localBudget) : 0;
  });
  const [budgetInput, setBudgetInput] = useState('');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgetLimit', budgetLimit);
  }, [budgetLimit]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!text || !amount) return alert('Please fill out all fields!');

    // Date and time formatted to English standard
    const now = new Date();
    const dateTimeString = now.toLocaleDateString('en-US') + ' | ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newTransaction = {
      id: Date.now(),
      text,
      amount: parseFloat(amount),
      type,
      category: type === 'income' ? 'Income' : category,
      date: dateTimeString 
    };

    setTransactions([newTransaction, ...transactions]);
    setText('');
    setAmount('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const clearAllTransactions = () => {
    if (window.confirm('Are you sure you want to delete all transaction history?')) {
      setTransactions([]);
    }
  };

  const handleSetBudget = (e) => {
    e.preventDefault();
    if (!budgetInput || isNaN(budgetInput)) return alert('Please enter a valid budget amount!');
    setBudgetLimit(parseFloat(budgetInput));
    setBudgetInput('');
  };

  // Calculations
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  // Search and Filter Logic
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === 'All' || t.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const chartData = expenseTransactions.reduce((acc, current) => {
    const found = acc.find((item) => item.name === current.category);
    if (found) {
      found.value += current.amount;
    } else {
      acc.push({ name: current.category, value: current.amount });
    }
    return acc;
  }, []);

  const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B056F1'];

  // UI Theme Styling
  const cardStyle = {
    backgroundColor: '#30344c',
    color: '#fff',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #4a4e69',
    boxSizing: 'border-box',
    backgroundColor: '#2a2e45',
    color: '#fff',
    fontSize: '14px'
  };

  const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#FF6B6B', marginLeft: '10px'}}>
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  return (
    <div style={{ backgroundColor: '#1d2138', minHeight: '100vh', padding: '30px 0' }}>
      <div style={{ maxWidth: '950px', margin: '0 auto', padding: '0 20px', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#fff', fontSize: '32px', margin: '0', fontWeight: 'bold' }}>
            📊 Advanced Expense Tracker
          </h1>
        </div>

        {/* Budget Alert Notification */}
        {budgetLimit > 0 && expense > budgetLimit && (
          <div style={{ backgroundColor: '#FF6B6B', color: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '20px', fontWeight: 'bold', textAlign: 'center', boxShadow: '0 4px 15px rgba(255,107,107,0.4)' }}>
            ⚠️ Warning: You have exceeded your budget limit of ৳{budgetLimit}! Current Expense: ৳{expense}
          </div>
        )}
        
        {/* Top Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
          <div style={{ ...cardStyle, backgroundImage: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#1d2138', textAlign: 'center', padding: '20px 10px' }}>
            <h4 style={{ margin: '0 0 5px', fontSize: '14px', fontWeight: 'bold' }}>Net Balance</h4>
            <h2 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>৳{balance}</h2>
          </div>
          <div style={{ ...cardStyle, textAlign: 'center', padding: '20px 10px' }}>
            <h4 style={{ margin: '0 0 5px', fontSize: '14px', color: '#aaa' }}>Total Income</h4>
            <h2 style={{ margin: '0', color: '#6BCB77', fontSize: '26px', fontWeight: 'bold' }}>৳{income}</h2>
          </div>
          <div style={{ ...cardStyle, textAlign: 'center', padding: '20px 10px' }}>
            <h4 style={{ margin: '0 0 5px', fontSize: '14px', color: '#aaa' }}>Total Expense</h4>
            <h2 style={{ margin: '0', color: '#FF6B6B', fontSize: '26px', fontWeight: 'bold' }}>৳{expense}</h2>
          </div>
          <div style={{ ...cardStyle, textAlign: 'center', padding: '20px 10px', border: budgetLimit > 0 && expense > budgetLimit ? '2px solid #FF6B6B' : 'none' }}>
            <h4 style={{ margin: '0 0 5px', fontSize: '14px', color: '#aaa' }}>Budget Limit</h4>
            <h2 style={{ margin: '0', color: '#FFD93D', fontSize: '26px', fontWeight: 'bold' }}>{budgetLimit > 0 ? `৳${budgetLimit}` : 'Not Set'}</h2>
          </div>
        </div>

        {/* Middle Section: Forms & Chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          
          {/* Action Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Add Transaction */}
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 15px', fontSize: '18px', borderBottom: '1px solid #4a4e69', paddingBottom: '8px' }}>Add New Transaction</h3>
              <form onSubmit={handleAddTransaction}>
                <input type="text" placeholder="Description (e.g., Grocery, Salary)" value={text} onChange={(e) => setText(e.target.value)} style={inputStyle} />
                <input type="number" placeholder="Amount (৳)" value={amount} onChange={(e) => setAmount(e.target.value)} style={inputStyle} />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>

                  {type === 'expense' && (
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                      <option value="Food">🍔 Food</option>
                      <option value="Rent">🏠 Rent</option>
                      <option value="Shopping">🛍️ Shopping</option>
                      <option value="Bills">💡 Bills</option>
                      <option value="Others">📦 Others</option>
                    </select>
                  )}
                </div>

                <button type="submit" style={{ width: '100%', padding: '12px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Transaction</button>
              </form>
            </div>

            {/* Set Budget Limit */}
            <div style={{ ...cardStyle, padding: '20px' }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '18px' }}>🎯 Set Monthly Budget</h3>
              <form onSubmit={handleSetBudget} style={{ display: 'flex', gap: '10px' }}>
                <input type="number" placeholder="Budget Amount (৳)" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} style={{ ...inputStyle, marginBottom: '0' }} />
                <button type="submit" style={{ padding: '0 20px', background: '#FFD93D', color: '#1d2138', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Set</button>
              </form>
            </div>
          </div>

          {/* Chart Card */}
          <div style={{ ...cardStyle, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 15px', fontSize: '18px' }}>Expense Breakdown (Donut Chart)</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" cornerRadius={4}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                    <Text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '20px', fill: '#fff', fontWeight: 'bold' }}>
                      ৳{expense}
                    </Text>
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#2a2e45', border: 'none', borderRadius: '8px', color: '#fff' }} formatter={(value) => `৳${value}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: '#888', padding: '50px 0' }}>No expense records found!</p>
            )}
          </div>
        </div>

        {/* Bottom Section: Search, Filter & History */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #4a4e69', paddingBottom: '15px' }}>
            <h3 style={{ margin: '0', fontSize: '20px' }}>Transaction History</h3>
            
            {/* Search & Filter Controls */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input type="text" placeholder="🔍 Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, width: '160px', marginBottom: '0', padding: '8px 12px' }} />
              
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ ...inputStyle, width: '140px', marginBottom: '0', padding: '8px 12px' }}>
                <option value="All">All Categories</option>
                <option value="Income">Income</option>
                <option value="Food">🍔 Food</option>
                <option value="Rent">🏠 Rent</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Bills">💡 Bills</option>
                <option value="Others">📦 Others</option>
              </select>

              {transactions.length > 0 && (
                <button onClick={clearAllTransactions} style={{ padding: '8px 12px', background: '#FF6B6B', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* History List */}
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, maxHeight: '300px', overflowY: 'auto' }}>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', margin: '8px 0', borderRadius: '8px', backgroundColor: '#3a3e5c', borderRight: t.type === 'income' ? '6px solid #6BCB77' : '6px solid #FF6B6B' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '500' }}>{t.text} <small style={{ color: '#b0b3c5', marginLeft: '5px' }}>({t.category})</small></span>
                    <span style={{ fontSize: '11px', color: '#aaa' }}>{t.date}</span> 
                  </div>
                  <span style={{ color: t.type === 'income' ? '#6BCB77' : '#FF6B6B', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                    {t.type === 'income' ? '+' : '-'}৳{t.amount}
                    <button onClick={() => deleteTransaction(t.id)} style={{ padding: '0', background: 'none', border: 'none', cursor: 'pointer' }} title="Delete">
                      <TrashIcon />
                    </button>
                  </span>
                </li>
              ))
            ) : (
              <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>No matching records found!</p>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default App;