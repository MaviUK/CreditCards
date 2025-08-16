import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function CardList({ user }) {
  const [cards, setCards] = useState([])

  const fetchCards = async () => {
    const { data, error } = await supabase
      .from('CreditCards')
      .select('*')
      .eq('user_id', user.id)

    if (!error) setCards(data)
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const totalAvailable = cards.reduce((acc, c) => acc + c.available_credit, 0)
  const totalBalance = cards.reduce((acc, c) => acc + c.balance, 0)

  return (
    <div>
      <h3>Your Cards</h3>
      <ul>
        {cards.map(c => (
          <li key={c.id}>
            <strong>{c.name}</strong> - Balance: {c.balance} / Available: {c.available_credit} / Limit: {c.total_limit}
          </li>
        ))}
      </ul>
      <h4>Summary</h4>
      <p>Total Balance: {totalBalance}</p>
      <p>Total Available Credit: {totalAvailable}</p>
      <p>💡 Advice: You can use available balances to pay off cards this month to minimize interest.</p>
    </div>
  )
}
