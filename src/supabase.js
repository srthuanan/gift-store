import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yuprzftcvawqybjixkmt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cHJ6ZnRjdmF3cXliaml4a210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzQ5MjksImV4cCI6MjA5OTMxMDkyOX0.6veKPAL05Ge24yhHxuZUHZXB-YVVMSTAgN1kZYgf1qQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
