import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or key is missing in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDueDates() {
  const { data: cards, error } = await supabase
    .from('cards')
    .select('id, due_date')
    .lte('due_date', new Date().toISOString().split('T')[0]);

  if (error) {
    console.error('Error fetching cards:', error);
    return;
  }

  for (const card of cards) {
    const newDueDate = new Date(card.due_date);
    newDueDate.setMonth(newDueDate.getMonth() + 1);

    const { error: updateError } = await supabase
      .from('cards')
      .update({ due_date: newDueDate.toISOString().split('T')[0] })
      .eq('id', card.id);

    if (updateError) {
      console.error(`Error updating card ${card.id}:`, updateError);
    } else {
      console.log(`Updated card ${card.id} due date to ${newDueDate.toISOString().split('T')[0]}`);
    }
  }
}

updateDueDates();
