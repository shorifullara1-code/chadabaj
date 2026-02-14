
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://panrwvxhbypjxylhfvip.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhbnJ3dnhoYnlwanh5bGhmdmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzEyMDEsImV4cCI6MjA4NjY0NzIwMX0.OXUXB9GxpX9PjD5HQuowkKFVRiONQ0JPo6wtIn8ronw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
