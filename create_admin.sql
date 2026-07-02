-- ============================================================
-- Fast & Furious — Create Admin Account
-- Run in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Step 1: Create the user via Supabase Auth API (recommended)
-- Go to: Supabase Dashboard → Authentication → Users → "Add user" button
-- Set Email:    admin@fastandfurious.com
-- Set Password: Admin@FF2024!
-- Click "Create user"
-- Then run Step 2 below.

-- ─────────────────────────────────────────────────────────────
-- Step 2: Set the role to admin in user_profiles
-- (Run this AFTER creating the user in the Auth UI above)
-- ─────────────────────────────────────────────────────────────
UPDATE public.user_profiles
SET role = 'admin',
    name = 'Showroom Admin'
WHERE email = 'admin@fastandfurious.com';

-- ─────────────────────────────────────────────────────────────
-- If the row doesn't exist yet in user_profiles, run this instead:
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.user_profiles (id, name, email, phone, role)
SELECT
    id,
    'Showroom Admin',
    email,
    '',
    'admin'
FROM auth.users
WHERE email = 'admin@fastandfurious.com'
ON CONFLICT (id) DO UPDATE
    SET role = 'admin',
        name = 'Showroom Admin';
