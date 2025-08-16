import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import CardForm from './CardForm'
import CardList from './CardList'

export default function Dashboard({ user, onLogout }) {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(user)
  }, [user])

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      <button onClick={async () => {
        await supabase.auth.signOut()
        onLogout()
      }}>Logout</button>
      <CardForm user={user} onSaved={() => {}} />
      <CardList user={user} />
    </div>
  )
}
