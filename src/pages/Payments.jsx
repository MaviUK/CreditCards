import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

export default function Payments() {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cards for this user
  const fetchCards = async () => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching cards:', error);
    else setCards(data);
  };

  // Fetch payments for this user
  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)   // assuming payments table has user_id
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching payments:', error);
    else setPayments(data);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCards();
      await fetchPayments();
      setLoading(false);
    };

    loadData();
  }, [user]);

  if (loading) return <p className="p-6">Loading your cards and payments...</p>;

  // Calculate total payments per card
  const totalPerCard = (cardId) => {
    return payments
      .filter(p => p.from_card === cardId)
      .reduce((sum, p) => sum + Number(p.amount), 0);
  };

  const totalOverall = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cards & Payments</h1>

      {cards.length === 0 && <p>You have no cards added yet.</p>}

      {cards.map(card => (
        <div key={card.id} className="border p-4 rounded mb-4 shadow">
          <h2 className="font-semibold mb-2">{card.name || 'Card'} - {card.credit_limit} total</h2>
          <p>Balance owed: £{card.balance}</p>
          <p>Available credit: £{card.available_credit}</p>
          <p>Total payments made: £{totalPerCard(card.id).toFixed(2)}</p>

          <h3 className="mt-3 font-semibold">Recent Payments:</h3>
          <ul className="list-disc list-inside">
            {payments.filter(p => p.from_card === card.id).map(p => (
              <li key={p.id}>
                £{p.amount} on {new Date(p.date).toLocaleDateString()} - {p.description || 'No description'}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h2 className="font-bold">Total Payments Across All Cards: £{totalOverall.toFixed(2)}</h2>
      </div>
    </div>
  );
}
