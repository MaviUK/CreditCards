import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let res
    if (isSignUp) {
      res = await supabase.auth.signUp({ email, password })
    } else {
      res = await supabase.auth.signInWithPassword({ email, password })
    }

    if (res.error) setError(res.error.message)
    else onLogin()
    setLoading(false)
  }

  return (
    <div>
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Login' : 'Create an account'}
      </button>
    </div>
  )
}
