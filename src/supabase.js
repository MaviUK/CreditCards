import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ccuhdzcsfmpfdkegcrpa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdWhkemNzZm1wZmRrZWdjcnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNTgyODgsImV4cCI6MjA3MDkzNDI4OH0.vVxuX6rkAMPazThP8n5Um8sS09eK-JRQjOYa7zZw1so';
const { data, error } = await supabase
  .from('payments')
  .insert([{
    from_card: cardId,
    amount: 100.00,
    terminal_fee_percent: 1.75,
    terminal_fee_fixed: 0.30
  }])


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
