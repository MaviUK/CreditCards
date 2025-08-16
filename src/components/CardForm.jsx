import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function CardForm({ user, onSaved }) {
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')
  const [available, setAvailable] = useState('')
  const [limit, setLimit] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.from('CreditCards').insert([{
      user_id: user.id,
      name,
      balance: parseFloat(balance),
      available_credit: parseFloat(available),
      total_limit: parseFloat(limit),
      last_payment_date: null
    }])

    if (error) setError(error.message)
    else {
      setName('')
      setBalance('')
      setAvailable('')
      setLimit('')
      onSaved()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Credit Card</h3>
      <input placeholder="Card Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Balance" type="number" value={balance} onChange={e => setBalance(e.target.value)} required />
      <input placeholder="Available Credit" type="number" value={available} onChange={e => setAvailable(e.target.value)} required />
      <input placeholder="Total Limit" type="number" value={limit} onChange={e => setLimit(e.target.value)} required />
      <button type="submit">Save Card</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  )
}
