import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signup(email, password);
    if (error) setMessage(error.message);
    else setMessage('Signup successful! Please check your email to confirm.');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
