import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";

const App = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCard, setNewCard] = useState({
    name: "",
    balance: "",
    available: "",
    apr: "",
    dueDate: ""
  });

  const [payments, setPayments] = useState([]);
  const [chargedCard, setChargedCard] = useState("");
  const [paidCard, setPaidCard] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch cards from Supabase on load
  useEffect(() => {
    async function fetchCards() {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error loading cards:", error.message);
      else setCards(data);

      setLoading(false);
    }

    fetchCards();
  }, []);

  const terminalFee = (amt) => +(amt * 0.015 + 0.2).toFixed(2);

  const handleAddCard = async () => {
    const { name, balance, available, apr, dueDate } = newCard;
    if (!name || !balance || !available || !apr || !dueDate) return;

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      alert("User must be logged in to save cards.");
      return;
    }

    const { data, error } = await supabase
      .from("cards")
      .insert([
        {
          user_id: user.data.user.id,
          card_name: name,
          balance: parseFloat(balance),
          available: parseFloat(available),
          apr: parseFloat(apr),
          due_date: dueDate,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding card:", error.message);
    } else {
      setCards([data[0], ...cards]);
      setNewCard({ name: "", balance: "", available: "", apr: "", dueDate: "" });
    }
  };

  const handleDeleteCard = async (id) => {
    const { error } = await supabase.from("cards").delete().eq("id", id);
    if (error) {
      console.error("Error deleting card:", error.message);
    } else {
      setCards(cards.filter((card) => card.id !== id));
    }
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
            placeholder="Available (£)"
            value={newCard.available}
            onChange={(e) => setNewCard({ ...newCard, available: e.target.value })}
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
      {loading ? (
        <p className="text-center">Loading cards...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {cards.map((card) => (
            <div key={card.id} className="bg-white p-4 rounded-xl shadow relative">
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="absolute top-2 right-2 bg-red-100 hover:bg-red-300 text-red-700 font-bold px-2 py-1 rounded"
                title="Delete this card"
              >
                🗑️
              </button>
              <h2 className="text-xl font-semibold">{card.card_name}</h2>
              <p>Balance: £{parseFloat(card.balance).toFixed(2)}</p>
              <p>Available: £{parseFloat(card.available).toFixed(2)}</p>
              <p>Credit Limit: £{(parseFloat(card.balance) + parseFloat(card.available)).toFixed(2)}</p>
              <p>APR: {card.apr}%</p>
              <p>Due Date: {card.due_date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Payment Logger */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Log a Payment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select value={chargedCard} onChange={(e) => setChargedCard(e.target.value)} className="p-2 border rounded">
            <option value="">Card Charged (Terminal)</option>
            {cards.map((c) => <option key={c.id} value={c.card_name}>{c.card_name}</option>)}
          </select>

          <select value={paidCard} onChange={(e) => setPaidCard(e.target.value)} className="p-2 border rounded">
            <option value="">Card Paid Off</option>
            {cards.map((c) => <option key={c.id} value={c.card_name}>{c.card_name}</option>)}
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
