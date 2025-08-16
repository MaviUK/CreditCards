import React, { useEffect, useCallback, useState, useContext } from "react";
import { supabase } from "./supabaseClient";
import { AuthContext } from "./AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [cards, setCards] = useState([]);

  const fetchCards = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cards:", error);
    } else {
      setCards(data);
    }
  }, [user]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]); // useEffect dependency fixed

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <ul>
        {cards.map((card) => (
          <li key={card.id}>
            {card.name} - Balance: £{card.balance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
