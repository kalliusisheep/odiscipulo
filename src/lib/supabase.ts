import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://SEU_PROJETO.supabase.co';
const supabaseAnonKey = 'SUA_CHAVE_ANON';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);