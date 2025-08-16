import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Cards({ user }) {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState({ name: '', balance: '', available: '', total_limit: '' });

  // Fetch cards
  const fetchCards = async () => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) console.error(error);
    else setCards(data);
  };

  useEffect(() => {
    if (user) fetchCards();
  }, [user]);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new card
  const handleAddCard = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('cards').insert([
      {
        user_id: user.id,
        name: form.name,
        balance: parseFloat(form.balance),
        available: parseFloat(form.available),
        total_limit: parseFloat(form.total_limit),
      },
    ]);

    if (error) console.error(error);
    else {
      setCards([...cards, data[0]]);
      setForm({ name: '', balance: '', available: '', total_limit: '' });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Cards</h1>

      <form onSubmit={handleAddCard} className="mb-6 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Card Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="balance"
          placeholder="Balance"
          value={form.balance}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="available"
          placeholder="Available Credit"
          value={form.available}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="total_limit"
          placeholder="Total Limit"
          value={form.total_limit}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Add Card
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Balance</th>
            <th className="border p-2">Available</th>
            <th className="border p-2">Total Limit</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.id}>
              <td className="border p-2">{card.name}</td>
              <td className="border p-2">{card.balance}</td>
              <td className="border p-2">{card.available}</td>
              <td className="border p-2">{card.total_limit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
