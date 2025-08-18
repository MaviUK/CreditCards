import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient.js";

function App() {
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState("");
  const [balance, setBalance] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [dueDate, setDueDate] = useState(""); // ← NEW
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingBalance, setEditingBalance] = useState("");
  const [editingLimit, setEditingLimit] = useState("");
  const [editingDueDate, setEditingDueDate] = useState(""); // ← NEW

  // Totals
  const totalBalance = cards.reduce((sum, c) => sum + parseFloat(c.balance), 0);
  const totalLimit = cards.reduce((sum, c) => sum + parseFloat(c.credit_limit), 0);
  const totalAvailable = totalLimit - totalBalance;
  const totalUsedPercent = totalLimit ? (totalBalance / totalLimit) * 100 : 0;

  // Fetch cards from Supabase
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) console.log("Error fetching cards:", error);
    else setCards(data);
  };

  // Add Card
  const addCard = async () => {
    if (!cardName || balance === "" || creditLimit === "" || !dueDate) return;

    const { data, error } = await supabase
      .from("cards")
      .insert([
        {
          name: cardName,
          balance: parseFloat(balance),
          credit_limit: parseFloat(creditLimit),
          due_date: dueDate, // ← NEW
        },
      ])
      .select();

    if (error) console.log("Error adding card:", error);
    else setCards([...cards, ...data]);

    setCardName("");
    setBalance("");
    setCreditLimit("");
    setDueDate(""); // ← CLEAR
  };

  // Delete Card
  const deleteCard = async (id) => {
    const { error } = await supabase.from("cards").delete().eq("id", id);
    if (error) console.log("Error deleting card:", error);
    else setCards(cards.filter((card) => card.id !== id));
  };

  // Start Editing
  const startEdit = (card) => {
    setEditingId(card.id);
    setEditingName(card.name);
    setEditingBalance(card.balance);
    setEditingLimit(card.credit_limit);
    setEditingDueDate(card.due_date || ""); // ← NEW
  };

  // Save Edit
  const saveEdit = async (id) => {
    const { data, error } = await supabase
      .from("cards")
      .update({
        name: editingName,
        balance: parseFloat(editingBalance),
        credit_limit: parseFloat(editingLimit),
        due_date: editingDueDate, // ← NEW
        updated_at: new Date(),
      })
      .eq("id", id)
      .select();

    if (error) console.log("Error updating card:", error);
    else {
      setCards(cards.map((card) => (card.id === id ? data[0] : card)));
      setEditingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Credit Card Cycler</h1>

      {/* Add Card Form */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add a Credit Card</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Card Name"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Balance (£)"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Credit Limit (£)"
            value={creditLimit}
            onChange={(e) => setCreditLimit(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date" // ← NEW
            value={dueDate} // ← NEW
            onChange={(e) => setDueDate(e.target.value)} // ← NEW
            className="w-full p-2 border rounded"
          />
          <button
            onClick={addCard}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
          >
            Add Card
          </button>
        </div>
      </div>

      {/* Totals Bar */}
      {cards.length > 0 && (
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-white rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Credit Overview</h2>

          {/* USED CREDIT BAR */}
          <div>
            <p className="text-gray-600 font-medium mb-1">Total Credit Used</p>
            <div className="w-full bg-gray-200 h-6 rounded-full">
              <div
                className={`h-6 rounded-full ${
                  totalUsedPercent > 90
                    ? "bg-red-500"
                    : totalUsedPercent > 70
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{ width: `${totalUsedPercent}%` }}
              ></div>
            </div>
            <p className="text-gray-600 mt-1 font-medium">
              £{totalBalance.toFixed(2)} / £{totalLimit.toFixed(2)} used (
              {totalUsedPercent.toFixed(1)}%)
            </p>
          </div>

          {/* AVAILABLE CREDIT BAR */}
          <div>
            <p className="text-gray-600 font-medium mb-1">Total Credit Available</p>
            <div className="w-full bg-gray-200 h-6 rounded-full">
              <div
                className="h-6 rounded-full bg-blue-500"
                style={{
                  width: `${totalLimit ? (totalAvailable / totalLimit) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <p className="text-gray-600 mt-1 font-medium">
              £{totalAvailable.toFixed(2)} available
            </p>
          </div>
        </div>
      )}

      {/* Card List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            {editingId === card.id ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full p-1 border rounded"
                />
                <input
                  type="number"
                  value={editingBalance}
                  onChange={(e) => setEditingBalance(e.target.value)}
                  className="w-full p-1 border rounded"
                />
                <input
                  type="number"
                  value={editingLimit}
                  onChange={(e) => setEditingLimit(e.target.value)}
                  className="w-full p-1 border rounded"
                />
                <input
                  type="date"
                  value={editingDueDate} // ← NEW
                  onChange={(e) => setEditingDueDate(e.target.value)} // ← NEW
                  className="w-full p-1 border rounded"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => saveEdit(card.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div
