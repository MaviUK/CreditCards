import React, { useState } from "react";

const App = () => {
  const [cards, setCards] = useState([
    { id: 1, name: "Barclaycard", balance: 1200, apr: 29.9, dueDate: "2025-08-25" },
    { id: 2, name: "Amex", balance: 600, apr: 22.4, dueDate: "2025-08-18" },
  ]);

  const [payments, setPayments] = useState([]);
  const [chargedCard, setChargedCard] = useState("");
  const [paidCard, setPaidCard] = useState("");
  const [amount, setAmount] = useState("");

  const [newCard, setNewCard] = useState({
    name: "",
    balance: "",
    apr: "",
    dueDate: ""
  });

  const terminalFee = (amt) => +(amt * 0.015 + 0.2).toFixed(2);

  const handleAddCard = () => {
    if (!newCard.name || !newCard.balance || !newCard.apr || !newCard.dueDate) return;

    const card = {
      id: Date.now(),
      name: newCard.name,
      balance: parseFloat(newCard.balance),
      apr: parseFloat(newCard.apr),
      dueDate: newCard.dueDate,
    };

    setCards([...cards, card]);
    setNewCard({ name: "", balance: "", apr: "", dueDate: "" });
  };

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

      {/* Add New Card Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Card Name"
            value={newCard.name}
            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Balance (£)"
            value={newCard.balance}
            onChange={(e) => setNewCard({ ...newCard, balance: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="APR (%)"
            value={newCard.apr}
            onChange={(e) => setNewCard({ ...newCard, apr: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newCard.dueDate}
            onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button onClick={handleAddCard} className="bg-green-600 text-white px-4 py-2 rounded">
          Add Card
        </button>
      </div>

      {/* Card List */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  {cards.map((card) => (
    <div key={card.id} className="bg-white p-4 rounded-xl shadow relative">
      <button
        onClick={() => setCards(cards.filter(c => c.id !== card.id))}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
        title="Delete card"
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold">{card.name}</h2>
      <p>Balance: £{card.balance.toFixed(2)}</p>
      <p>APR: {card.apr}%</p>
      <p>Due Date: {card.dueDate}</p>
    </div>
  ))}
</div>


      {/* Payment Logger */}
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

      {/* Summary */}
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
