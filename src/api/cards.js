import { supabase } from '../supabase';

// Get cards for the logged-in user
export async function getCards() {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Add a new card
export async function addCard(card) {
  const {
    card_name,
    balance,
    available,
    apr,
    due_date,
  } = card;

  const user = supabase.auth.user();
  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from('cards')
    .insert([
      {
        user_id: user.id,
        card_name,
        balance,
        available,
        apr,
        due_date,
      }
    ]);

  if (error) throw error;
  return data[0];
}
