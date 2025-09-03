import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jyxokmbdwsaaikghhxxw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5eG9rbWJkd3NhYWlrZ2hoeHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjA1NDIsImV4cCI6MjA3MjQ5NjU0Mn0.LI8ipkncHO50oNv96fPh3cWYirx3b-aeFZKcWc_7t74'
export const supabase = createClient(supabaseUrl, supabaseKey)
