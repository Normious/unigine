/*
  # Fix Foreign Key Constraint Error

  1. Changes
    - Remove sample data inserts that reference non-existent auth.users
    - Keep the schema structure intact
    - Allow the application to work without sample data

  2. Notes
    - Sample data will be created through the application UI instead
    - This prevents foreign key constraint violations
*/

-- Remove any existing sample data that might cause conflicts
DELETE FROM news WHERE id IN (
  '990e8400-e29b-41d4-a716-446655440000',
  '990e8400-e29b-41d4-a716-446655440001'
);

DELETE FROM matches WHERE id = '880e8400-e29b-41d4-a716-446655440000';

DELETE FROM tournaments WHERE id IN (
  '770e8400-e29b-41d4-a716-446655440000',
  '770e8400-e29b-41d4-a716-446655440001'
);

DELETE FROM team_members WHERE team_id IN (
  '660e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440001'
);

DELETE FROM teams WHERE id IN (
  '660e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440001'
);

DELETE FROM profiles WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002'
);

-- The tables are now clean and ready for real user data
-- Users will be created through the authentication system
-- and profiles will be created automatically when users sign up