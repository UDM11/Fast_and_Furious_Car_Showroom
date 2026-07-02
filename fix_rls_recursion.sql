-- ============================================================
-- COMPLETE FIX — Run in Supabase SQL Editor
-- ============================================================

-- STEP 1: Drop the is_admin function if it exists (recreate cleanly)
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- STEP 2: Create SECURITY DEFINER function — bypasses RLS to avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- STEP 3: Drop ALL policies on user_profiles
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles' LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.user_profiles';
  END LOOP;
END $$;


-- STEP 4: Recreate user_profiles policies (no inline subqueries)
CREATE POLICY "profiles_select" ON public.user_profiles
  FOR SELECT USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_insert" ON public.user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update" ON public.user_profiles
  FOR UPDATE USING (id = auth.uid() OR public.is_admin());

-- STEP 5: Drop ALL policies on test_drive_bookings
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'test_drive_bookings' LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.test_drive_bookings';
  END LOOP;
END $$;


-- STEP 6: Recreate test_drive_bookings policies
CREATE POLICY "bookings_insert" ON public.test_drive_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "bookings_select" ON public.test_drive_bookings
  FOR SELECT USING (user_id = auth.uid()::text OR public.is_admin());

CREATE POLICY "bookings_update" ON public.test_drive_bookings
  FOR UPDATE USING (user_id = auth.uid()::text OR public.is_admin());

-- STEP 7: Drop ALL policies on cars
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'cars' LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.cars';
  END LOOP;
END $$;


-- STEP 8: Recreate cars policies
-- Anyone can read cars (public inventory)
CREATE POLICY "cars_select" ON public.cars
  FOR SELECT USING (true);

-- Anyone can insert (needed for seeding from frontend)
CREATE POLICY "cars_insert" ON public.cars
  FOR INSERT WITH CHECK (true);

-- Only admin can update/delete
CREATE POLICY "cars_update" ON public.cars
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "cars_delete" ON public.cars
  FOR DELETE USING (public.is_admin());

-- STEP 9: Drop ALL policies on favorites
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'favorites' LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.favorites';
  END LOOP;
END $$;


-- STEP 10: Recreate favorites policies
CREATE POLICY "favorites_select" ON public.favorites
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "favorites_insert" ON public.favorites
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "favorites_delete" ON public.favorites
  FOR DELETE USING (user_id = auth.uid());
