
import React, { useState } from "react";

const App = () => {
  const [cards, setCards] = useState([
    { id: 1, name: "Barclaycard", balance: 1200, available: 800, dueDate: "2025-08-25" },
    { id: 2, name: "Amex", balance: 600, available: 1400, dueDate: "2025-08-18" },
  ]);

  const [payments, setPayments] = useState([]);
  const [chargedCard, setChargedCard] = useState("");
  const [paidCard, setPaidCard] = useState("");
  const [amount, setAmount] = useState("");

  const terminalFee = (amt) => +(amt * 0.015 + 0.2).toFixed(2);

  const handleAddPayment = () => {
    if (!chargedCard || !paidCard || !amount) return;
    const fee = terminalFee(parseFloat(amount));
    setPayments([
      ...payments,
      { chargedCard, paidCard, amount: parseFloat(amount), fee }
    ]);
    setAmount("");
  };

  const totalFees = payments.reduce((acc, p) => acc + p.fee, 0);
  const totalCycled = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Credit Card Cycling Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.id} className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold">{card.name}</h2>
            <p>Balance: £{card.balance}</p>
            <p>Available: £{card.available}</p>
            <p>Due: {card.dueDate}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Log a Payment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select value={chargedCard} onChange={(e) => setChargedCard(e.target.value)} className="p-2 border rounded">
            <option value="">Card Charged (Terminal)</option>
            {cards.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>

          <select value={paidCard} onChange={(e) => setPaidCard(e.target.value)} className="p-2 border rounded">
            <option value="">Card Paid Off</option>
            {cards.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (£)"
            className="p-2 border rounded"
          />
        </div>
        <button onClick={handleAddPayment} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Payment
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Monthly Summary</h2>
        <p><strong>Total Cycled:</strong> £{totalCycled.toFixed(2)}</p>
        <p><strong>Total Terminal Fees:</strong> £{totalFees.toFixed(2)}</p>
        <p><strong>Net Debt Reduction:</strong> £{(totalCycled - totalFees).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default App;
