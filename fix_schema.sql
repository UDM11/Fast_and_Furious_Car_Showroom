-- ============================================================
-- FIXES — Run in Supabase SQL Editor
-- ============================================================

-- STEP 1: Drop ALL policies that reference user_id FIRST
DROP POLICY IF EXISTS "bookings_user_read"   ON public.test_drive_bookings;
DROP POLICY IF EXISTS "bookings_insert_auth" ON public.test_drive_bookings;
DROP POLICY IF EXISTS "bookings_update_admin" ON public.test_drive_bookings;

-- STEP 2: Drop foreign key constraints
ALTER TABLE public.test_drive_bookings
  DROP CONSTRAINT IF EXISTS test_drive_bookings_car_id_fkey;

ALTER TABLE public.test_drive_bookings
  DROP CONSTRAINT IF EXISTS test_drive_bookings_user_id_fkey;

-- STEP 3: Change column types to text
ALTER TABLE public.test_drive_bookings
  ALTER COLUMN car_id TYPE text USING car_id::text;

ALTER TABLE public.test_drive_bookings
  ALTER COLUMN user_id TYPE text USING user_id::text;

-- STEP 4: Recreate RLS policies
CREATE POLICY "bookings_insert_auth" ON public.test_drive_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "bookings_user_read" ON public.test_drive_bookings
  FOR SELECT USING (
    user_id = auth.uid()::text
    OR (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "bookings_update_admin" ON public.test_drive_bookings
  FOR UPDATE USING (
    user_id = auth.uid()::text
    OR (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin'
  );
