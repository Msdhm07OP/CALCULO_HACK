-- Migration: Add Dynamic Assessment capabilities
-- Run this in Supabase SQL Editor

-- 1. Ensure assessment_forms table exists and has necessary columns
CREATE TABLE IF NOT EXISTS assessment_forms (
  id VARCHAR(50) PRIMARY KEY, -- increased length for dynamic IDs
  name VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  questions JSONB NOT NULL,
  scoring_method VARCHAR(50) DEFAULT 'sum',
  max_score INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- New columns for Dynamic Assessments
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ
);

-- 2. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessment_forms_validity ON assessment_forms(is_active, valid_from, valid_until);

-- 3. RLS Policies
ALTER TABLE assessment_forms ENABLE ROW LEVEL SECURITY;

-- Allow students to view active forms
CREATE POLICY "Students can view active forms" ON assessment_forms
  FOR SELECT USING (
    is_active = true 
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until >= NOW())
  );

-- Allow admins to manage forms
CREATE POLICY "Admins can manage forms" ON assessment_forms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'superadmin')
    )
  );
