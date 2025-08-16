import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function Dashboard({ user }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCard, setNewCard] = useState({
    name: "",
    balance: 0,
    available: 0,
    credit_limit: 0,
  });

  useEffect(() => {
    // define fetchCards inside useEffect to avoid missing dependency warning
    const fetchCards = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        alert(error.message);
      } else {
        setCards(data);
      }
      setLoading(false);
    };

    fetchCards();
  }, [user.id]); // include user.id so it refetches if user changes

  const addCard = async () => {
    const { error } = await supabase.from("cards").insert([
      { ...newCard, user_id: user.id },
    ]);
    if (error) {
      alert(error.message);
    } else {
      setNewCard({ name: "", balance: 0, available: 0, credit_limit: 0 });
      // refetch cards after adding
      const { data, error: fetchError } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (fetchError) alert(fetchError.message);
      else setCards(data);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.email}</h2>

      <h3>Add New Card</h3>
      <input
        placeholder="Card Name"
        value={newCard.name}
        onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Balance"
        value={newCard.balance}
        onChange={(e) =>
          setNewCard({ ...newCard, balance: parseFloat(e.target.value) })
        }
      />
      <input
        type="number"
        placeholder="Available Credit"
        value={newCard.available}
        onChange={(e) =>
          setNewCard({ ...newCard, available: parseFloat(e.target.value) })
        }
      />
      <input
        type="number"
        placeholder="Total Credit Limit"
        value={newCard.credit_limit}
        onChange={(e) =>
          setNewCard({ ...newCard, credit_limit: parseFloat(e.target.value) })
        }
      />
      <button onClick={addCard}>Add Card</button>

      <h3>Your Cards</h3>
      {loading ? (
        <p>Loading...</p>
      ) : cards.length === 0 ? (
        <p>No cards added yet.</p>
      ) : (
        <ul>
          {cards.map((card) => (
            <li key={card.id}>
              {card.name} - Balance: £{card.balance} - Available: £{card.available} - Limit: £{card.credit_limit}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
